"use client";

import Link from "next/link";
import { Bell } from "@/components/icons";
import { markAllNotificationsAsRead, markNotificationAsRead } from "@/lib/actions/notifications";
import { useState, useRef, useEffect, useTransition } from "react";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  data: string | null;
  isRead: boolean;
  createdAt: string;
}

function timeAgo(dateStr: string) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "Baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
}

async function fetchNotificationSnapshot(includePreview = false) {
  const response = await fetch(
    includePreview ? "/api/notifications?include=preview" : "/api/notifications",
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error("Gagal memuat notifikasi.");
  }

  return response.json() as Promise<{
    unreadCount: number;
    notifications?: NotificationItem[];
  }>;
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasLoadedPreview, setHasLoadedPreview] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isPending, startTransition] = useTransition();
  const panelRef = useRef<HTMLDivElement>(null);
  const previewRequestRef = useRef(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    let isMounted = true;

    fetchNotificationSnapshot()
      .then((data) => {
        if (isMounted) {
          setUnreadCount(data.unreadCount);
        }
      })
      .catch(() => {
        if (isMounted) {
          setUnreadCount(0);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isOpen || hasLoadedPreview || !isLoadingPreview || previewRequestRef.current) {
      return;
    }

    let isMounted = true;
    previewRequestRef.current = true;

    fetchNotificationSnapshot(true)
      .then((data) => {
        if (!isMounted) {
          return;
        }

        setNotifications(data.notifications ?? []);
        setUnreadCount(data.unreadCount);
        setHasLoadedPreview(true);
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        setNotifications([]);
        setHasLoadedPreview(true);
      })
      .finally(() => {
        previewRequestRef.current = false;

        if (isMounted) {
          setIsLoadingPreview(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [hasLoadedPreview, isLoadingPreview, isOpen]);

  function handleTogglePanel() {
    const nextIsOpen = !isOpen;

    if (nextIsOpen && !hasLoadedPreview && !isLoadingPreview) {
      setIsLoadingPreview(true);
    }

    setIsOpen(nextIsOpen);
  }

  function handleMarkAllRead() {
    startTransition(async () => {
      await markAllNotificationsAsRead();
      setNotifications((current) =>
        current.map((notification) => ({ ...notification, isRead: true }))
      );
      setUnreadCount(0);
    });
  }

  function handleMarkRead(id: string) {
    startTransition(async () => {
      await markNotificationAsRead(id);
      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id ? { ...notification, isRead: true } : notification
        )
      );
      setUnreadCount((current) => Math.max(0, current - 1));
    });
  }

  function getNotificationLink(notif: NotificationItem): string | null {
    if (!notif.data) return null;
    try {
      const data = JSON.parse(notif.data);
      if (data.orderId) return `/dashboard/orders/${data.orderId}/track`;
    } catch {
      // ignore
    }
    return null;
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={handleTogglePanel}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-primary hover:text-primary"
        aria-label="Notifikasi"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-slate-200 bg-white shadow-[0_24px_60px_-20px_rgba(15,23,42,0.3)]">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <h3 className="text-sm font-bold text-slate-900">Notifikasi</h3>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                disabled={isPending}
                className="text-[11px] font-semibold text-primary hover:text-primary-dark"
              >
                Tandai semua dibaca
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {isLoadingPreview ? (
              <div className="px-4 py-8 text-center text-sm text-slate-500">
                Memuat notifikasi...
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell className="mx-auto h-8 w-8 text-slate-300" />
                <p className="mt-2 text-sm text-slate-500">Belum ada notifikasi</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const link = getNotificationLink(notif);

                return (
                  <div
                    key={notif.id}
                    className={`border-b border-slate-50 px-4 py-3 transition hover:bg-slate-50 ${
                      !notif.isRead ? "bg-primary-50/30" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${notif.isRead ? "bg-transparent" : "bg-primary"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900">{notif.title}</p>
                        <p className="mt-0.5 text-xs text-slate-500 line-clamp-2">{notif.message}</p>
                        <div className="mt-1.5 flex items-center gap-3">
                          <span className="text-[10px] text-slate-400">{timeAgo(notif.createdAt)}</span>
                          {link && (
                            <Link
                              href={link}
                              onClick={() => {
                                setIsOpen(false);
                                if (!notif.isRead) handleMarkRead(notif.id);
                              }}
                              className="text-[10px] font-semibold text-primary hover:text-primary-dark"
                            >
                              Lihat detail
                            </Link>
                          )}
                          {!notif.isRead && (
                            <button
                              type="button"
                              onClick={() => handleMarkRead(notif.id)}
                              className="text-[10px] font-semibold text-slate-400 hover:text-slate-600"
                            >
                              Tandai dibaca
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
