"use client";

import { updateOrderStatus } from "@/lib/actions/orders";
import {
  getUpdatableOrderStatuses,
  isFinalOrderStatus,
  type ManagedOrderStatus,
} from "@/lib/order-status";
import { useTransition } from "react";
import { Loader2 } from "@/components/icons";

interface OrderStatusSelectProps {
  orderId: string;
  currentStatus: ManagedOrderStatus;
  statusLabels: Record<string, string>;
}

export default function OrderStatusSelect({
  orderId,
  currentStatus,
  statusLabels,
}: OrderStatusSelectProps) {
  const [isPending, startTransition] = useTransition();
  const availableStatuses = getUpdatableOrderStatuses(currentStatus);

  const statusConfig: Record<string, { border: string; bg: string; text: string }> = {
    PENDING_PAYMENT: { border: "border-amber-200", bg: "bg-amber-50", text: "text-amber-700" },
    PROCESSING: { border: "border-blue-200", bg: "bg-blue-50", text: "text-blue-700" },
    SHIPPED: { border: "border-indigo-200", bg: "bg-indigo-50", text: "text-indigo-700" },
    COMPLETED: { border: "border-emerald-200", bg: "bg-emerald-50", text: "text-emerald-700" },
  };

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as ManagedOrderStatus;

    startTransition(async () => {
      await updateOrderStatus(orderId, newStatus);
    });
  }

  if (isPending) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5">
        <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
        <span className="text-xs text-slate-500">Updating...</span>
      </div>
    );
  }

  const sc = statusConfig[currentStatus];

  if (isFinalOrderStatus(currentStatus)) {
    return (
      <span
        className={`inline-flex rounded-lg border px-3 py-1.5 text-xs font-semibold ${sc.border} ${sc.bg} ${sc.text}`}
      >
        {statusLabels[currentStatus]} Final
      </span>
    );
  }

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-semibold outline-none transition-colors ${sc.border} ${sc.bg} ${sc.text}`}
    >
      {availableStatuses.map((value) => (
        <option key={value} value={value}>
          {statusLabels[value]}
        </option>
      ))}
    </select>
  );
}
