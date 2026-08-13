import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Bell, Flame, Check, Sparkles, Clock } from "lucide-react";
import { useStoreSettings } from "@/lib/storeSettings";
import { addVipClient } from "@/lib/vipManager";

const pad = (n) => String(isNaN(n) ? "00" : n).padStart(2, "0");

function getTimeLeft(targetDateStr) {
  if (!targetDateStr) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }
  const parsed = new Date(targetDateStr).getTime();
  if (isNaN(parsed)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }
  const diff = Math.max(0, parsed - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isExpired: diff <= 0,
  };
}

function CountdownUnit({ value, label, isLast }) {
  const safeVal = isNaN(value) ? 0 : value;
  return (
    <div className="flex items-start">
      <div className="flex flex-col items-center">
        <div className="relative overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={`${label}-${safeVal}`}
              initial={{ y: "60%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-60%", opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="block font-display text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter text-white tabular-nums leading-none"
            >
              {pad(safeVal)}
            </motion.span>
          </AnimatePresence>
        </div>
        <span className="mt-3 font-mono text-[8px] sm:text-[10px] uppercase tracking-[0.4em] text-neutral-400 pl-1 font-bold">
          {label}
        </span>
      </div>
      {!isLast && (
        <span
          aria-hidden="true"
          className="mx-2 sm:mx-4 md:mx-6 mt-1 sm:mt-2 font-display text-3xl sm:text-5xl md:text-7xl font-thin text-neutral-600 leading-none select-none"
        >
          :
        </span>
      )}
    </div>
  );
}

export default function LaunchCountdown() {
  const { storeSettings } = useStoreSettings();
  const settings = storeSettings;
  const isEnabled = settings?.launchCountdownEnabled !== false && settings?.launchCountdownEnabled !== "false" && settings?.launchCountdownEnabled !== 0;

  const targetDateStr = settings?.launchTargetDate || "2026-08-25T00:00:00";
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetDateStr));
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    try {
      sessionStorage.removeItem("fortified_hide_launch_countdown");
    } catch {}
  }, []);

  useEffect(() => {
    const update = () => {
      setTimeLeft(getTimeLeft(targetDateStr));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDateStr]);

  if (!isEnabled) return null;

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    await addVipClient({ email, tier: "VIP Launch Access" });
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setSubscribed(false);
    }, 5000);
  };

  const launchTitle = settings?.launchTitle || "FORTIFIEDBRAND OFFICIAL LAUNCH";
  const launchSubtext = settings?.launchSubtext || "LIMITED DROP RELEASE & EXCLUSIVE PERMANENT APPAREL COLLECTION";
  const launchCtaText = settings?.launchCtaText || "VIP EARLY ACCESS";
  const launchCtaLink = settings?.launchCtaLink || "/shop";

  return (
    <section className="bg-black text-white relative overflow-hidden py-16 sm:py-24 border-y border-neutral-900 font-mono">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-red-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        {/* Status Live Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-neutral-200"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="font-bold text-white tracking-widest">
            {timeLeft.isExpired ? "LAUNCH IS LIVE NOW" : "OFFICIAL BRAND LAUNCH COUNTDOWN"}
          </span>
        </motion.div>

        {/* Launch Title */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-monolith text-white leading-tight max-w-4xl text-balance"
        >
          {launchTitle}
        </motion.h2>

        {/* Launch Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="mt-4 font-mono text-xs sm:text-sm uppercase tracking-[0.25em] text-neutral-400 font-medium max-w-2xl leading-relaxed"
        >
          {launchSubtext}
        </motion.p>

        {/* Countdown Display */}
        {!timeLeft.isExpired ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-10 sm:mt-14 flex items-center justify-center bg-neutral-950/80 border border-neutral-800/80 px-6 sm:px-12 py-8 sm:py-10 rounded-2xl shadow-2xl backdrop-blur-xl"
            role="timer"
            aria-live="polite"
          >
            <CountdownUnit value={timeLeft.days} label="DAYS" />
            <CountdownUnit value={timeLeft.hours} label="HOURS" />
            <CountdownUnit value={timeLeft.minutes} label="MINS" />
            <CountdownUnit value={timeLeft.seconds} label="SECS" isLast />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-10"
          >
            <Link
              to={launchCtaLink}
              className="inline-flex items-center gap-3 bg-white text-black px-10 py-5 font-mono text-xs uppercase tracking-[0.3em] font-black hover:bg-neutral-200 transition-all rounded-xl shadow-2xl hover:scale-105 cursor-pointer"
            >
              <Flame className="h-4 w-4 text-red-600" />
              <span>{launchCtaText || "SHOP THE LAUNCH DROP"}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        )}

        {/* VIP Access Signup Box */}
        {!timeLeft.isExpired && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="mt-12 max-w-lg w-full bg-neutral-900/60 border border-neutral-800 p-6 sm:p-8 rounded-2xl backdrop-blur-md shadow-xl"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-white font-bold">
                Get Notified Exactly On Launch
              </h3>
            </div>
            <p className="font-mono text-[11px] text-neutral-400 mb-5 leading-relaxed">
              Enter your email for instant priority notification 15 minutes before public store opening.
            </p>

            {subscribed ? (
              <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-xl text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2">
                <Check className="h-4 w-4 text-emerald-400" />
                <span>YOU ARE REGISTERED FOR VIP LAUNCH ACCESS</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ENTER YOUR EMAIL..."
                  required
                  className="flex-1 bg-black/80 border border-neutral-700 focus:border-white px-4 py-3.5 text-xs text-white placeholder-neutral-500 rounded-xl outline-none font-mono tracking-wider transition-colors"
                />
                <button
                  type="submit"
                  className="bg-white hover:bg-neutral-200 text-black px-6 py-3.5 text-xs font-mono font-black uppercase tracking-[0.2em] rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap active:scale-95"
                >
                  <Bell className="h-3.5 w-3.5" />
                  <span>VIP NOTIFY</span>
                </button>
              </form>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
