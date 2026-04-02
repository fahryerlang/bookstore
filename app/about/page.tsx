import { BookOpen, Heart, Users, Award } from "lucide-react";

/**
 * Halaman statis Tentang Kami yang menampilkan profil toko buku.
 */
export default function AboutPage() {
  return (
    <div className="flex-1">
      {/* Hero */}
      <section className="bg-linear-to-br from-indigo-600 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold">Tentang Kami</h1>
          <p className="mt-4 text-lg text-indigo-100 max-w-2xl mx-auto">
            Kami percaya bahwa buku adalah jendela dunia. BookStore hadir untuk
            mendekatkan pembaca dengan buku-buku berkualitas terbaik.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <BookOpen className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Cerita Kami
          </h2>
          <p className="text-gray-600 leading-relaxed">
            BookStore didirikan dengan satu misi sederhana: membuat buku
            berkualitas dapat diakses oleh semua orang. Berawal dari toko kecil
            di Jakarta, kini kami telah melayani ribuan pelanggan di seluruh
            Indonesia. Kami bekerja sama langsung dengan penerbit untuk
            memastikan setiap buku yang kami jual adalah edisi terbaik dengan
            harga yang terjangkau.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            Nilai-Nilai Kami
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
              <div className="inline-flex p-3 bg-indigo-50 rounded-xl mb-4">
                <Heart className="h-7 w-7 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">
                Passion
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Kami mencintai buku dan menyalurkan semangat itu ke setiap
                pelanggan melalui pelayanan terbaik.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
              <div className="inline-flex p-3 bg-indigo-50 rounded-xl mb-4">
                <Users className="h-7 w-7 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">
                Komunitas
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Membangun komunitas pembaca yang aktif dan saling berbagi
                pengetahuan melalui buku.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
              <div className="inline-flex p-3 bg-indigo-50 rounded-xl mb-4">
                <Award className="h-7 w-7 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">
                Kualitas
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Setiap buku yang kami jual dijamin asli dan berkualitas premium
                langsung dari penerbit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl font-bold text-indigo-600">10K+</p>
            <p className="text-sm text-gray-500 mt-1">Buku Terjual</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-indigo-600">5K+</p>
            <p className="text-sm text-gray-500 mt-1">Pelanggan Puas</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-indigo-600">500+</p>
            <p className="text-sm text-gray-500 mt-1">Judul Buku</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-indigo-600">50+</p>
            <p className="text-sm text-gray-500 mt-1">Kategori</p>
          </div>
        </div>
      </section>
    </div>
  );
}
