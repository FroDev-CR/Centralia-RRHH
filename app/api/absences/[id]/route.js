import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireCompany } from "@/lib/apiAuth";
import { oid } from "@/lib/serialize";

export async function DELETE(req, { params }) {
  const company = await requireCompany();
  if (!company) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const db = await getDb();
  await db.collection("absences").deleteOne({ _id: oid(params.id), companyId: oid(company.id) });
  return NextResponse.json({ ok: true });
}
