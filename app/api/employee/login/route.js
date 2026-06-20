import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";
import { signEmployee, EMP_COOKIE } from "@/lib/employeeAuth";

export async function POST(req) {
  const b = await req.json();
  const codigo = (b.codigo || "").trim().toUpperCase();
  const username = (b.username || "").trim().toLowerCase();
  const password = String(b.password || "");
  if (!codigo || !username || !password)
    return NextResponse.json({ error: "Completá todos los campos" }, { status: 400 });
  const db = await getDb();
  const company = await db.collection("companies").findOne({ codigo });
  if (!company) return NextResponse.json({ error: "Código de empresa inválido" }, { status: 401 });
  const emp = await db.collection("employees").findOne({ companyId: company._id, username, activo: { $ne: false } });
  if (!emp || !emp.passwordHash) return NextResponse.json({ error: "Usuario o contraseña incorrectos" }, { status: 401 });
  const ok = await bcrypt.compare(password, emp.passwordHash);
  if (!ok) return NextResponse.json({ error: "Usuario o contraseña incorrectos" }, { status: 401 });
  const token = await signEmployee({
    eid: emp._id.toString(), cid: company._id.toString(),
    role: emp.role || "empleado", nombre: emp.nombre, sucursal: emp.sucursal || "",
  });
  const res = NextResponse.json({ ok: true, nombre: emp.nombre, role: emp.role || "empleado" });
  res.cookies.set(EMP_COOKIE, token, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production",
    path: "/", maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
