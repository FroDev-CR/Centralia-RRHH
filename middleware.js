import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Rutas del admin (Clerk). El portal de empleados usa su propia cookie, no Clerk.
const isProtected = createRouteMatcher([
  "/dashboard(.*)",
  "/api/data",
  "/api/company",
  "/api/employees(.*)",
  "/api/requests(.*)",
  "/api/absences(.*)",
  "/api/payroll(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtected(req)) await auth.protect();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
};
