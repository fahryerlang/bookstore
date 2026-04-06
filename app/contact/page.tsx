"use client";

import { useActionState } from "react";
import { sendMessage } from "@/lib/actions/messages";
import { Mail, Loader2, MessageSquare, Phone, MapPin } from "@/components/icons";

/**
 * Halaman formulir kontak untuk mengirim pesan ke admin.
 */
export default function ContactPage() {
  const [state, formAction, isPending] = useActionState(sendMessage, {
    success: false,
    message: "",
  });

  return (
    <div className="flex-1">
      {/* Hero */}
      <section className="bg-linear-to-br from-indigo-600 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold">Hubungi Kami</h1>
          <p className="mt-4 text-lg text-indigo-100 max-w-2xl mx-auto">
            Punya pertanyaan atau masukan? Kami senang mendengar dari Anda.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-50 rounded-lg">
                <Mail className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Email</h3>
                <p className="text-sm text-gray-600">info@bookstore.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-50 rounded-lg">
                <Phone className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Telepon</h3>
                <p className="text-sm text-gray-600">+62 21 1234 5678</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-50 rounded-lg">
                <MapPin className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Alamat</h3>
                <p className="text-sm text-gray-600">
                  Jl. Buku Indah No. 42, Jakarta Pusat, Indonesia
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="h-5 w-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Kirim Pesan
                </h2>
              </div>

              <form action={formAction} className="space-y-5">
                {state.message && (
                  <div
                    className={`px-4 py-3 rounded-lg text-sm ${
                      state.success
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {state.message}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Subjek
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-gray-900"
                    placeholder="Topik pesan Anda"
                  />
                </div>

                <div>
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Isi Pesan
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    rows={5}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none text-gray-900"
                    placeholder="Tuliskan pesan Anda di sini..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-indigo-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isPending ? "Mengirim..." : "Kirim Pesan"}
                </button>
              </form>

              <p className="mt-4 text-xs text-gray-400 text-center">
                Anda harus login terlebih dahulu untuk mengirim pesan.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
