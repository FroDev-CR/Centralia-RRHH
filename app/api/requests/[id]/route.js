import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireCompany } from "@/lib/apiAuth";
import { oid, serializeRequest } from "@/lib/serialize";

export async function PATCH(req, { params }) {
  const company = await requireCompany();
  if (!company) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const b = await req.json();
  if (!["Aprobada", "Rechazada", "Pendiente"].includes(b.estado))
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  const db = await getDb();
  const cid = oid(company.id);
  const _id = oid(params.id);
  const r = await db.collection("requests").findOne({ _id, companyId: cid });
  if (!r) return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  await db.collection("requests").updateOne({ _id }, { $set: { estado: b.estado } });
  return NextResponse.json({ request: serializeRequest({ ...r, estado: b.estado }) });
}

export async function DELETE(req, { params }) {
  const company = await requireCompany();
  if (!company) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const db = await getDb();
  await db.collection("requests").deleteOne({ _id: oid(params.id), companyId: oid(company.id) });
  return NextResponse.json({ ok: true });
}
