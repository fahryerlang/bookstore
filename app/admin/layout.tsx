import { requireAdmin } from "@/lib/auth";
import AdminSidebar from "@/components/AdminSidebar";

/**
 * Layout khusus untuk area admin.
 * Menampilkan sidebar navigasi dan memvalidasi hak akses admin.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
