import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";

const feat = [
  { ic: "📋", t: "Expediente y vacaciones", d: "Expediente digital de cada colaborador con vacaciones proporcionales calculadas solas (14 días/año, ley CR), solicitudes y aprobaciones." },
  { ic: "💵", t: "Nómina y CCSS", d: "Planilla mensual o quincenal con horas extra, cargas sociales CCSS, colillas imprimibles y aguinaldo proyectado." },
  { ic: "📊", t: "Métricas y alertas", d: "Dashboard con ausentismo, costo de planilla por sucursal, y alertas de período de prueba, vacaciones y contratos por vencer." },
  { ic: "🧮", t: "Liquidaciones", d: "Cálculo de liquidación (vacaciones, aguinaldo, preaviso y cesantía con tope de 8 años) según el Código de Trabajo." },
  { ic: "🏢", t: "Multi-empresa", d: "Cada patrón administra su propia empresa con un código único. Los empleados entran a su portal con ese código." },
  { ic: "👤", t: "Portal del empleado", d: "El colaborador consulta su saldo de vacaciones, sus colillas y solicita vacaciones o permisos desde su propio acceso." },
];

export default function Landing() {
  return (
    <main style={{ minHeight: "100vh", background: "rgb(var(--bg))", color: "rgb(var(--fg))" }}>
      <header style={{ position: "sticky", top: 0, zIndex: 30, backdropFilter: "blur(10px)", background: "rgba(6,8,11,.7)", borderBottom: "1px solid rgb(var(--border))" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "14px 22px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <span className="logo-sq brand-grad" style={{ fontSize: 18 }}>👥</span>
            <div style={{ lineHeight: 1.1 }}>
              <div style={{ fontWeight: 800, fontSize: 15 }}>Centralia</div>
              <div style={{ fontSize: 12, color: "rgb(var(--muted-fg))" }}>Personas</div>
            </div>
          </div>
          <nav style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/portal/login" className="btn-ghost">Portal empleado</Link>
            <SignedOut>
              <Link href="/sign-in" className="btn-grad brand-grad">Iniciar sesión</Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="btn-grad brand-grad">Ir al panel</Link>
            </SignedIn>
          </nav>
        </div>
      </header>

      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "72px 22px 40px", textAlign: "center" }}>
        <div style={{ display: "inline-block", fontSize: 12, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "rgb(var(--primary))", border: "1px solid rgb(var(--border))", borderRadius: 999, padding: "6px 14px", marginBottom: 22 }}>
          RRHH · Nómina · Costa Rica
        </div>
        <h1 style={{ fontSize: 46, fontWeight: 900, letterSpacing: "-.03em", lineHeight: 1.05, margin: 0, maxWidth: 760, marginInline: "auto" }}>
          Personal, vacaciones y planilla<br /><span className="text-grad">en un solo lugar</span>
        </h1>
        <p style={{ color: "rgb(var(--muted-fg))", fontSize: 17, maxWidth: 600, margin: "20px auto 30px", lineHeight: 1.5 }}>
          Centralia Personas convierte la asistencia de tu equipo en vacaciones, nómina y cumplimiento. Construido sobre la suite Centralia (ChatBot · POS · Marcaje).
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <SignedOut>
            <Link href="/sign-up" className="btn-grad brand-grad" style={{ padding: "13px 22px", fontSize: 15 }}>Crear mi empresa</Link>
            <Link href="/sign-in" className="btn-ghost" style={{ padding: "13px 22px", fontSize: 15 }}>Ya tengo cuenta</Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="btn-grad brand-grad" style={{ padding: "13px 22px", fontSize: 15 }}>Ir a mi panel</Link>
          </SignedIn>
        </div>
      </section>

      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "20px 22px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))", gap: 16 }}>
          {feat.map((f) => (
            <div key={f.t} style={{ background: "rgb(var(--card))", border: "1px solid rgb(var(--border))", borderRadius: 16, padding: "22px 20px" }}>
              <div style={{ fontSize: 26, marginBottom: 10 }}>{f.ic}</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{f.t}</div>
              <p style={{ color: "rgb(var(--muted-fg))", fontSize: 13.5, lineHeight: 1.5, margin: 0 }}>{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ borderTop: "1px solid rgb(var(--border))", padding: "26px 22px", textAlign: "center", color: "rgb(var(--muted-fg))", fontSize: 13 }}>
        Hecho en Costa Rica · Centralia. Las cifras regulatorias (CCSS, cesantía, vacaciones) son referencia 2025-2026 y deben validarse con asesoría laboral.
      </footer>
    </main>
  );
}
