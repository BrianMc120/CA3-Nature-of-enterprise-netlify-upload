"use client";

import { useState } from "react";
import ProtectedPage from "../_components/ProtectedPage";
import { useAuth } from "../_components/AuthProvider";

const CATEGORIES = ["General", "Teaching", "Facilities", "Events", "App feedback", "Other"];

export default function FeedbackPage() {
  const { user } = useAuth();
  const [category, setCategory] = useState("");
  const [subject,  setSubject]  = useState("");
  const [message,  setMessage]  = useState("");
  const [rating,   setRating]   = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [errors,    setErrors]    = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!category)        e.category = "Please select a category.";
    if (!subject.trim())  e.subject  = "Please enter a subject.";
    if (!message.trim())  e.message  = "Please enter your feedback.";
    if (rating === 0)     e.rating   = "Please give a star rating.";
    return e;
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <ProtectedPage>
        <div className="max-w-lg mx-auto text-center py-16">
          <span className="text-7xl inline-block" aria-hidden="true">🙏</span>
          <h1 className="font-serif text-3xl font-bold text-stone-900 mt-5 mb-3">Thanks for your feedback!</h1>
          <p className="text-base text-stone-700 mb-7 leading-relaxed">
            Your feedback has been saved and will be reviewed by the campus team.
          </p>
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl px-6 py-5 text-base text-emerald-900 text-left mb-7 hc-card">
            <p><span className="font-semibold">Category:</span> {category}</p>
            <p><span className="font-semibold">Subject:</span> {subject}</p>
            <p><span className="font-semibold">Rating:</span> {"⭐".repeat(rating)}</p>
          </div>
          <button
            onClick={() => { setSubmitted(false); setCategory(""); setSubject(""); setMessage(""); setRating(0); }}
            className="bg-orange-600 hover:bg-orange-700 text-white text-base font-semibold px-7 py-3 rounded-xl min-h-[48px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-700"
          >
            Submit another
          </button>
        </div>
      </ProtectedPage>
    );
  }

  return (
    <ProtectedPage>
      <div className="max-w-lg">
        <h1 className="font-serif text-4xl font-bold text-stone-900 mb-2">Share your feedback</h1>
        <p className="text-stone-600 mb-8 text-base">
          Help us make Campus Companion better for everyone
        </p>

        <form onSubmit={handleSubmit} noValidate aria-label="Feedback form" className="space-y-6 bg-white rounded-2xl border border-stone-200 p-7 hc-card">
          <div>
            <label htmlFor="fb-category" className="block text-base font-semibold text-stone-800 mb-2">
              Category <span aria-hidden="true" className="text-rose-600">*</span>
            </label>
            <select
              id="fb-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border-2 border-stone-200 rounded-xl px-4 py-3 text-base bg-white min-h-[48px] focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
              aria-required="true"
              aria-invalid={!!errors.category}
              aria-describedby={errors.category ? "fb-category-err" : undefined}
            >
              <option value="">Select a category…</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <p id="fb-category-err" role="alert" className="text-rose-700 text-base mt-1.5">{errors.category}</p>}
          </div>

          <div>
            <label htmlFor="fb-subject" className="block text-base font-semibold text-stone-800 mb-2">
              Subject <span aria-hidden="true" className="text-rose-600">*</span>
            </label>
            <input
              id="fb-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="A short summary"
              className="w-full border-2 border-stone-200 rounded-xl px-4 py-3 text-base bg-white min-h-[48px] focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
              aria-required="true"
              aria-invalid={!!errors.subject}
              aria-describedby={errors.subject ? "fb-subject-err" : undefined}
            />
            {errors.subject && <p id="fb-subject-err" role="alert" className="text-rose-700 text-base mt-1.5">{errors.subject}</p>}
          </div>

          <div>
            <p className="text-base font-semibold text-stone-800 mb-3">
              Rating <span aria-hidden="true" className="text-rose-600">*</span>
            </p>
            <div role="radiogroup" aria-label="Star rating" aria-required="true" className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  role="radio"
                  aria-checked={rating === star}
                  aria-label={`${star} star${star > 1 ? "s" : ""}`}
                  onClick={() => setRating(star)}
                  className="text-4xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-lg p-1 min-w-[44px] min-h-[44px]"
                >
                  {star <= rating ? "⭐" : "☆"}
                </button>
              ))}
            </div>
            {errors.rating && <p role="alert" className="text-rose-700 text-base mt-2">{errors.rating}</p>}
          </div>

          <div>
            <label htmlFor="fb-message" className="block text-base font-semibold text-stone-800 mb-2">
              Your feedback <span aria-hidden="true" className="text-rose-600">*</span>
            </label>
            <textarea
              id="fb-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              placeholder="Tell us what you think…"
              className="w-full border-2 border-stone-200 rounded-xl px-4 py-3 text-base bg-white focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 resize-none"
              aria-required="true"
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "fb-message-err" : undefined}
            />
            {errors.message && <p id="fb-message-err" role="alert" className="text-rose-700 text-base mt-1.5">{errors.message}</p>}
          </div>

          <p className="text-sm text-stone-500 hc-text-muted">Submitting as {user?.name} ({user?.studentId})</p>

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-60 text-white text-base font-semibold py-3.5 rounded-xl min-h-[48px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange-700"
          >
            {loading ? "Submitting…" : "Submit feedback"}
          </button>
        </form>
      </div>
    </ProtectedPage>
  );
}
