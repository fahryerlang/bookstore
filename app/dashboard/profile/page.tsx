import { redirect } from "next/navigation";
import ProfileOverview from "@/components/ProfileOverview";
import {
  Banknote,
  CreditCard,
  LayoutDashboard,
  MessageSquare,
  Package,
  ShoppingBag,
  ShoppingCart,
} from "@/components/icons";
import { requireAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { formatDate, formatRupiah } from "@/lib/utils";

export default async function UserDashboardProfilePage() {
  const session = await requireAuth();

  if (session.role === "ADMIN") {
    redirect("/admin/profile");
  }

  const [user, cartItemCount, totalOrderCount, activeOrderCount, totalSpent, messageCount] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: session.id },
        select: { name: true, email: true, createdAt: true },
      }),
      prisma.cartItem.count({ where: { userId: session.id } }),
      prisma.order.count({ where: { userId: session.id } }),
      prisma.order.count({
        where: {
          userId: session.id,
          status: { in: ["PENDING_PAYMENT", "PROCESSING", "SHIPPED"] },
        },
      }),
      prisma.order.aggregate({
        where: { userId: session.id, status: "COMPLETED" },
        _sum: { totalAmount: true },
      }),
      prisma.message.count({ where: { userId: session.id } }),
    ]);

  if (!user) {
    redirect("/login");
  }

  return (
    <ProfileOverview
      eyebrow="User Workspace"
      title="Profil & Aktivitas Belanja"
      description={`${user.name}, semua ringkasan akun, progres transaksi, dan pintasan penting tersedia di panel user yang terintegrasi.`}
      roleLabel="Pembeli Aktif"
      roleTone="border border-cyan-200 bg-cyan-50 text-cyan-800"
      avatarTone="border-cyan-200 bg-cyan-50 text-cyan-700"
      glowTone="bg-cyan-200/70"
      user={user}
      summaryTitle="Akun siap dipakai"
      summaryText="Gunakan halaman ini untuk melihat status akun pribadi, memantau belanja, lalu lanjut ke keranjang atau checkout dengan jalur singkat."
      meta={[
        { label: "Nama lengkap", value: user.name },
        { label: "Email", value: user.email },
        { label: "Peran akun", value: "Pelanggan" },
        { label: "Member sejak", value: formatDate(user.createdAt) },
        { label: "Pesan terkirim", value: `${messageCount} pesan` },
      ]}
      stats={[
        {
          label: "Item di Keranjang",
          value: cartItemCount,
          hint: "Siap diproses saat Anda ingin checkout.",
          icon: ShoppingCart,
          tone: "bg-cyan-50 text-cyan-700",
        },
        {
          label: "Total Pesanan",
          value: totalOrderCount,
          hint: "Riwayat transaksi pribadi sejak akun dibuat.",
          icon: ShoppingBag,
          tone: "bg-sky-50 text-sky-700",
        },
        {
          label: "Pesanan Aktif",
          value: activeOrderCount,
          hint: "Masih menunggu, diproses, atau sedang dikirim.",
          icon: Package,
          tone: "bg-amber-50 text-amber-700",
        },
        {
          label: "Total Belanja",
          value: formatRupiah(totalSpent._sum.totalAmount ?? 0),
          hint: "Akumulasi nilai pesanan yang sudah selesai.",
          icon: Banknote,
          tone: "bg-emerald-50 text-emerald-700",
        },
      ]}
      actions={[
        {
          href: "/dashboard",
          label: "Dashboard Saya",
          description: "Buka ringkasan belanja dan pesanan terbaru Anda.",
          icon: LayoutDashboard,
        },
        {
          href: "/dashboard/books",
          label: "Jelajah Buku",
          description: "Temukan judul terbaru lewat katalog panel user.",
          icon: ShoppingBag,
        },
        {
          href: "/checkout",
          label: "Lanjut Checkout",
          description: "Selesaikan pesanan yang sudah siap dibayar.",
          icon: CreditCard,
        },
        {
          href: "/contact",
          label: "Hubungi Admin",
          description: "Kirim pertanyaan atau masukan langsung dari panel.",
          icon: MessageSquare,
        },
      ]}
    />
  );
}
