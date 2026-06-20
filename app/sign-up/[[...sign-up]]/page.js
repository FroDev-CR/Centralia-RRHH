import { SignUp } from "@clerk/nextjs";
export default function Page() {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "rgb(var(--bg))" }}>
      <SignUp appearance={{ variables: { colorPrimary: "#0d9488" } }} />
    </div>
  );
}
