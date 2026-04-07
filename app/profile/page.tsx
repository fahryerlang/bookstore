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
import { getPaymentOption, getShippingOption, parseCheckoutSnapshot } from "@/lib/checkout";
import prisma from "@/lib/prisma";
import { formatDate, formatRupiah } from "@/lib/utils";

export default async function ProfilePage() {
  const session = await requireAuth();

  if (session.role === "ADMIN") {
    redirect("/admin/profile");
  }

  const [user, cartItemCount, totalOrderCount, activeOrderCount, totalSpent, messageCount, latestOrder] =
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
      prisma.order.findFirst({
        where: { userId: session.id },
        orderBy: { createdAt: "desc" },
        select: { createdAt: true, shippingAddress: true },
      }),
    ]);

  if (!user) {
    redirect("/login");
  }

  const latestCheckout = parseCheckoutSnapshot(latestOrder?.shippingAddress);
  const latestShipping = getShippingOption(latestCheckout?.shippingService);
  const latestPayment = getPaymentOption(latestCheckout?.paymentMethod);
  const checkoutDefaults = latestCheckout && latestOrder
    ? {
        recipientName: latestCheckout.recipientName,
        contactEmail: latestCheckout.contactEmail,
        phoneNumber: latestCheckout.phoneNumber,
        address: latestCheckout.address,
        shippingLabel: latestShipping?.label ?? "Layanan tersimpan",
        shippingMeta: [latestShipping?.eta, latestShipping?.badge].filter(Boolean).join(" • "),
        paymentLabel: latestPayment?.label ?? "Metode tersimpan",
        paymentMeta: [latestPayment?.category, latestPayment?.badge].filter(Boolean).join(" • "),
        orderNotes: latestCheckout.orderNotes,
        updatedAt: `Dipakai terakhir ${formatDate(latestOrder.createdAt)}`,
      }
    : null;

  return (
    <div className="min-h-screen bg-grid-soft bg-[radial-gradient(circle_at_top,_#edf4ff_0%,_#f8fbff_35%,_#ffffff_72%)]">
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ProfileOverview
          eyebrow="User Profile"
          title="Profil & Aktivitas Belanja"
          description={`${user.name}, semua ringkasan akun, progres transaksi, dan pintasan penting dikumpulkan dalam satu layar yang rapi tanpa perlu bolak-balik menu.`}
          roleLabel="Pembeli Aktif"
          roleTone="border border-primary/20 bg-primary-50 text-primary-800"
          avatarTone="border-primary/20 bg-primary-50 text-primary"
          glowTone="bg-primary/25"
          user={user}
          summaryTitle="Akun siap dipakai"
          summaryText={
            checkoutDefaults
              ? "Default checkout terakhir sudah tersimpan. Saat Anda kembali checkout, data penerima, kurir, dan pembayaran akan terisi otomatis lalu tetap bisa diubah."
              : "Gunakan halaman ini untuk melihat status akun pribadi, memantau belanja, lalu lanjut ke keranjang atau checkout dengan jalur yang lebih singkat."
          }
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
              tone: "bg-primary-50 text-primary",
            },
            {
              label: "Total Pesanan",
              value: totalOrderCount,
              hint: "Riwayat transaksi pribadi sejak akun dibuat.",
              icon: ShoppingBag,
              tone: "bg-blue-50 text-blue-700",
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
              tone: "bg-emerald-50 text-emerald-600",
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
              href: "/cart",
              label: "Kelola Keranjang",
              description: "Periksa item sebelum melanjutkan pembayaran.",
              icon: ShoppingCart,
            },
            {
              href: "/checkout",
              label: "Lanjut Checkout",
              description: checkoutDefaults
                ? "Form checkout akan terisi otomatis dari preferensi pesanan terakhir Anda."
                : "Selesaikan pesanan yang sudah siap dibayar.",
              icon: CreditCard,
            },
            {
              href: "/contact",
              label: "Hubungi Admin",
              description: "Kirim pertanyaan atau masukan langsung dari akun Anda.",
              icon: MessageSquare,
            },
          ]}
          checkoutDefaults={checkoutDefaults}
        />
      </main>
    </div>
  );
}