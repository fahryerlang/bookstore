"use client";

import { useActionState, useEffect, useState, useSyncExternalStore, useTransition } from "react";
import { createPortal } from "react-dom";
import { createBook, updateBook } from "@/lib/actions/books";
import { createCategoryInline } from "@/lib/actions/categories";
import {
  Banknote,
  BookOpen,
  CheckCircle,
  FolderOpen,
  Loader2,
  Package,
  Plus,
  Sparkles,
  Tag,
  User,
  X,
} from "@/components/icons";

interface BookFormProps {
  categories: { id: string; name: string }[];
  book?: {
    id: string;
    title: string;
    author?: string | null;
    description: string;
    price: number;
    costPrice: number;
    stock: number;
    imageUrl: string;
    categoryId: string;
  };
}

export default function BookForm({ categories, book }: BookFormProps) {
  const action = book ? updateBook.bind(null, book.id) : createBook;

  const [state, formAction, isPending] = useActionState(action, {
    success: false,
    message: "",
  });
  const [isCreatingCategory, startCreatingCategory] = useTransition();

  const [categoryOptions, setCategoryOptions] = useState(categories);
  const [title, setTitle] = useState(book?.title ?? "");
  const [author, setAuthor] = useState(book?.author ?? "");
  const [description, setDescription] = useState(book?.description ?? "");
  const [price, setPrice] = useState(book?.price ? String(book.price) : "");
  const [costPrice, setCostPrice] = useState(book?.costPrice !== undefined ? String(book.costPrice) : "0");
  const [stock, setStock] = useState(book?.stock !== undefined ? String(book.stock) : "");
  const [imageUrl, setImageUrl] = useState(book?.imageUrl ?? "");
  const [categoryId, setCategoryId] = useState(book?.categoryId ?? "");
  const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState("");
  const [selectedCoverName, setSelectedCoverName] = useState("");
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryFeedback, setCategoryFeedback] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    return () => {
      if (uploadedPreviewUrl) {
        URL.revokeObjectURL(uploadedPreviewUrl);
      }
    };
  }, [uploadedPreviewUrl]);

  function handleCoverFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    setSelectedCoverName(file?.name ?? "");
    setUploadedPreviewUrl((currentValue) => {
      if (currentValue) {
        URL.revokeObjectURL(currentValue);
      }

      return file ? URL.createObjectURL(file) : "";
    });
  }

  function closeCategoryDialog() {
    if (isCreatingCategory) {
      return;
    }

    setIsCategoryDialogOpen(false);
    setNewCategoryName("");
    setCategoryFeedback(null);
  }

  function handleCreateCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCategoryFeedback(null);

    startCreatingCategory(async () => {
      const result = await createCategoryInline(newCategoryName);

      if (!result.success || !result.category) {
        setCategoryFeedback({
          success: false,
          message: result.message,
        });
        return;
      }

      const createdCategory = result.category;

      setCategoryOptions((currentValue) => {
        const existingCategory = currentValue.find((item) => item.id === createdCategory.id);

        if (existingCategory) {
          return currentValue;
        }

        return [...currentValue, createdCategory].sort((left, right) =>
          left.name.localeCompare(right.name, "id-ID")
        );
      });
      setCategoryId(createdCategory.id);
      setCategoryFeedback({ success: true, message: result.message });
      setNewCategoryName("");

      window.setTimeout(() => {
        setIsCategoryDialogOpen(false);
        setCategoryFeedback(null);
      }, 600);
    });
  }

  const hasCategories = categoryOptions.length > 0;
  const parsedPrice = Number(price);
  const parsedCostPrice = Number(costPrice);
  const parsedStock = Number(stock);
  const numericPrice = Number.isFinite(parsedPrice) && parsedPrice > 0 ? parsedPrice : 0;
  const numericCostPrice =
    Number.isFinite(parsedCostPrice) && parsedCostPrice >= 0 ? parsedCostPrice : 0;
  const numericStock = Number.isFinite(parsedStock) && parsedStock >= 0 ? parsedStock : 0;
  const selectedCategory = categoryOptions.find((category) => category.id === categoryId);
  const previewTitle = title.trim() || "Judul buku akan muncul di sini";
  const previewAuthor = author.trim() || "Penulis akan tampil di sini";
  const previewDescription =
    description.trim() ||
    "Deskripsi singkat buku akan membantu admin mengecek kualitas katalog sebelum tayang.";
  const previewCover = uploadedPreviewUrl || imageUrl.trim();
  const storedCoverSource = book?.imageUrl
    ? book.imageUrl.startsWith("/uploads/books/")
      ? "File lokal tersimpan"
      : "URL eksternal aktif"
    : null;
  const submitLabel = isPending
    ? "Menyimpan..."
    : book
      ? "Perbarui Buku"
      : "Simpan Buku";

  const inputClass =
    "editorial-input rounded-2xl px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400";
  const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.12fr)_minmax(300px,0.88fr)]">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_-54px_rgba(15,23,42,0.6)]">
        <div className="border-b border-slate-200 px-6 py-5 sm:px-7">
          <h2 className="flex items-center gap-3 text-lg font-semibold text-slate-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-100 text-primary">
              <BookOpen className="h-5 w-5" />
            </div>
            {book ? "Perbarui Data Buku" : "Lengkapi Informasi Buku"}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
            Isi data inti buku, tentukan harga jual, lalu cek preview cover agar katalog admin
            terlihat konsisten sebelum disimpan.
          </p>
        </div>

        <form action={formAction} className="space-y-6 p-6 sm:p-7">
          <input type="hidden" name="existingImageUrl" value={book?.imageUrl ?? ""} />

          {state.message && (
            <div
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium ${
                state.success
                  ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {state.success ? (
                <CheckCircle className="h-4 w-4 flex-shrink-0" />
              ) : (
                <X className="h-4 w-4 flex-shrink-0" />
              )}
              {state.message}
            </div>
          )}

          {!hasCategories ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Minimal satu kategori diperlukan agar buku dapat dikelompokkan dengan benar.
            </div>
          ) : null}

          <section className="space-y-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
            <div>
              <p className="text-sm font-semibold text-slate-900">Informasi Utama</p>
              <p className="mt-1 text-xs text-slate-500">
                Gunakan judul yang jelas dan deskripsi ringkas agar katalog lebih mudah dipahami.
              </p>
            </div>

            <div>
              <label htmlFor="title" className={labelClass}>
                Judul Buku
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className={inputClass}
                placeholder="Contoh: Filosofi Teras"
              />
            </div>

            <div>
              <label htmlFor="description" className={labelClass}>
                Deskripsi
              </label>
              <textarea
                id="description"
                name="description"
                rows={6}
                required
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className={`${inputClass} min-h-[144px] resize-y`}
                placeholder="Tulis ringkasan buku, keunggulan utama, atau alasan buku ini layak tampil di katalog."
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="author" className={labelClass}>
                  Penulis
                </label>
                <input
                  id="author"
                  name="author"
                  type="text"
                  required
                  value={author}
                  onChange={(event) => setAuthor(event.target.value)}
                  className={inputClass}
                  placeholder="Contoh: Andrea Hirata"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label htmlFor="categoryId" className="block text-sm font-semibold text-slate-700">
                    Kategori
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCategoryDialogOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary transition hover:border-primary/30 hover:bg-primary-100"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Tambah cepat
                  </button>
                </div>
                <select
                  id="categoryId"
                  name="categoryId"
                  required
                  value={categoryId}
                  onChange={(event) => setCategoryId(event.target.value)}
                  className={`${inputClass} ${categoryId ? "text-slate-900" : "text-slate-400"}`}
                  disabled={!hasCategories}
                >
                  <option value="">Pilih kategori</option>
                  {categoryOptions.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  Flow utama kategori sekarang ada di form ini. Halaman kategori tetap dipakai untuk maintenance lanjutan.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
            <div>
              <p className="text-sm font-semibold text-slate-900">Harga dan Stok</p>
              <p className="mt-1 text-xs text-slate-500">
                Pastikan harga dan stok akurat agar sinkron dengan panel inventori admin.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <label htmlFor="price" className={labelClass}>
                  Harga (Rp)
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min={1}
                  required
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  className={inputClass}
                  placeholder="50000"
                />
              </div>

              <div>
                <label htmlFor="costPrice" className={labelClass}>
                  Harga Modal (Rp)
                </label>
                <input
                  id="costPrice"
                  name="costPrice"
                  type="number"
                  min={0}
                  required
                  value={costPrice}
                  onChange={(event) => setCostPrice(event.target.value)}
                  className={inputClass}
                  placeholder="30000"
                />
              </div>

              <div>
                <label htmlFor="stock" className={labelClass}>
                  Stok
                </label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min={0}
                  required
                  value={stock}
                  onChange={(event) => setStock(event.target.value)}
                  className={inputClass}
                  placeholder="10"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-600">
              Margin kotor estimasi per unit saat ini: Rp {Math.max(numericPrice - numericCostPrice, 0).toLocaleString("id-ID")}. Nilai ini dipakai untuk ringkasan laporan keuangan admin.
            </div>
          </section>

          <section className="space-y-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
            <div>
              <p className="text-sm font-semibold text-slate-900">Media Cover</p>
              <p className="mt-1 text-xs text-slate-500">
                Anda bisa memakai URL publik atau upload file dari folder lokal. Jika keduanya diisi,
                file lokal akan diprioritaskan.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
              <div>
              <label htmlFor="imageUrl" className={labelClass}>
                  URL Gambar
              </label>
              <input
                id="imageUrl"
                name="imageUrl"
                type="text"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                className={inputClass}
                placeholder="https://images.unsplash.com/..."
              />
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  Cocok untuk gambar dari CDN atau sumber luar. Biarkan kosong jika Anda memilih file lokal.
              </p>

              {storedCoverSource ? (
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                  Cover saat ini: {storedCoverSource}
                </p>
              ) : null}
              </div>

              <div>
                <label htmlFor="coverFile" className={labelClass}>
                  Upload dari Folder Lokal
                </label>
                <input
                  id="coverFile"
                  name="coverFile"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleCoverFileChange}
                  className="block w-full rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-600 transition file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:tracking-[0.14em] file:text-white hover:border-primary/35"
                />
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  Maksimal 5MB. Format yang didukung: JPG, PNG, WEBP, dan GIF.
                </p>

                {selectedCoverName ? (
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary-900">
                    File dipilih: {selectedCoverName}
                  </p>
                ) : null}
              </div>
            </div>
          </section>

          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Siap simpan ke katalog</p>
              <p className="mt-1 text-xs text-slate-500">
                Data akan langsung memperbarui daftar buku admin setelah proses berhasil.
              </p>
            </div>

            <button
              type="submit"
              disabled={isPending || !hasCategories}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:w-auto"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitLabel}
            </button>
          </div>
        </form>
      </div>

      <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
        <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_-54px_rgba(15,23,42,0.6)]">
          <div className="relative aspect-[4/5] overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.22),_rgba(255,255,255,0.96)_50%,_rgba(241,245,249,0.96)_100%)]">
            {previewCover ? (
              <div
                className="absolute inset-0 bg-cover bg-center opacity-95"
                style={{ backgroundImage: `url(${previewCover})` }}
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/20 to-white/20" />

            {!previewCover ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center text-slate-500">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/70 bg-white/90 text-primary shadow-[0_18px_40px_-30px_rgba(15,23,42,0.45)]">
                  <BookOpen className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Preview cover</p>
                  <p className="mt-1 max-w-[14rem] text-xs leading-relaxed text-slate-500">
                    Tempel URL atau pilih file lokal untuk melihat pratinjau buku secara langsung.
                  </p>
                </div>
              </div>
            ) : null}

            <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/86 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-700 backdrop-blur">
              <Tag className="h-3.5 w-3.5 text-primary" />
              {selectedCategory?.name ?? "Belum pilih kategori"}
            </div>

            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/75">
                Preview katalog
              </p>
              <h3 className="mt-2 line-clamp-2 text-xl font-black leading-tight tracking-[-0.02em]">
                {previewTitle}
              </h3>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100/90">
                Oleh {previewAuthor}
              </p>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/80">
                {previewDescription}
              </p>
            </div>
          </div>

          <div className="space-y-4 p-5">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  <Banknote className="h-3.5 w-3.5 text-primary" />
                  Harga
                </div>
                <p className="mt-2 text-base font-bold text-slate-900">
                  Rp {numericPrice.toLocaleString("id-ID")}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  <Package className="h-3.5 w-3.5 text-primary" />
                  Stok
                </div>
                <p className="mt-2 text-base font-bold text-slate-900">{numericStock} unit</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  <Banknote className="h-3.5 w-3.5 text-primary" />
                  Modal
                </div>
                <p className="mt-2 text-base font-bold text-slate-900">
                  Rp {numericCostPrice.toLocaleString("id-ID")}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  <FolderOpen className="h-3.5 w-3.5 text-primary" />
                  Kategori
                </div>
                <p className="mt-2 line-clamp-1 text-base font-bold text-slate-900">
                  {selectedCategory?.name ?? "Pilih dulu"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 sm:col-span-2 xl:col-span-2">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  <User className="h-3.5 w-3.5 text-primary" />
                  Penulis
                </div>
                <p className="mt-2 truncate text-base font-bold text-slate-900">{previewAuthor}</p>
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_16px_42px_-38px_rgba(15,23,42,0.5)]">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            <Sparkles className="h-4 w-4" />
            Checklist Editor
          </p>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
              Judul singkat dan mudah dicari akan lebih efektif di halaman katalog dan pencarian.
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
              Gunakan deskripsi 2-4 kalimat untuk memberi konteks tanpa membuat kartu produk terlalu padat.
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
              Pastikan gambar cover jelas dan harga sesuai sebelum buku muncul di daftar admin.
            </div>
          </div>
        </article>
      </aside>

      {isMounted && isCategoryDialogOpen ? createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_30px_90px_-54px_rgba(15,23,42,0.75)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                  Quick Category
                </p>
                <h3 className="mt-2 text-xl font-bold tracking-[-0.03em] text-slate-900">
                  Tambah kategori tanpa pindah halaman
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Kategori baru akan langsung masuk ke daftar dan otomatis terpilih pada form buku ini.
                </p>
              </div>

              <button
                type="button"
                onClick={closeCategoryDialog}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="mt-6 space-y-4">
              <div>
                <label htmlFor="newCategoryName" className={labelClass}>
                  Nama kategori baru
                </label>
                <input
                  id="newCategoryName"
                  type="text"
                  required
                  value={newCategoryName}
                  onChange={(event) => setNewCategoryName(event.target.value)}
                  className={inputClass}
                  placeholder="Contoh: Bisnis dan Karier"
                />
              </div>

              {categoryFeedback ? (
                <div
                  className={`rounded-2xl border px-4 py-3 text-sm ${
                    categoryFeedback.success
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {categoryFeedback.message}
                </div>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeCategoryDialog}
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isCreatingCategory}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCreatingCategory ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Simpan kategori
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      ) : null}
    </div>
  );
}
