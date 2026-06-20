import { NextResponse } from "next/server";
import { EMP_COOKIE } from "@/lib/employeeAuth";
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(EMP_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
