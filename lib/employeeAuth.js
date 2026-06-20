import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const EMP_COOKIE = "cp_emp";
const secret = () => new TextEncoder().encode(process.env.EMPLOYEE_JWT_SECRET || "dev-insecure-secret-change-me");

export async function signEmployee(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret());
}

export async function verifyEmployeeToken(token) {
  try { const { payload } = await jwtVerify(token, secret()); return payload; }
  catch { return null; }
}

// Lee la sesión del empleado desde la cookie (server components / route handlers)
export async function getEmployeeSession() {
  const token = cookies().get(EMP_COOKIE)?.value;
  if (!token) return null;
  return await verifyEmployeeToken(token);
}
