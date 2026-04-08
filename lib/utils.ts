/**
 * Memformat angka menjadi format mata uang Rupiah.
 *
 * @param {number} amount - Jumlah dalam satuan Rupiah.
 * @returns {string} String terformat, contoh: "Rp 150.000"
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Memformat tanggal menjadi format Indonesia.
 *
 * @param {Date | string} date - Tanggal yang akan diformat.
 * @returns {string} String terformat, contoh: "2 Januari 2024"
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

/**
 * Memformat tanggal dan waktu menjadi format Indonesia.
 *
 * @param {Date | string | null | undefined} date - Tanggal yang akan diformat.
 * @returns {string} String terformat, contoh: "2 Januari 2024, 14.30"
 */
export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}
