import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { base44 } from "@/api/base44Client";
import Reveal from "@/components/Reveal";

function Stars({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" onClick={onChange ? () => onChange(n) : undefined} disabled={!onChange}>
          <Star className={`h-4 w-4 ${n <= value ? "fill-black text-black" : "text-neutral-300 fill-neutral-200"}`} />
        </button>
      ))}
    </div>
  );
}

export default function Reviews({ productId, onReviewAdded }) {
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ author: "", title: "", body: "", rating: 5 });
  const [show, setShow] = useState(false);

  const load = () => base44.entities.Review.filter({ product_id: productId }, "-created_date")
    .then(setReviews)
    .catch((err) => console.warn("Failed to load reviews:", err));
  useEffect(() => { load(); }, [productId]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await base44.entities.Review.create({ ...form, product_id: productId });
      setForm({ author: "", title: "", body: "", rating: 5 });
      setShow(false);
      load();
      if (onReviewAdded) onReviewAdded();
    } catch (err) {
      console.warn("Failed to submit review:", err);
    }
  };

  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "5.0";

  return (
    <section id="reviews-section" className="mx-auto max-w-[1600px] px-6 py-24 md:px-12 text-black">
      <Reveal className="flex items-end justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-neutral-500 font-bold">Voices</p>
          <h2 className="mt-4 font-display text-4xl font-black tracking-monolith text-black md:text-6xl">Reviews</h2>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2"><span className="font-mono text-2xl font-bold text-black">{avg}</span><Stars value={Math.round(avg)} /></div>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold">{reviews.length} reviews</p>
        </div>
      </Reveal>

      <button onClick={() => setShow(!show)} className="mt-8 border border-black bg-black px-6 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white hover:bg-neutral-800 font-bold transition-all rounded-xs">
        {show ? "Cancel" : "Write a Review"}
      </button>

      {show && (
        <form onSubmit={submit} className="mt-6 max-w-lg space-y-3 bg-neutral-50 p-6 rounded-lg border border-neutral-200">
          <Stars value={form.rating} onChange={(n) => setForm({ ...form, rating: n })} />
          <input required placeholder="Name" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="w-full border border-neutral-300 bg-white px-4 py-3 font-mono text-sm text-black placeholder:text-neutral-500 focus:border-black rounded-xs" />
          <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-neutral-300 bg-white px-4 py-3 font-mono text-sm text-black placeholder:text-neutral-500 focus:border-black rounded-xs" />
          <textarea required rows={3} placeholder="Your thoughts" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="w-full border border-neutral-300 bg-white px-4 py-3 font-mono text-sm text-black placeholder:text-neutral-500 focus:border-black rounded-xs" />
          <button className="bg-black px-6 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white font-bold hover:bg-neutral-800 transition-colors rounded-xs">Submit</button>
        </form>
      )}

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {reviews.length === 0 ? (
          <p className="bg-neutral-50 border border-neutral-200 p-10 font-mono text-xs uppercase tracking-[0.2em] text-neutral-500 rounded-lg">Be the first to review</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="bg-white border border-neutral-200 p-8 rounded-lg shadow-xs hover:border-black transition-all">
              <Stars value={r.rating} />
              {r.title && <p className="mt-4 font-bold text-black text-base">{r.title}</p>}
              <p className="mt-2 text-sm leading-relaxed text-neutral-700 font-medium">{r.body}</p>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold">— {r.author}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}