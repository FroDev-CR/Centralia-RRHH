import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getEmployeeSession } from "@/lib/employeeAuth";
import { oid, serializeEmployee, serializeRequest } from "@/lib/serialize";
import { serializeCompany } from "@/lib/company";

export const dynamic = "force-dynamic";

export async function GET() {
  const sess = await getEmployeeSession();
  if (!sess) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const db = await getDb();
  const cid = oid(sess.cid);
  const me = await db.collection("employees").findOne({ _id: oid(sess.eid), companyId: cid });
  if (!me) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  const company = await db.collection("companies").findOne({ _id: cid });
  const myReqs = await db.collection("requests").find({ companyId: cid, empId: sess.eid }).toArray();
  const payrollDocs = await db.collection("payroll").find({ companyId: cid }).toArray();
  const colillas = payrollDocs
    .map((p) => ({ periodKey: p.periodKey, adj: (p.items || {})[sess.eid] || { extra: 0, otras: 0 } }))
    .filter((c) => c.periodKey);

  const out = {
    employee: serializeEmployee(me),
    company: serializeCompany(company),
    requests: myReqs.map(serializeRequest),
    colillas,
    team: null,
  };

  const role = sess.role || "empleado";
  if (role === "supervisor" || role === "rrhh") {
    // empleados del equipo (rrhh = toda la empresa; supervisor = su sucursal)
    const empFilter = role === "rrhh" ? { companyId: cid } : { companyId: cid, sucursal: me.sucursal || "" };
    const teamEmps = await db.collection("employees").find(empFilter).toArray();
    const ids = teamEmps.map((e) => e._id.toString());
    const teamReqs = await db.collection("requests")
      .find({ companyId: cid, empId: { $in: ids } }).toArray();
    out.team = {
      scope: role === "rrhh" ? "Toda la empresa" : `Sucursal ${me.sucursal || "—"}`,
      employees: teamEmps.map((e) => serializeEmployee(e)),
      requests: teamReqs.map(serializeRequest),
    };
  }
  return NextResponse.json(out);
}
