import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getEmployeeSession } from "@/lib/employeeAuth";
import { oid, serializeRequest } from "@/lib/serialize";

export async function PATCH(req, { params }) {
  const sess = await getEmployeeSession();
  if (!sess) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const role = sess.role || "empleado";
  if (role !== "supervisor" && role !== "rrhh")
    return NextResponse.json({ error: "Sin permiso" }, { status: 403 });
  const b = await req.json();
  if (!["Aprobada", "Rechazada"].includes(b.estado))
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  const db = await getDb();
  const cid = oid(sess.cid);
  const r = await db.collection("requests").findOne({ _id: oid(params.id), companyId: cid });
  if (!r) return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  // verificar alcance: supervisor solo su sucursal
  const target = await db.collection("employees").findOne({ _id: oid(r.empId), companyId: cid });
  if (!target) return NextResponse.json({ error: "Empleado no encontrado" }, { status: 404 });
  if (role === "supervisor" && (target.sucursal || "") !== (sess.sucursal || ""))
    return NextResponse.json({ error: "Fuera de tu sucursal" }, { status: 403 });
  if (r.empId === sess.eid) return NextResponse.json({ error: "No podés aprobar tu propia solicitud" }, { status: 403 });
  await db.collection("requests").updateOne({ _id: r._id }, { $set: { estado: b.estado } });
  return NextResponse.json({ request: serializeRequest({ ...r, estado: b.estado }) });
}
