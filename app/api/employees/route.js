import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";
import { requireCompany } from "@/lib/apiAuth";
import { oid, serializeEmployee } from "@/lib/serialize";

const ROLES = ["empleado", "supervisor", "rrhh"];

export async function POST(req) {
  const company = await requireCompany();
  if (!company) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const b = await req.json();
  if (!b.nombre || !b.nombre.trim()) return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
  if (!b.ingreso) return NextResponse.json({ error: "La fecha de ingreso es obligatoria" }, { status: 400 });
  const db = await getDb();
  const cid = oid(company.id);
  const username = (b.username || "").trim().toLowerCase();
  if (username) {
    const dup = await db.collection("employees").findOne({ companyId: cid, username });
    if (dup) return NextResponse.json({ error: "Ese usuario ya existe en la empresa" }, { status: 409 });
  }
  const doc = {
    companyId: cid,
    nombre: b.nombre.trim(),
    cedula: (b.cedula || "").trim(),
    puesto: (b.puesto || "").trim(),
    sucursal: (b.sucursal || "").trim(),
    salario: Number(b.salario) || 0,
    ingreso: b.ingreso,
    jornada: b.jornada || "Tiempo completo",
    contrato: b.contrato || "Indefinido",
    contratoFin: b.contrato === "Plazo fijo" ? (b.contratoFin || "") : "",
    role: ROLES.includes(b.role) ? b.role : "empleado",
    username: username || null,
    passwordHash: b.password ? await bcrypt.hash(String(b.password), 10) : null,
    activo: true,
    createdAt: new Date(),
  };
  const res = await db.collection("employees").insertOne(doc);
  doc._id = res.insertedId;
  return NextResponse.json({ employee: serializeEmployee(doc, { includeAuth: true }) });
}
