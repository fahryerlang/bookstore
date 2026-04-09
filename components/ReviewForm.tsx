"use client";

import { createReview } from "@/lib/actions/reviews";
import { Star, Loader2 } from "@/components/icons";
import { useState, useTransition } from "react";

interface ReviewFormProps {
  bookId: string;
  orderId: string;
}

export default function ReviewForm({ bookId, orderId }: ReviewFormProps) {
  const [isPending, startTransition] = useTransition();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  function handleSubmit(formData: FormData) {
    formData.set("bookId", bookId);
    formData.set("orderId", orderId);
    formData.set("rating", String(rating));

    startTransition(async () => {
      const result = await createReview(null, formData);
      setFeedback(result);
      if (result.success) {
        setRating(0);
      }
    });
  }

  const displayRating = hoveredRating || rating;

  return (
    <form action={handleSubmit} className="space-y-4">
      {/* Star Rating */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 mb-2">
          Rating
        </p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
              className="p-0.5 transition-transform hover:scale-110"
            >
              <Star
                className={`h-6 w-6 ${
                  star <= displayRating
                    ? "text-amber-400"
                    : "text-slate-300"
                }`}
                style={star <= displayRating ? { fill: "currentColor" } : undefined}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm font-medium text-slate-600">{rating}/5</span>
          )}
        </div>
      </div>

      {/* Comment */}
      <div>
        <label htmlFor={`comment-${orderId}`} className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 mb-2 block">
          Ulasan (opsional)
        </label>
        <textarea
          id={`comment-${orderId}`}
          name="comment"
          rows={3}
          placeholder="Tulis ulasan Anda tentang buku ini..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary/20"
        />
      </div>

      <button
        type="submit"
        disabled={isPending || rating === 0}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Kirim Review
      </button>

      {feedback && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            feedback.success
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {feedback.message}
        </div>
      )}
    </form>
  );
}
