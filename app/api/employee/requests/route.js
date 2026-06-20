import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getEmployeeSession } from "@/lib/employeeAuth";
import { oid, serializeRequest } from "@/lib/serialize";
import { daysBetween } from "@/lib/calc";

export async function POST(req) {
  const sess = await getEmployeeSession();
  if (!sess) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const b = await req.json();
  if (!b.desde || !b.hasta) return NextResponse.json({ error: "Faltan fechas" }, { status: 400 });
  if (daysBetween(b.desde, b.hasta) < 0) return NextResponse.json({ error: "Rango de fechas inválido" }, { status: 400 });
  const dias = Number(b.dias) || 0;
  if (dias <= 0) return NextResponse.json({ error: "Los días deben ser mayor a 0" }, { status: 400 });
  const db = await getDb();
  const doc = {
    companyId: oid(sess.cid), empId: sess.eid, tipo: b.tipo || "Vacaciones",
    desde: b.desde, hasta: b.hasta, dias, estado: "Pendiente",
    nota: (b.nota || "").trim(), creado: new Date().toISOString(), origen: "empleado",
  };
  const res = await db.collection("requests").insertOne(doc);
  doc._id = res.insertedId;
  return NextResponse.json({ request: serializeRequest(doc) });
}
