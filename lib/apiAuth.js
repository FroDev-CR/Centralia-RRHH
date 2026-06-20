import { auth } from "@clerk/nextjs/server";
import { getOrCreateCompany } from "@/lib/company";

// Empresa del admin autenticado con Clerk. null si no hay sesión.
export async function requireCompany() {
  const { userId } = auth();
  if (!userId) return null;
  return await getOrCreateCompany(userId);
}
