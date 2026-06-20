import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";
import { requireCompany } from "@/lib/apiAuth";
import { oid, serializeEmployee } from "@/lib/serialize";

const ROLES = ["empleado", "supervisor", "rrhh"];

export async function PATCH(req, { params }) {
  const company = await requireCompany();
  if (!company) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const b = await req.json();
  const db = await getDb();
  const cid = oid(company.id);
  const _id = oid(params.id);
  const emp = await db.collection("employees").findOne({ _id, companyId: cid });
  if (!emp) return NextResponse.json({ error: "Empleado no encontrado" }, { status: 404 });
  const set = {};
  for (const k of ["nombre", "cedula", "puesto", "sucursal", "ingreso", "jornada", "contrato", "contratoFin"]) {
    if (b[k] != null) set[k] = typeof b[k] === "string" ? b[k].trim() : b[k];
  }
  if (b.salario != null) set.salario = Number(b.salario) || 0;
  if (b.role && ROLES.includes(b.role)) set.role = b.role;
  if (b.activo != null) set.activo = !!b.activo;
  if (set.contrato && set.contrato !== "Plazo fijo") set.contratoFin = "";
  if (b.username != null) {
    const username = b.username.trim().toLowerCase() || null;
    if (username) {
      const dup = await db.collection("employees").findOne({ companyId: cid, username, _id: { $ne: _id } });
      if (dup) return NextResponse.json({ error: "Ese usuario ya existe" }, { status: 409 });
    }
    set.username = username;
  }
  if (b.password) set.passwordHash = await bcrypt.hash(String(b.password), 10);
  await db.collection("employees").updateOne({ _id }, { $set: set });
  const updated = await db.collection("employees").findOne({ _id });
  return NextResponse.json({ employee: serializeEmployee(updated, { includeAuth: true }) });
}

export async function DELETE(req, { params }) {
  const company = await requireCompany();
  if (!company) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const db = await getDb();
  const cid = oid(company.id);
  const id = params.id;
  await db.collection("employees").deleteOne({ _id: oid(id), companyId: cid });
  await db.collection("requests").deleteMany({ companyId: cid, empId: id });
  await db.collection("absences").deleteMany({ companyId: cid, empId: id });
  return NextResponse.json({ ok: true });
}
