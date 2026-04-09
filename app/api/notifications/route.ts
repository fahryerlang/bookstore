import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

function serializeNotification(notification: {
  id: string;
  type: string;
  title: string;
  message: string;
  data: string | null;
  isRead: boolean;
  createdAt: Date;
}) {
  return {
    id: notification.id,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    data: notification.data,
    isRead: notification.isRead,
    createdAt: notification.createdAt.toISOString(),
  };
}

export async function GET(request: Request) {
  const session = await getSession();

  if (!session || session.role === "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const includePreview = searchParams.get("include") === "preview";

  if (!includePreview) {
    const unreadCount = await prisma.notification.count({
      where: {
        userId: session.id,
        isRead: false,
      },
    });

    return NextResponse.json({ unreadCount });
  }

  const [unreadCount, notifications] = await Promise.all([
    prisma.notification.count({
      where: {
        userId: session.id,
        isRead: false,
      },
    }),
    prisma.notification.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
  ]);

  return NextResponse.json({
    unreadCount,
    notifications: notifications.map(serializeNotification),
  });
}