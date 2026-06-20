import { getDb } from "@/lib/mongodb";

function genCode() {
  const a = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += a[Math.floor(Math.random() * a.length)];
  return s;
}

// Devuelve (creando si no existe) la empresa/tenant del admin de Clerk.
export async function getOrCreateCompany(clerkUserId, defaults = {}) {
  const db = await getDb();
  const col = db.collection("companies");
  let company = await col.findOne({ ownerClerkId: clerkUserId });
  if (company) return serializeCompany(company);

  // crear con código único
  let codigo, ok = false;
  for (let i = 0; i < 8 && !ok; i++) {
    codigo = genCode();
    if (!(await col.findOne({ codigo }))) ok = true;
  }
  const doc = {
    ownerClerkId: clerkUserId,
    nombre: defaults.nombre || "",
    codigo,
    ccssObrero: 10.67,
    ccssPatrono: 26.67,
    createdAt: new Date(),
  };
  const res = await col.insertOne(doc);
  doc._id = res.insertedId;
  return serializeCompany(doc);
}

export async function getCompanyByOwner(clerkUserId) {
  const db = await getDb();
  const c = await db.collection("companies").findOne({ ownerClerkId: clerkUserId });
  return c ? serializeCompany(c) : null;
}

export function serializeCompany(c) {
  return {
    id: c._id.toString(),
    nombre: c.nombre || "",
    codigo: c.codigo,
    ccssObrero: c.ccssObrero ?? 10.67,
    ccssPatrono: c.ccssPatrono ?? 26.67,
  };
}
