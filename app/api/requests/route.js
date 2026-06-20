import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireCompany } from "@/lib/apiAuth";
import { oid, serializeRequest } from "@/lib/serialize";
import { daysBetween } from "@/lib/calc";

export async function POST(req) {
  const company = await requireCompany();
  if (!company) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const b = await req.json();
  if (!b.empId || !b.desde || !b.hasta) return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  if (daysBetween(b.desde, b.hasta) < 0) return NextResponse.json({ error: "La fecha 'hasta' no puede ser antes de 'desde'" }, { status: 400 });
  const dias = Number(b.dias) || 0;
  if (dias <= 0) return NextResponse.json({ error: "Los días deben ser mayor a 0" }, { status: 400 });
  const db = await getDb();
  const cid = oid(company.id);
  const emp = await db.collection("employees").findOne({ _id: oid(b.empId), companyId: cid });
  if (!emp) return NextResponse.json({ error: "Empleado no encontrado" }, { status: 404 });
  const doc = {
    companyId: cid, empId: b.empId, tipo: b.tipo || "Vacaciones",
    desde: b.desde, hasta: b.hasta, dias, estado: "Pendiente",
    nota: (b.nota || "").trim(), creado: new Date().toISOString(), origen: "admin",
  };
  const res = await db.collection("requests").insertOne(doc);
  doc._id = res.insertedId;
  return NextResponse.json({ request: serializeRequest(doc) });
}
