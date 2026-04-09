"use client";

import dynamic from "next/dynamic";
import { Bell } from "@/components/icons";

const NotificationBell = dynamic(() => import("@/components/NotificationBell"), {
  loading: () => (
    <span
      aria-hidden="true"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-400"
    >
      <Bell className="h-5 w-5" />
    </span>
  ),
});

export default function DeferredNotificationBell() {
  return <NotificationBell />;
}