"use client";

import { updateOrderStatus } from "@/lib/actions/orders";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";

/**
 * Props untuk komponen OrderStatusSelect.
 */
interface OrderStatusSelectProps {
  orderId: string;
  currentStatus: string;
  statusLabels: Record<string, string>;
}

/**
 * Dropdown untuk mengubah status pesanan.
 */
export default function OrderStatusSelect({
  orderId,
  currentStatus,
  statusLabels,
}: OrderStatusSelectProps) {
  const [isPending, startTransition] = useTransition();

  const statusColors: Record<string, string> = {
    PENDING_PAYMENT: "border-yellow-300 bg-yellow-50 text-yellow-800",
    PROCESSING: "border-blue-300 bg-blue-50 text-blue-800",
    SHIPPED: "border-indigo-300 bg-indigo-50 text-indigo-800",
    COMPLETED: "border-green-300 bg-green-50 text-green-800",
  };

  /**
   * Menangani perubahan status pesanan.
   */
  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as
      | "PENDING_PAYMENT"
      | "PROCESSING"
      | "SHIPPED"
      | "COMPLETED";

    startTransition(async () => {
      await updateOrderStatus(orderId, newStatus);
    });
  }

  if (isPending) {
    return <Loader2 className="h-4 w-4 animate-spin text-gray-400" />;
  }

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      className={`text-xs font-medium px-2 py-1 rounded-lg border outline-none cursor-pointer ${statusColors[currentStatus]}`}
    >
      {Object.entries(statusLabels).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
