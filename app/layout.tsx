import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BookStore - Toko Buku Online Terpercaya",
  description:
    "Temukan koleksi buku terlengkap dari berbagai kategori. Belanja buku online dengan harga terbaik dan pengiriman cepat ke seluruh Indonesia.",
};

/**
 * Root layout aplikasi BookStore.
 * Menampilkan Navbar dan Footer di semua halaman kecuali admin dan auth.
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-gray-900 font-sans">
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
