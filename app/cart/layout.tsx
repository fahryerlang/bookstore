import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import UserPanelShell from "@/components/UserPanelShell";

export default async function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();

  if (session.role === "ADMIN") {
    redirect("/admin");
  }

  return <UserPanelShell user={session}>{children}</UserPanelShell>;
}
