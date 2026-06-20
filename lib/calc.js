/* ============================================================
   Centralia Personas — lógica pura (compartida cliente/servidor)
   Reglas laborales de Costa Rica (referencia 2025-2026).
   ============================================================ */
export const DAY = 86400000;
export const VAC_ANUAL = 14;     // días de vacaciones por año (mínimo de ley CR)
export const PRUEBA_DIAS = 90;   // período de prueba ~3 meses

export const todayISO = () => new Date().toISOString().slice(0, 10);
export const fmtMoney = (n) => "₡" + Math.round(Number(n) || 0).toLocaleString("es-CR");
export function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("es-CR", { day: "2-digit", month: "short", year: "numeric" });
}
export function daysBetween(a, b) {
  return Math.round((new Date(b + "T00:00:00") - new Date(a + "T00:00:00")) / DAY);
}
export function inclusiveDays(a, b) { const d = daysBetween(a, b); return d >= 0 ? d + 1 : 0; }
export function addDays(iso, n) { const d = new Date(iso + "T00:00:00"); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); }
export function initials(n) { return (n || "?").trim().split(/\s+/).slice(0, 2).map((x) => x[0] || "").join("").toUpperCase(); }

/* ---------- vacaciones ---------- */
export function vacAccrued(emp, asOf = todayISO()) {
  if (!emp.ingreso) return 0;
  const dd = Math.max(0, daysBetween(emp.ingreso, asOf));
  return (dd / 365) * VAC_ANUAL;
}
export function vacTaken(emp, requests) {
  return (requests || [])
    .filter((r) => r.empId === emp.id && r.tipo === "Vacaciones" && r.estado === "Aprobada")
    .reduce((s, r) => s + (Number(r.dias) || 0), 0);
}
export function vacBalance(emp, requests) { return vacAccrued(emp) - vacTaken(emp, requests); }

/* ---------- alertas derivadas ---------- */
export function buildAlerts(employees, requests) {
  const out = []; const t = todayISO();
  (employees || []).forEach((e) => {
    if (e.ingreso) {
      const finPrueba = addDays(e.ingreso, PRUEBA_DIAS); const d = daysBetween(t, finPrueba);
      if (d >= 0 && d <= 15) out.push({ emp: e, txt: `Termina el período de prueba el ${fmtDate(finPrueba)}`, ico: "timer", tone: "warning" });
    }
    const bal = vacBalance(e, requests);
    if (bal >= 12) out.push({ emp: e, txt: `Tiene ${bal.toFixed(1)} días de vacaciones acumulados sin tomar`, ico: "umbrella", tone: "primary" });
    if (e.contrato === "Plazo fijo" && e.contratoFin) {
      const d = daysBetween(t, e.contratoFin);
      if (d >= 0 && d <= 30) out.push({ emp: e, txt: `Contrato a plazo fijo vence el ${fmtDate(e.contratoFin)}`, ico: "file-clock", tone: "destructive" });
    }
  });
  return out;
}

/* ---------- nómina ---------- */
export function calcRow(e, adj, company, period) {
  const base = period.tipo === "Mensual" ? (e.salario || 0) : (e.salario || 0) / 2;
  const extra = Number(adj?.extra) || 0;
  const bruto = base + extra;
  const obrero = bruto * ((company.ccssObrero ?? 10.67) / 100);
  const otras = Number(adj?.otras) || 0;
  const neto = bruto - obrero - otras;
  const patrono = bruto * ((company.ccssPatrono ?? 26.67) / 100);
  return { base, extra, bruto, obrero, otras, neto, patrono };
}
export function periodLabel(period) {
  const [y, m] = period.mes.split("-");
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "set", "oct", "nov", "dic"];
  const base = `${meses[+m - 1]} ${y}`;
  return period.tipo === "Quincenal" ? `${base} · Quincena ${period.quincena}` : `${base} · Mensual`;
}
export function periodKey(period) {
  return `${period.mes}|${period.tipo}${period.tipo === "Quincenal" ? "-Q" + period.quincena : ""}`;
}

/* ---------- aguinaldo (ciclo dic–nov) ---------- */
export function aguinaldoDe(e, asOf = todayISO()) {
  if (!e.ingreso || !e.salario) return 0;
  const Y = new Date(asOf + "T00:00:00").getFullYear();
  const cycleStart = `${Y - 1}-12-01`, cycleEnd = `${Y}-11-30`;
  if (asOf < cycleStart) return 0;
  const ini = e.ingreso > cycleStart ? e.ingreso : cycleStart;
  const fin = asOf < cycleEnd ? asOf : cycleEnd;
  const dias = Math.max(0, daysBetween(ini, fin));
  const meses = Math.min(12, dias / 30.42);
  return (e.salario * meses) / 12;
}

/* ---------- liquidación ---------- */
export function cesantiaDays(years) {
  const table = [19.5, 20, 20.5, 21, 21.24, 21.5, 22, 22]; // año 1..8, tope 8 años
  const y = Math.min(Math.floor(years), 8); let d = 0;
  for (let i = 0; i < y; i++) d += table[i];
  return d;
}
export function liquidacion(e, fecha, causa, requests) {
  const dias = Math.max(0, daysBetween(e.ingreso, fecha));
  const years = dias / 365;
  const sal = e.salario || 0;
  const diario = sal / 30;
  const accruedAt = (dias / 365) * VAC_ANUAL;
  const balVac = Math.max(0, accruedAt - vacTaken(e, requests));
  const vacMonto = balVac * diario;
  const Y = new Date(fecha + "T00:00:00").getFullYear();
  const cycleStart = fecha >= `${Y}-12-01` ? `${Y}-12-01` : `${Y - 1}-12-01`;
  const iniA = e.ingreso > cycleStart ? e.ingreso : cycleStart;
  const mesesA = Math.min(12, Math.max(0, daysBetween(iniA, fecha)) / 30.42);
  const aguMonto = (sal * mesesA) / 12;
  const preDias = years >= 1 ? 30 : years >= 0.5 ? 15 : years >= 0.25 ? 7 : 0;
  const preMonto = preDias * diario;
  let cesMonto = 0, cesDias = 0;
  const despido = causa.indexOf("Despido") === 0;
  if (despido && years >= 0.25) { cesDias = cesantiaDays(years); cesMonto = cesDias * diario; }
  const total = vacMonto + aguMonto + preMonto + cesMonto;
  return { years, diario, balVac, vacMonto, mesesA, aguMonto, preDias, preMonto, cesDias, cesMonto, despido, total };
}
