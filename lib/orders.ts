import { parseCheckoutSnapshot } from "@/lib/checkout";

export type ResolvedPaymentStatus = "UNPAID" | "COD_PENDING" | "PAID";

export const paymentStatusLabels: Record<ResolvedPaymentStatus, string> = {
  UNPAID: "Belum Dibayar",
  COD_PENDING: "COD Belum Tertagih",
  PAID: "Sudah Dibayar",
};

export function parseStoredCheckoutSnapshot(
  rawCheckoutSnapshot?: string | null,
  legacyShippingAddress?: string | null
) {
  return parseCheckoutSnapshot(rawCheckoutSnapshot) ?? parseCheckoutSnapshot(legacyShippingAddress);
}

export function resolvePaymentStatus(
  paymentStatus: string | null | undefined,
  orderStatus: string
): ResolvedPaymentStatus {
  if (paymentStatus === "UNPAID" || paymentStatus === "COD_PENDING" || paymentStatus === "PAID") {
    return paymentStatus;
  }

  if (orderStatus === "COMPLETED") {
    return "PAID";
  }

  if (orderStatus === "PROCESSING" || orderStatus === "SHIPPED") {
    return "PAID";
  }

  return "UNPAID";
}

interface OrderPresentationSource {
  id: string;
  orderNumber?: string | null;
  status: string;
  paymentStatus?: string | null;
  totalAmount: number;
  subtotalAmount?: number | null;
  shippingFeeAmount?: number | null;
  serviceFeeAmount?: number | null;
  discountAmount?: number | null;
  taxAmount?: number | null;
  billingName?: string | null;
  billingEmail?: string | null;
  billingPhone?: string | null;
  billingAddress?: string | null;
  shippingName?: string | null;
  shippingEmail?: string | null;
  shippingPhone?: string | null;
  shippingAddress: string;
  paymentMethodLabel?: string | null;
  shippingMethodLabel?: string | null;
  notes?: string | null;
  rawCheckoutSnapshot?: string | null;
}

interface FallbackIdentity {
  name?: string | null;
  email?: string | null;
}

export function resolveOrderPresentation(
  order: OrderPresentationSource,
  fallbackIdentity?: FallbackIdentity
) {
  const legacyAddressSnapshot = parseCheckoutSnapshot(order.shippingAddress);
  const checkoutSnapshot = parseStoredCheckoutSnapshot(
    order.rawCheckoutSnapshot,
    order.shippingAddress
  );
  const isLegacyAddressStorage = Boolean(legacyAddressSnapshot);

  return {
    orderNumber: order.orderNumber ?? `LEG-${order.id.slice(0, 8).toUpperCase()}`,
    paymentStatus: resolvePaymentStatus(order.paymentStatus, order.status),
    recipientName:
      order.shippingName ?? checkoutSnapshot?.recipientName ?? fallbackIdentity?.name ?? "Pelanggan",
    contactEmail:
      order.shippingEmail ?? checkoutSnapshot?.contactEmail ?? fallbackIdentity?.email ?? "-",
    phoneNumber: order.shippingPhone ?? checkoutSnapshot?.phoneNumber ?? "Nomor belum tercatat",
    billingName:
      order.billingName ?? order.shippingName ?? checkoutSnapshot?.recipientName ?? fallbackIdentity?.name ?? "Pelanggan",
    billingEmail:
      order.billingEmail ?? order.shippingEmail ?? checkoutSnapshot?.contactEmail ?? fallbackIdentity?.email ?? "-",
    billingPhone:
      order.billingPhone ?? order.shippingPhone ?? checkoutSnapshot?.phoneNumber ?? "Nomor belum tercatat",
    billingAddress:
      order.billingAddress ??
      (isLegacyAddressStorage ? checkoutSnapshot?.address : order.shippingAddress) ??
      "Alamat tagihan belum tersedia.",
    shippingAddress:
      (!isLegacyAddressStorage ? order.shippingAddress : checkoutSnapshot?.address) ??
      "Alamat pengiriman belum tersedia.",
    paymentMethodLabel:
      order.paymentMethodLabel ?? checkoutSnapshot?.paymentMethod ?? "Metode belum tercatat",
    shippingMethodLabel:
      order.shippingMethodLabel ?? checkoutSnapshot?.shippingService ?? "Kurir belum tercatat",
    subtotalAmount:
      (order.subtotalAmount ?? 0) > 0
        ? (order.subtotalAmount ?? 0)
        : checkoutSnapshot?.subtotalAmount ?? order.totalAmount,
    shippingFeeAmount:
      (order.shippingFeeAmount ?? 0) > 0
        ? (order.shippingFeeAmount ?? 0)
        : checkoutSnapshot?.shippingFee ?? 0,
    serviceFeeAmount:
      (order.serviceFeeAmount ?? 0) > 0
        ? (order.serviceFeeAmount ?? 0)
        : checkoutSnapshot?.serviceFee ?? 0,
    discountAmount: order.discountAmount ?? 0,
    taxAmount: order.taxAmount ?? 0,
    orderNotes: order.notes ?? checkoutSnapshot?.orderNotes ?? null,
  };
}