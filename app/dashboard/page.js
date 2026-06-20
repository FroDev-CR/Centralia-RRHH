import { redirect } from "next/navigation";
import { requireCompany } from "@/lib/apiAuth";
import DashboardApp from "@/components/DashboardApp";

export const dynamic = "force-dynamic";

export default async function Page() {
  let company;
  try {
    company = await requireCompany(); // crea el tenant en el primer ingreso
  } catch (e) {
    return <SetupError message={String(e?.message || e)} />;
  }
  if (!company) redirect("/sign-in");
  return <DashboardApp company={company} />;
}

function SetupError({ message }) {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "rgb(6 8 11)", color: "rgb(242 246 248)", fontFamily: "Poppins,system-ui,sans-serif" }}>
      <div style={{ maxWidth: 540, background: "rgb(16 22 26)", border: "1px solid rgb(33 44 48)", borderRadius: 16, padding: 28 }}>
        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>No se pudo conectar a la base de datos</div>
        <p style={{ color: "rgb(151 168 172)", fontSize: 14, lineHeight: 1.6, margin: "0 0 14px" }}>
          El panel no pudo iniciar porque falló la conexión a MongoDB. Revisá en Vercel/Atlas:
        </p>
        <ul style={{ color: "rgb(151 168 172)", fontSize: 13.5, lineHeight: 1.7, margin: "0 0 16px", paddingLeft: 18 }}>
          <li>MongoDB Atlas → <b>Network Access</b> → agregá <code>0.0.0.0/0</code> (Vercel usa IPs dinámicas).</li>
          <li>Vercel → Settings → Environment Variables → que <code>MONGODB_URI</code> esté cargada y el deploy sea posterior.</li>
        </ul>
        <div style={{ fontSize: 12, color: "rgb(248 113 113)", background: "rgba(248,113,113,.08)", border: "1px solid rgba(248,113,113,.3)", borderRadius: 10, padding: "10px 12px", fontFamily: "ui-monospace,monospace", wordBreak: "break-word" }}>{message}</div>
      </div>
    </div>
  );
}
