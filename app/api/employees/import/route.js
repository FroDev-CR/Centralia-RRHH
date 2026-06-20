import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireCompany } from "@/lib/apiAuth";
import { oid, serializeEmployee } from "@/lib/serialize";

export async function POST(req) {
  const company = await requireCompany();
  if (!company) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const b = await req.json();
  const rows = Array.isArray(b.rows) ? b.rows : [];
  const cid = oid(company.id);
  const db = await getDb();
  const docs = rows
    .filter((r) => r.nombre && r.nombre.trim() && r.ingreso)
    .map((r) => ({
      companyId: cid,
      nombre: r.nombre.trim(),
      cedula: (r.cedula || "").toString().trim(),
      puesto: (r.puesto || "").toString().trim(),
      sucursal: (r.sucursal || "").toString().trim(),
      salario: Number(r.salario) || 0,
      ingreso: r.ingreso,
      jornada: r.jornada || "Tiempo completo",
      contrato: r.contrato || "Indefinido",
      contratoFin: "",
      role: "empleado",
      username: null,
      passwordHash: null,
      activo: true,
      createdAt: new Date(),
    }));
  if (!docs.length) return NextResponse.json({ inserted: 0, employees: [] });
  const res = await db.collection("employees").insertMany(docs);
  docs.forEach((d, i) => (d._id = res.insertedIds[i]));
  return NextResponse.json({ inserted: docs.length, employees: docs.map((d) => serializeEmployee(d, { includeAuth: true })) });
}
