import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireCompany } from "@/lib/apiAuth";
import { oid, serializeAbsence } from "@/lib/serialize";

export async function POST(req) {
  const company = await requireCompany();
  if (!company) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const b = await req.json();
  if (!b.empId || !b.fecha) return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  const db = await getDb();
  const cid = oid(company.id);
  const doc = {
    companyId: cid, empId: b.empId, tipo: b.tipo || "Falta",
    fecha: b.fecha, dias: Number(b.dias) || 1, detalle: (b.detalle || "").trim(),
    createdAt: new Date(),
  };
  const res = await db.collection("absences").insertOne(doc);
  doc._id = res.insertedId;
  return NextResponse.json({ absence: serializeAbsence(doc) });
}
