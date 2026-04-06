import prisma from "@/lib/prisma";
import { MessageSquare, Mail, Clock } from "@/components/icons";
import { formatDate } from "@/lib/utils";
import DeleteMessageButton from "./DeleteMessageButton";

export default async function AdminMessagesPage() {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 6);

  const todayCount = messages.filter(
    (message) => message.createdAt >= todayStart
  ).length;
  const weeklyCount = messages.filter(
    (message) => message.createdAt >= weekStart
  ).length;
  const uniqueSenders = new Set(messages.map((message) => message.user.email)).size;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_30px_80px_-56px_rgba(15,23,42,0.72)] sm:p-7">
        <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Inbox Management
            </p>
            <h1 className="mt-2 text-[clamp(1.8rem,4vw,2.75rem)] font-black tracking-[-0.03em] text-slate-900">
              Pesan Masuk
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
              Kelola pertanyaan, masukan, dan keluhan pelanggan dengan tampilan
              inbox yang lebih cepat dipindai.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                Total Pesan
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{messages.length}</p>
              <p className="mt-1 text-xs text-slate-500">Inbox keseluruhan</p>
            </article>
            <article className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-700">
                Pesan Hari Ini
              </p>
              <p className="mt-1 text-2xl font-bold text-blue-800">{todayCount}</p>
              <p className="mt-1 text-xs text-blue-700">Butuh respon cepat</p>
            </article>
            <article className="rounded-2xl border border-violet-200 bg-violet-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-violet-700">
                7 Hari Terakhir
              </p>
              <p className="mt-1 text-2xl font-bold text-violet-800">{weeklyCount}</p>
              <p className="mt-1 text-xs text-violet-700">Volume mingguan inbox</p>
            </article>
            <article className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                Pengirim Unik
              </p>
              <p className="mt-1 text-2xl font-bold text-emerald-800">{uniqueSenders}</p>
              <p className="mt-1 text-xs text-emerald-700">Akun pengguna berbeda</p>
            </article>
          </div>
        </div>
      </section>

      {messages.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-[0_24px_65px_-52px_rgba(15,23,42,0.55)]">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
            <MessageSquare className="h-7 w-7 text-slate-400" />
          </div>
          <p className="font-medium text-slate-600">Belum ada pesan masuk</p>
          <p className="mt-1 text-sm text-slate-500">Pesan dari pengguna akan muncul di sini.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <article
              key={msg.id}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_55px_-45px_rgba(15,23,42,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
                <div className="flex min-w-0 flex-1 items-start gap-4">
                  <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary-50">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold text-slate-900">
                      {msg.subject}
                    </h3>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-slate-700">{msg.user.name}</span>
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      <span className="text-sm text-slate-500">{msg.user.email}</span>
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      <span className="text-sm text-slate-500">{formatDate(msg.createdAt)}</span>
                    </div>

                    <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600">
                      <Clock className="h-3 w-3" />
                      {msg.createdAt >= todayStart ? "Hari Ini" : "Arsip"}
                    </div>
                  </div>
                </div>
                <DeleteMessageButton id={msg.id} />
              </div>

              <div className="px-6 py-5">
                <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
                  {msg.content}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
