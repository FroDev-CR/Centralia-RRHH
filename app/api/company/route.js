import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireCompany } from "@/lib/apiAuth";
import { oid } from "@/lib/serialize";

export async function PATCH(req) {
  const company = await requireCompany();
  if (!company) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const b = await req.json();
  const set = {};
  if (typeof b.nombre === "string") set.nombre = b.nombre.trim();
  if (b.ccssObrero != null && !isNaN(+b.ccssObrero)) set.ccssObrero = +b.ccssObrero;
  if (b.ccssPatrono != null && !isNaN(+b.ccssPatrono)) set.ccssPatrono = +b.ccssPatrono;
  const db = await getDb();
  await db.collection("companies").updateOne({ _id: oid(company.id) }, { $set: set });
  return NextResponse.json({ ok: true });
}
