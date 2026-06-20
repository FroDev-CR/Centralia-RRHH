import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireCompany } from "@/lib/apiAuth";
import { oid } from "@/lib/serialize";

export async function PATCH(req) {
  const company = await requireCompany();
  if (!company) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const b = await req.json();
  if (!b.periodKey || !b.empId || !["extra", "otras"].includes(b.field))
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  const db = await getDb();
  const cid = oid(company.id);
  const val = Number(b.value) || 0;
  await db.collection("payroll").updateOne(
    { companyId: cid, periodKey: b.periodKey },
    { $set: { [`items.${b.empId}.${b.field}`]: val } },
    { upsert: true }
  );
  return NextResponse.json({ ok: true });
}
