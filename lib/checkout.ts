export interface ShippingOption {
  id: string;
  label: string;
  description: string;
  eta: string;
  fee: number;
  badge: string;
}

export interface PaymentOption {
  id: string;
  label: string;
  category: string;
  description: string;
  fee: number;
  badge: string;
}

export const shippingOptions: ShippingOption[] = [
  {
    id: "jne-reg",
    label: "JNE Reguler",
    description: "Pilihan seimbang untuk pengiriman standar ke sebagian besar kota.",
    eta: "2-4 hari kerja",
    fee: 18000,
    badge: "Paling populer",
  },
  {
    id: "sicepat-best",
    label: "SiCepat BEST",
    description: "Lebih cepat untuk area urban dengan alur pickup prioritas.",
    eta: "1-2 hari kerja",
    fee: 24000,
    badge: "Cepat",
  },
  {
    id: "anteraja-nextday",
    label: "AnterAja Next Day",
    description: "Opsi next-day untuk kota besar dengan prioritas distribusi.",
    eta: "Estimasi esok hari",
    fee: 32000,
    badge: "Next day",
  },
];

export const paymentOptions: PaymentOption[] = [
  {
    id: "bca-va",
    label: "BCA Virtual Account",
    category: "Transfer Bank",
    description: "Pembayaran otomatis terverifikasi dan cocok untuk nominal besar.",
    fee: 4000,
    badge: "Praktis",
  },
  {
    id: "qris",
    label: "QRIS / E-Wallet",
    category: "Pembayaran Digital",
    description: "Scan cepat lewat aplikasi bank atau dompet digital favorit Anda.",
    fee: 2500,
    badge: "Fleksibel",
  },
  {
    id: "credit-card",
    label: "Kartu Kredit / Debit",
    category: "Card Payment",
    description: "Pilihan cepat untuk pelanggan yang ingin langsung lunas di checkout.",
    fee: 6500,
    badge: "Instan",
  },
  {
    id: "cod",
    label: "Bayar di Tempat (COD)",
    category: "Cash on Delivery",
    description: "Bayar saat paket diterima. Cocok untuk area dengan jangkauan kurir tertentu.",
    fee: 6000,
    badge: "Familiar",
  },
];

export function getShippingOption(optionId: string | null | undefined) {
  return shippingOptions.find(
    (option) => option.id === optionId || option.label === optionId
  );
}

export function getPaymentOption(optionId: string | null | undefined) {
  return paymentOptions.find(
    (option) => option.id === optionId || option.label === optionId
  );
}

export interface CheckoutSnapshot {
  recipientName: string;
  contactEmail: string;
  phoneNumber: string;
  shippingService: string;
  paymentMethod: string;
  subtotalAmount: number;
  shippingFee: number;
  serviceFee: number;
  address: string;
  orderNotes?: string;
}

const CHECKOUT_SNAPSHOT_PREFIX = "BOOKSTORE_CHECKOUT_V2::";

export function serializeCheckoutSnapshot(snapshot: CheckoutSnapshot) {
  return `${CHECKOUT_SNAPSHOT_PREFIX}${JSON.stringify(snapshot)}`;
}

export function parseCheckoutSnapshot(value: string | null | undefined) {
  if (!value || !value.startsWith(CHECKOUT_SNAPSHOT_PREFIX)) {
    return null;
  }

  try {
    return JSON.parse(value.slice(CHECKOUT_SNAPSHOT_PREFIX.length)) as CheckoutSnapshot;
  } catch {
    return null;
  }
}