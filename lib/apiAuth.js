import { auth } from "@clerk/nextjs/server";
import { getOrCreateCompany } from "@/lib/company";

// Empresa del admin autenticado con Clerk. null si no hay sesión.
// En Clerk v6 auth() es asíncrono: hay que await.
export async function requireCompany() {
  const { userId } = await auth();
  if (!userId) return null;
  return await getOrCreateCompany(userId);
}
