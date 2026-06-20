import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireCompany } from "@/lib/apiAuth";
import { oid, serializeEmployee, serializeRequest, serializeAbsence } from "@/lib/serialize";

export const dynamic = "force-dynamic";

export async function GET() {
  const company = await requireCompany();
  if (!company) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const db = await getDb();
  const cid = oid(company.id);
  const [employees, requests, absences, payrollDocs] = await Promise.all([
    db.collection("employees").find({ companyId: cid }).sort({ nombre: 1 }).toArray(),
    db.collection("requests").find({ companyId: cid }).toArray(),
    db.collection("absences").find({ companyId: cid }).toArray(),
    db.collection("payroll").find({ companyId: cid }).toArray(),
  ]);
  const payroll = {};
  payrollDocs.forEach((p) => { payroll[p.periodKey] = { items: p.items || {} }; });
  return NextResponse.json({
    company,
    employees: employees.map((e) => serializeEmployee(e, { includeAuth: true })),
    requests: requests.map(serializeRequest),
    absences: absences.map(serializeAbsence),
    payroll,
  });
}
