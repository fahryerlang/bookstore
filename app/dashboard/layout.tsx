import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import UserPanelShell from "@/components/UserPanelShell";

export default async function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();

  if (session.role === "ADMIN") {
    redirect("/admin");
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const serializedNotifications = notifications.map((n) => ({
    id: n.id,
    type: n.type,
    title: n.title,
    message: n.message,
    data: n.data,
    isRead: n.isRead,
    createdAt: n.createdAt.toISOString(),
  }));

  return (
    <UserPanelShell
      user={session}
      notifications={serializedNotifications}
      unreadNotificationCount={unreadCount}
    >
      {children}
    </UserPanelShell>
  );
}
