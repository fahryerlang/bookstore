export const ORDER_STATUS_FLOW = [
  "PENDING_PAYMENT",
  "PROCESSING",
  "SHIPPED",
  "COMPLETED",
] as const;

export type ManagedOrderStatus = (typeof ORDER_STATUS_FLOW)[number];

export function isManagedOrderStatus(value: string): value is ManagedOrderStatus {
  return ORDER_STATUS_FLOW.includes(value as ManagedOrderStatus);
}

export function isFinalOrderStatus(status: ManagedOrderStatus) {
  return status === "COMPLETED";
}

export function getUpdatableOrderStatuses(
  currentStatus: ManagedOrderStatus
): ManagedOrderStatus[] {
  const currentIndex = ORDER_STATUS_FLOW.indexOf(currentStatus);

  if (currentIndex < 0 || currentIndex >= ORDER_STATUS_FLOW.length - 1) {
    return [];
  }

  return [currentStatus, ORDER_STATUS_FLOW[currentIndex + 1]];
}

export function canAdvanceOrderStatus(
  currentStatus: ManagedOrderStatus,
  nextStatus: ManagedOrderStatus
) {
  const currentIndex = ORDER_STATUS_FLOW.indexOf(currentStatus);
  const nextIndex = ORDER_STATUS_FLOW.indexOf(nextStatus);

  if (currentIndex < 0 || nextIndex < 0) {
    return false;
  }

  if (currentIndex === nextIndex) {
    return true;
  }

  return nextIndex === currentIndex + 1;
}