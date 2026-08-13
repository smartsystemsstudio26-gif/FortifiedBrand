import React, { useState } from "react";
import Reveal from "@/components/Reveal";
import { ArrowRight, Check, Mail } from "lucide-react";
import { addVipClient } from "@/lib/vipManager";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // "idle" | "submitting" | "subscribed"
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setErrorMessage("");
    setStatus("submitting");

    await addVipClient({ email, tier: "Movement VIP Subscriber" });

    setStatus("subscribed");
    setEmail("");
  };

  return (
    <section className="mx-auto max-w-[1600px] px-6 py-20 md:px-12 bg-white text-black border-t border-neutral-200">
      <Reveal className="max-w-2xl mx-auto text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-neutral-500 font-bold">
          05 — Stay Informed
        </p>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-monolith text-black uppercase">
          Join The Movement
        </h2>
        <p className="mt-4 text-sm text-neutral-600 leading-relaxed font-sans max-w-lg mx-auto">
          Subscribe for early access to limited capsule releases, exclusive editorial drops, and private store access.
        </p>

        {status === "subscribed" ? (
          <div className="mt-8 inline-flex items-center gap-3 bg-neutral-100 border border-neutral-300 px-6 py-4 rounded-sm">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white">
              <Check className="h-3.5 w-3.5" />
            </div>
            <p className="font-mono text-xs uppercase tracking-wider text-black font-bold">
              You're on the list. Thank you for subscribing.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row items-stretch gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="email"
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                className="w-full bg-neutral-50 border border-neutral-300 pl-10 pr-4 py-3.5 font-mono text-xs text-black placeholder:text-neutral-400 rounded-sm focus:outline-none focus:border-black transition-colors"
                disabled={status === "submitting"}
              />
            </div>
            <button
              type="submit"
              disabled={status === "submitting"}
              className="bg-black hover:bg-neutral-800 text-white font-mono text-xs font-bold uppercase tracking-[0.2em] px-6 py-3.5 transition-colors flex items-center justify-center gap-2 rounded-sm cursor-pointer shrink-0"
            >
              <span>{status === "submitting" ? "Joining..." : "Subscribe"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>
        )}

        {errorMessage && (
          <p className="mt-3 font-mono text-[11px] text-red-600 tracking-wide">
            {errorMessage}
          </p>
        )}

        <p className="mt-4 font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
          No spam · Unsubscribe at any time
        </p>
      </Reveal>
    </section>
  );
}
