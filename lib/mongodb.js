import { MongoClient } from "mongodb";

const dbName = process.env.MONGODB_DB || "centralia_personas";
const options = { serverSelectionTimeoutMS: 8000, connectTimeoutMS: 8000 };

// Conexión perezosa: se crea en la primera llamada (no al importar el módulo),
// así el build de Next nunca intenta conectar a la base de datos.
function getClientPromise() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Falta la variable MONGODB_URI en Vercel.");
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) global._mongoClientPromise = new MongoClient(uri, options).connect();
    return global._mongoClientPromise;
  }
  if (!global._mongoClientPromiseProd) global._mongoClientPromiseProd = new MongoClient(uri, options).connect();
  return global._mongoClientPromiseProd;
}

let indexesReady = false;
export async function getDb() {
  const client = await getClientPromise();
  const db = client.db(dbName);
  if (!indexesReady) {
    indexesReady = true;
    try {
      await Promise.all([
        db.collection("companies").createIndex({ ownerClerkId: 1 }, { unique: true }),
        db.collection("companies").createIndex({ codigo: 1 }, { unique: true }),
        db.collection("employees").createIndex({ companyId: 1 }),
        db.collection("employees").createIndex({ companyId: 1, username: 1 }, { unique: true, partialFilterExpression: { username: { $type: "string" } } }),
        db.collection("requests").createIndex({ companyId: 1 }),
        db.collection("absences").createIndex({ companyId: 1 }),
        db.collection("payroll").createIndex({ companyId: 1, periodKey: 1 }, { unique: true }),
      ]);
    } catch (e) { indexesReady = false; }
  }
  return db;
}
