import { redirect } from "next/navigation";
import { requireCompany } from "@/lib/apiAuth";
import DashboardApp from "@/components/DashboardApp";

export const dynamic = "force-dynamic";

export default async function Page() {
  const company = await requireCompany(); // crea el tenant en el primer ingreso
  if (!company) redirect("/sign-in");
  return <DashboardApp company={company} />;
}
