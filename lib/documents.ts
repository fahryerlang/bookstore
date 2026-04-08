import { Prisma } from "@/app/generated/prisma/client";

const DOCUMENT_PREFIX: Record<DocumentKind, string> = {
  ORDER: "ORD",
  INVOICE: "INV",
};

export type DocumentKind = "ORDER" | "INVOICE";

function getPeriodKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}${month}`;
}

export async function getNextDocumentNumber(
  tx: Prisma.TransactionClient,
  documentType: DocumentKind,
  issuedAt = new Date()
) {
  const periodKey = getPeriodKey(issuedAt);
  const sequence = await tx.documentSequence.upsert({
    where: {
      documentType_periodKey: {
        documentType,
        periodKey,
      },
    },
    update: {
      lastValue: {
        increment: 1,
      },
    },
    create: {
      documentType,
      periodKey,
      lastValue: 1,
    },
    select: {
      lastValue: true,
    },
  });

  return `${DOCUMENT_PREFIX[documentType]}/${periodKey}/${String(sequence.lastValue).padStart(6, "0")}`;
}

export function getInvoiceDueDate(paymentMethodId: string, createdAt = new Date()) {
  if (paymentMethodId === "cod") {
    return null;
  }

  const dueDate = new Date(createdAt);
  dueDate.setDate(dueDate.getDate() + 1);
  return dueDate;
}