import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, Copy, Check, ArrowRight } from "lucide-react";
import { useStoreSettings } from "@/lib/storeSettings";

export default function SaleNotificationBanner() {
  const { settings } = useStoreSettings();
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  const isEnabled = settings?.saleBannerEnabled !== false && settings?.saleBannerEnabled !== "false" && Boolean(settings?.saleBannerEnabled);

  // Calculate remaining countdown time
  useEffect(() => {
    if (!isEnabled) return;

    const durationMs = (settings.saleBannerHours || 72) * 60 * 60 * 1000;
    const startTime = settings.saleBannerStartTime || Date.now();

    const updateTimer = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const remainingMs = Math.max(0, durationMs - (elapsed % durationMs));

      const hours = Math.floor(remainingMs / (1000 * 60 * 60));
      const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [settings.saleBannerEnabled, settings.saleBannerHours, settings.saleBannerStartTime]);

  if (!isEnabled) return null;

  const handleCopyCode = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (settings.saleBannerCode) {
      navigator.clipboard.writeText(settings.saleBannerCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Theme style configurations - 7 options
  const styleClasses = {
    white: "bg-white text-black border-b border-neutral-200 shadow-sm",
    red: "bg-red-600 text-white border-b border-red-700 shadow-md",
    gold: "bg-amber-500 text-white border-b border-amber-600 shadow-md",
    black: "bg-neutral-950 text-white border-b border-neutral-800 shadow-md",
    emerald: "bg-emerald-600 text-white border-b border-emerald-700 shadow-md",
    neon: "bg-indigo-600 text-white border-b border-indigo-700 shadow-md",
    blue: "bg-blue-600 text-white border-b border-blue-700 shadow-md",
  }[settings.saleBannerStyle] || "bg-white text-black border-b border-neutral-200 shadow-sm";

  const badgeStyle = {
    white: "bg-black text-white hover:bg-neutral-900 border border-neutral-800/80 shadow-sm",
    red: "bg-black text-white hover:bg-neutral-900 border border-neutral-800/80 shadow-sm",
    gold: "bg-black text-white hover:bg-neutral-900 border border-black/40 shadow-sm",
    black: "bg-red-600 text-white hover:bg-red-500 border border-red-500/50 shadow-sm",
    emerald: "bg-black text-white hover:bg-neutral-900 border border-black/40 shadow-sm",
    neon: "bg-black text-white hover:bg-neutral-900 border border-black/40 shadow-sm",
    blue: "bg-black text-white hover:bg-neutral-900 border border-black/40 shadow-sm",
  }[settings.saleBannerStyle] || "bg-black text-white hover:bg-neutral-900 border border-neutral-800/80 shadow-sm";

  const timerStyle = {
    white: "bg-neutral-100 text-black border border-neutral-300",
    red: "bg-black/35 text-white border border-black/40",
    gold: "bg-black/35 text-white border border-black/40",
    black: "bg-neutral-900 text-white border border-neutral-800",
    emerald: "bg-black/35 text-white border border-black/40",
    neon: "bg-black/35 text-white border border-black/40",
    blue: "bg-black/35 text-white border border-black/40",
  }[settings.saleBannerStyle] || "bg-neutral-100 text-black border border-neutral-300";

  return (
    <div className={`relative z-50 py-2.5 px-4 text-xs font-mono select-none transition-all ${styleClasses}`}>
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 text-[11px] sm:text-xs">
        
        {/* Left: Pulse Indicator & Sale Main Message */}
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-90"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
          </span>
          <span className="font-bold uppercase tracking-wider truncate">
            {settings.saleBannerText || "⚡ 72 HOUR FLASH SALE — 10% OFF SITEWIDE"}
          </span>
        </div>

        {/* Center: Countdown Timer & Coupon Code */}
        <div className="hidden md:flex items-center gap-4 shrink-0">
          {/* Live Countdown Timer */}
          <div className={`flex items-center gap-1.5 font-bold tracking-widest px-3 py-1 rounded text-[10px] uppercase ${timerStyle}`}>
            <Clock className="h-3 w-3 shrink-0" />
            <span>
              {String(timeLeft.hours).padStart(2, "0")}h : {String(timeLeft.minutes).padStart(2, "0")}m : {String(timeLeft.seconds).padStart(2, "0")}s REMAINING
            </span>
          </div>

          {/* Coupon Code Button */}
          {settings.saleBannerCode && (
            <button
              onClick={handleCopyCode}
              type="button"
              className={`flex items-center gap-1.5 px-3 py-1 font-bold text-[10px] uppercase tracking-wider transition-all hover:scale-105 active:scale-95 rounded ${badgeStyle}`}
              title="Click to copy promo code"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 stroke-[3]" />
                  <span>COPIED!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>CODE: {settings.saleBannerCode}</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Right: Shop CTA Link */}
        <Link
          to={settings.saleBannerCtaPath || "/shop"}
          className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest underline underline-offset-4 hover:opacity-80 transition-opacity shrink-0"
        >
          <span>Shop Now</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
