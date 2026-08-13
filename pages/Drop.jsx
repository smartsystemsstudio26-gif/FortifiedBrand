import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowRight, Check, Bell, ShieldCheck, Flame, Clock } from "lucide-react";
import { getStoredCapsuleDrops, DEFAULT_CAPSULE_DROPS } from "@/lib/lookbookState";
import { addVipClient } from "@/lib/vipManager";

const pad = (n) => String(isNaN(n) ? "00" : n).padStart(2, "0");

function getTimeLeft(targetDateStr) {
  if (!targetDateStr || targetDateStr === "Continuous") {
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
    isExpired: diff <= 0
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
              className="block font-display text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-white tabular-nums leading-none"
            >
              {pad(safeVal)}
            </motion.span>
          </AnimatePresence>
        </div>
        <span className="mt-3 font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.5em] text-[#888] pl-1 font-bold">
          {label}
        </span>
      </div>
      {!isLast && (
        <span
          aria-hidden="true"
          className="mx-2 sm:mx-5 md:mx-7 mt-1 sm:mt-2 font-display text-4xl sm:text-6xl md:text-7xl font-thin text-neutral-600 leading-none select-none"
        >
          :
        </span>
      )}
    </div>
  );
}

export default function Drop() {
  const [drops, setDrops] = useState(() => {
    try {
      const stored = getStoredCapsuleDrops();
      return Array.isArray(stored) && stored.length > 0 ? stored : DEFAULT_CAPSULE_DROPS;
    } catch {
      return DEFAULT_CAPSULE_DROPS;
    }
  });
  const [selectedDropIndex, setSelectedDropIndex] = useState(0);

  useEffect(() => {
    const refreshDrops = () => {
      try {
        const updated = getStoredCapsuleDrops();
        if (Array.isArray(updated) && updated.length > 0) {
          setDrops(updated);
        }
      } catch {
        // Fallback
      }
    };
    window.addEventListener("storage", refreshDrops);
    window.addEventListener("fortified_drops_updated", refreshDrops);
    return () => {
      window.removeEventListener("storage", refreshDrops);
      window.removeEventListener("fortified_drops_updated", refreshDrops);
    };
  }, []);

  const safeDrops = Array.isArray(drops) && drops.length > 0 ? drops : DEFAULT_CAPSULE_DROPS;
  const currentDrop = safeDrops[selectedDropIndex] || safeDrops[0] || DEFAULT_CAPSULE_DROPS[0];

  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(currentDrop?.launchDate));
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setTimeLeft(getTimeLeft(currentDrop?.launchDate));
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(currentDrop?.launchDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [currentDrop?.launchDate]);

  const handleSubscribe = useCallback(
    async (e) => {
      e.preventDefault();
      const trimmed = email.trim().toLowerCase();
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
      if (!isValid) {
        setStatus("error");
        setErrorMsg("Enter a valid email address");
        return;
      }
      try {
        await addVipClient({ email: trimmed, tier: "Vault Early Access" });
        const stored = JSON.parse(localStorage.getItem("fortified_subscribers") || "[]");
        if (!stored.some((s) => s.email === trimmed)) {
          stored.push({ email: trimmed, subscribed_at: new Date().toISOString(), drop_id: currentDrop?.id || "drop" });
          localStorage.setItem("fortified_subscribers", JSON.stringify(stored));
        }
      } catch {
        // Storage fallback
      }
      setStatus("success");
    },
    [email, currentDrop?.id]
  );

  const bgImage = currentDrop?.bgUrl || "/images/backgrounds/hero.jpg";

  return (
    <div className="cinematic relative min-h-screen w-full overflow-hidden bg-[#060606] text-white">
      {/* Background image & Grain */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 opacity-30 scale-105"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, rgba(6,6,6,0.6) 0%, rgba(6,6,6,0.95) 85%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:14px_14px]"
      />

      <div className="relative z-10 flex min-h-screen flex-col justify-between">
        {/* Header Navigation */}
        <header className="flex items-center justify-between px-6 py-6 sm:px-12 border-b border-white/10 bg-black/40 backdrop-blur-md">
          <Link to="/" className="flex flex-col leading-none group">
            <span className="font-display text-lg font-black tracking-[0.3em] text-white group-hover:text-neutral-300 transition-colors">
              FORTIFIED
            </span>
            <span className="font-mono text-[7px] uppercase tracking-[0.55em] text-neutral-400 mt-1 font-bold">
              Permanent Art
            </span>
          </Link>

          {/* Capsule Drop Selector */}
          {safeDrops.length > 1 && (
            <div className="hidden md:flex items-center gap-1.5 p-1 bg-white/5 border border-white/10 rounded-full font-mono text-[10px]">
              {safeDrops.map((d, idx) => (
                <button
                  key={d.id || idx}
                  onClick={() => {
                    setSelectedDropIndex(idx);
                    setStatus("idle");
                  }}
                  className={`px-3 py-1 rounded-full uppercase tracking-wider font-bold transition-all ${
                    selectedDropIndex === idx
                      ? "bg-white text-black shadow-sm"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {d.name}
                </button>
              ))}
            </div>
          )}

          <Link
            to="/shop"
            className="group flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-300 hover:text-white transition-colors border border-white/20 hover:border-white px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm"
          >
            Enter Store
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </header>

        {/* Main Countdown & Drop Hero */}
        <main className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center max-w-4xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center w-full"
          >
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6 font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>{currentDrop?.status || "ACTIVE DROP"}</span>
              <span className="text-neutral-500">•</span>
              <span className="text-white font-bold">{currentDrop?.limitText || "LIMITED RUN"}</span>
            </div>

            {/* Drop Title */}
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-monolith uppercase text-white leading-tight text-balance">
              {currentDrop?.name || "CAPSULE DROP"}
            </h1>

            <p className="mt-4 font-mono text-xs uppercase tracking-[0.3em] text-neutral-400 font-semibold flex items-center justify-center gap-4">
              <span>UNITS: {currentDrop?.units || "30"} ALLOCATED</span>
              <span>•</span>
              <span>EST. {currentDrop?.priceRange || "R 750 - R 1,200"}</span>
            </p>

            {/* Countdown or Live Button */}
            {!timeLeft.isExpired ? (
              <div className="mt-10 sm:mt-14 flex items-center justify-center" role="timer" aria-live="polite">
                <CountdownUnit value={timeLeft.days} label="DAYS" />
                <CountdownUnit value={timeLeft.hours} label="HOURS" />
                <CountdownUnit value={timeLeft.minutes} label="MINS" />
                <CountdownUnit value={timeLeft.seconds} label="SECS" isLast />
              </div>
            ) : (
              <div className="mt-10">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-3 bg-white text-black px-10 py-5 font-mono text-xs uppercase tracking-[0.3em] font-black hover:bg-neutral-200 transition-all rounded-lg shadow-2xl hover:scale-105"
                >
                  <Flame className="h-4 w-4 text-amber-600" />
                  <span>Capsule Is Live — Shop Now</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}

            {/* Early VIP Access Form */}
            <div className="mt-14 max-w-md w-full bg-white/5 border border-white/10 p-6 sm:p-8 rounded-2xl backdrop-blur-xl shadow-2xl">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Bell className="h-4 w-4 text-emerald-400" />
                <h2 className="font-mono text-xs uppercase tracking-[0.35em] text-white font-bold">
                  VIP Early Release Notification
                </h2>
              </div>
              <p className="font-mono text-[11px] text-neutral-400 mb-6 leading-relaxed">
                Receive private vault authorization 30 minutes before public drop launch.
              </p>

              {status === "success" ? (
                <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-xl flex items-center justify-center gap-3 text-emerald-300 font-mono text-xs animate-in fade-in duration-300">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span className="font-bold">Access Secured. Watch your inbox.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === "error") setStatus("idle");
                      }}
                      placeholder="ENTER EMAIL FOR EARLY VAULT ACCESS"
                      className="flex-1 bg-black/60 border border-neutral-700 focus:border-white px-4 py-3.5 font-mono text-xs uppercase text-white rounded-xl placeholder-neutral-500 outline-none transition-all"
                    />
                    <button
                      type="submit"
                      className="bg-white text-black font-mono text-xs uppercase font-bold tracking-wider px-6 py-3.5 rounded-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      <span>Authorize</span>
                    </button>
                  </div>
                  {status === "error" && (
                    <p className="text-left text-xs font-mono text-red-400 font-semibold">{errorMsg}</p>
                  )}
                </form>
              )}
            </div>
          </motion.div>
        </main>

        {/* Footer info */}
        <footer className="flex flex-col sm:flex-row items-center justify-between px-6 py-6 sm:px-12 border-t border-white/10 bg-black/40 backdrop-blur-md text-[10px] font-mono text-neutral-400 gap-3">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-neutral-500" />
            <span>AUTHENTICATED LIMITED RUN RELEASE SCHEDULER</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/lookbook" className="hover:text-white transition-colors underline">
              View Editorial Lookbook
            </Link>
            <span>•</span>
            <span>FORTIFIED APPAREL ATELIER</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
