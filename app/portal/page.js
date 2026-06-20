import { redirect } from "next/navigation";
import { getEmployeeSession } from "@/lib/employeeAuth";
import PortalApp from "@/components/PortalApp";

export const dynamic = "force-dynamic";

export default async function Page() {
  const sess = await getEmployeeSession();
  if (!sess) redirect("/portal/login");
  return <PortalApp />;
}
