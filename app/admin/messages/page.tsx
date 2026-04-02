import prisma from "@/lib/prisma";
import { MessageSquare } from "lucide-react";
import { formatDate } from "@/lib/utils";
import DeleteMessageButton from "./DeleteMessageButton";

/**
 * Halaman pesan masuk dari pengguna (Admin).
 */
export default async function AdminMessagesPage() {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-indigo-600" />
          Pesan Masuk
        </h1>
        <p className="text-gray-500 mt-1">
          Pesan dan keluhan dari pengguna.
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-500">
          Belum ada pesan masuk.
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {msg.subject}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-600">
                      {msg.user.name}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-500">
                      {msg.user.email}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-400">
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>
                </div>
                <DeleteMessageButton id={msg.id} />
              </div>
              <p className="mt-4 text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {msg.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
