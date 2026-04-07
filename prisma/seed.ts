import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

/**
 * Script seed untuk mengisi data awal ke database.
 * Membuat akun admin, kategori, dan buku contoh.
 */
async function main() {
  console.log("🌱 Memulai seeding database...");

  // Buat akun Admin
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@bookstore.com" },
    update: {},
    create: {
      name: "Admin BookStore",
      email: "admin@bookstore.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin dibuat: ${admin.email}`);

  // Buat akun User
  const userPassword = await bcrypt.hash("user123", 12);
  const user = await prisma.user.upsert({
    where: { email: "user@bookstore.com" },
    update: {},
    create: {
      name: "John Doe",
      email: "user@bookstore.com",
      password: userPassword,
      role: "USER",
    },
  });
  console.log(`✅ User dibuat: ${user.email}`);

  // Buat Kategori
  const categories = await Promise.all(
    ["Fiksi", "Non-Fiksi", "Teknologi", "Sejarah", "Sains"].map((name) =>
      prisma.category.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );
  console.log(`✅ ${categories.length} kategori dibuat`);

  // Buat Buku
  const booksData = [
    {
      title: "Laskar Pelangi",
      author: "Andrea Hirata",
      description:
        "Novel karya Andrea Hirata yang menceritakan kisah perjuangan anak-anak Belitung dalam mengejar pendidikan. Sebuah cerita yang menginspirasi tentang semangat pantang menyerah.",
      price: 75000,
      stock: 25,
      imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
      categoryId: categories[0].id,
    },
    {
      title: "Bumi Manusia",
      author: "Pramoedya Ananta Toer",
      description:
        "Novel karya Pramoedya Ananta Toer, bagian pertama dari Tetralogi Buru. Mengisahkan kehidupan Minke, seorang pribumi yang berpendidikan Eropa di masa kolonial.",
      price: 89000,
      stock: 20,
      imageUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
      categoryId: categories[0].id,
    },
    {
      title: "Atomic Habits",
      author: "James Clear",
      description:
        "Buku karya James Clear tentang cara membangun kebiasaan baik dan menghilangkan kebiasaan buruk. Panduan praktis untuk perubahan hidup yang nyata.",
      price: 99000,
      stock: 30,
      imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
      categoryId: categories[1].id,
    },
    {
      title: "Clean Code",
      author: "Robert C. Martin",
      description:
        "Buku panduan dari Robert C. Martin tentang cara menulis kode yang bersih, mudah dibaca, dan mudah dirawat. Wajib baca untuk setiap programmer.",
      price: 150000,
      stock: 15,
      imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910auj7?w=400&h=600&fit=crop",
      categoryId: categories[2].id,
    },
    {
      title: "The Pragmatic Programmer",
      author: "David Thomas & Andrew Hunt",
      description:
        "Panduan klasik untuk pengembang perangkat lunak yang ingin meningkatkan keterampilan dan produktivitas mereka secara signifikan.",
      price: 175000,
      stock: 12,
      imageUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop",
      categoryId: categories[2].id,
    },
    {
      title: "Sapiens: Riwayat Singkat Umat Manusia",
      author: "Yuval Noah Harari",
      description:
        "Buku karya Yuval Noah Harari yang menelusuri sejarah umat manusia dari masa prasejarah hingga era modern dengan perspektif yang unik dan menarik.",
      price: 120000,
      stock: 18,
      imageUrl: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop",
      categoryId: categories[3].id,
    },
    {
      title: "A Brief History of Time",
      author: "Stephen Hawking",
      description:
        "Buku karya Stephen Hawking yang menjelaskan konsep-konsep fisika dan kosmologi secara sederhana untuk pembaca umum. Dari Big Bang hingga lubang hitam.",
      price: 110000,
      stock: 10,
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
      categoryId: categories[4].id,
    },
    {
      title: "Filosofi Teras",
      author: "Henry Manampiring",
      description:
        "Buku karya Henry Manampiring tentang filosofi Stoisisme yang disampaikan dengan gaya bahasa ringan dan contoh-contoh yang relevan untuk kehidupan modern.",
      price: 82000,
      stock: 22,
      imageUrl: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop",
      categoryId: categories[1].id,
    },
    {
      title: "Sejarah Dunia yang Disembunyikan",
      author: "Jonathan Black",
      description:
        "Mengungkap fakta-fakta sejarah yang jarang diketahui publik. Buku yang membuka perspektif baru tentang peristiwa-peristiwa penting dunia.",
      price: 95000,
      stock: 14,
      imageUrl: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400&h=600&fit=crop",
      categoryId: categories[3].id,
    },
    {
      title: "Cosmos",
      author: "Carl Sagan",
      description:
        "Buku karya Carl Sagan yang mengajak pembaca menjelajahi alam semesta. Sebuah perjalanan epik dari atom hingga galaksi terjauh.",
      price: 130000,
      stock: 8,
      imageUrl: "https://images.unsplash.com/photo-1446776899648-aa78eefe8ed0?w=400&h=600&fit=crop",
      categoryId: categories[4].id,
    },
  ];

  for (const bookData of booksData) {
    await prisma.book.create({ data: bookData });
  }
  console.log(`✅ ${booksData.length} buku dibuat`);

  console.log("\n🎉 Seeding selesai!");
  console.log("📧 Login Admin: admin@bookstore.com / admin123");
  console.log("📧 Login User: user@bookstore.com / user123");
}

main()
  .catch((e) => {
    console.error("❌ Error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
