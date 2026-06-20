import { ObjectId } from "mongodb";

export function oid(id) {
  try { return new ObjectId(id); } catch { return null; }
}

export function serializeEmployee(e, { includeAuth = false } = {}) {
  const out = {
    id: e._id.toString(),
    companyId: e.companyId?.toString?.() || String(e.companyId),
    nombre: e.nombre || "",
    cedula: e.cedula || "",
    puesto: e.puesto || "",
    sucursal: e.sucursal || "",
    salario: e.salario || 0,
    ingreso: e.ingreso || "",
    jornada: e.jornada || "Tiempo completo",
    contrato: e.contrato || "Indefinido",
    contratoFin: e.contratoFin || "",
    role: e.role || "empleado",
    username: e.username || "",
    activo: e.activo !== false,
  };
  if (includeAuth) out.hasPassword = !!e.passwordHash;
  return out;
}

export function serializeRequest(r) {
  return {
    id: r._id.toString(),
    empId: r.empId,
    tipo: r.tipo,
    desde: r.desde,
    hasta: r.hasta,
    dias: r.dias,
    estado: r.estado,
    nota: r.nota || "",
    creado: r.creado,
    origen: r.origen || "admin",
  };
}

export function serializeAbsence(a) {
  return {
    id: a._id.toString(),
    empId: a.empId,
    tipo: a.tipo,
    fecha: a.fecha,
    dias: a.dias || 1,
    detalle: a.detalle || "",
  };
}
