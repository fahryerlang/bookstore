import { redirect } from "next/navigation";
import ProfileOverview from "@/components/ProfileOverview";
import {
  BookOpen,
  LayoutDashboard,
  MessageSquare,
  ShoppingBag,
  Users,
} from "@/components/icons";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export default async function AdminProfilePage() {
  const session = await requireAdmin();

  const [admin, bookCount, userCount, orderCount, messageCount, categoryCount] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: session.id },
        select: { name: true, email: true, createdAt: true },
      }),
      prisma.book.count(),
      prisma.user.count({ where: { role: "USER" } }),
      prisma.order.count(),
      prisma.message.count(),
      prisma.category.count(),
    ]);

  if (!admin) {
    redirect("/login");
  }

  return (
    <ProfileOverview
      eyebrow="Admin Profile"
      title="Profil Admin & Ruang Kontrol"
      description={`${admin.name}, halaman ini merangkum identitas admin dan akses cepat ke area operasional inti, dengan ritme visual yang sejalan dengan workspace admin tanpa menyalin dashboard apa adanya.`}
      roleLabel="Administrator"
      roleTone="border border-primary/20 bg-primary-50 text-primary"
      avatarTone="border-primary/20 bg-primary-50 text-primary"
      glowTone="bg-primary/20"
      user={admin}
      summaryTitle="Akses penuh aktif"
      summaryText="Gunakan halaman ini sebagai pintu masuk ringkas ke kontrol toko, mulai dari katalog, order, hingga percakapan pelanggan yang perlu ditindaklanjuti." 
      meta={[
        { label: "Nama admin", value: admin.name },
        { label: "Email kerja", value: admin.email },
        { label: "Peran", value: "Administrator" },
        { label: "Kategori dikelola", value: `${categoryCount} kategori` },
        { label: "Bergabung", value: formatDate(admin.createdAt) },
      ]}
      stats={[
        {
          label: "Buku Aktif",
          value: bookCount,
          hint: "Judul yang tersedia dan tampil di katalog toko.",
          icon: BookOpen,
          tone: "bg-primary-50 text-primary",
        },
        {
          label: "Pelanggan",
          value: userCount,
          hint: "Total akun pembeli yang sudah terdaftar.",
          icon: Users,
          tone: "bg-emerald-50 text-emerald-600",
        },
        {
          label: "Total Pesanan",
          value: orderCount,
          hint: "Seluruh transaksi yang pernah masuk ke sistem.",
          icon: ShoppingBag,
          tone: "bg-sky-50 text-sky-600",
        },
        {
          label: "Pesan Masuk",
          value: messageCount,
          hint: "Percakapan pelanggan yang menunggu perhatian admin.",
          icon: MessageSquare,
          tone: "bg-violet-50 text-violet-600",
        },
      ]}
      actions={[
        {
          href: "/admin",
          label: "Dashboard Admin",
          description: "Kembali ke ringkasan performa toko dan insight utama.",
          icon: LayoutDashboard,
        },
        {
          href: "/admin/books",
          label: "Kelola Buku",
          description: "Tambah, ubah, dan rapikan katalog utama.",
          icon: BookOpen,
        },
        {
          href: "/admin/orders",
          label: "Monitor Pesanan",
          description: "Pantau status order dan tindak lanjuti progresnya.",
          icon: ShoppingBag,
        },
        {
          href: "/admin/messages",
          label: "Buka Pesan",
          description: "Tinjau masukan dan pertanyaan dari pelanggan.",
          icon: MessageSquare,
        },
      ]}
    />
  );
}