import React from "react";
import { motion } from "framer-motion";
import { useStoreSettings } from "@/lib/storeSettings";

export default function Marquee() {
  const { settings } = useStoreSettings();

  const isEnabled = settings?.marqueeEnabled !== false && settings?.marqueeEnabled !== "false" && Boolean(settings?.marqueeEnabled);
  if (!isEnabled) return null;

  const rawText = settings.marqueeText || "FORTIFIED LIMITED EDITION • 10% OFF ALL TEES • FREE EXPRESS SHIPPING ACROSS SOUTH AFRICA";
  
  // Split phrases by '•' or '|' if present, otherwise treat as single phrase
  const items = rawText.includes("•")
    ? rawText.split("•").map((s) => s.trim()).filter(Boolean)
    : rawText.includes("|")
    ? rawText.split("|").map((s) => s.trim()).filter(Boolean)
    : [rawText, rawText, rawText];

  const repeatedItems = [...items, ...items, ...items, ...items];

  const themeClasses = {
    white: "bg-white border-y border-neutral-200",
    dark: "bg-neutral-950 border-y border-neutral-800",
    red: "bg-red-600 border-y border-red-700",
    gold: "bg-amber-500 border-y border-amber-600",
  }[settings.marqueeTheme] || "bg-white border-y border-neutral-200";

  const colorClasses = {
    black: "text-black",
    white: "text-white",
    gold: "text-amber-400",
    red: "text-red-500",
  }[settings.marqueeTextColor] || (settings.marqueeTheme === "dark" || settings.marqueeTheme === "red" ? "text-white" : "text-black");

  return (
    <div className={`overflow-hidden py-3 select-none ${themeClasses}`}>
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: Number(settings.marqueeSpeed) || 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {repeatedItems.map((phrase, i) => (
          <span
            key={i}
            className={`mx-8 font-display text-xl font-black tracking-monolith md:text-3xl flex items-center gap-4 uppercase shrink-0 ${colorClasses}`}
          >
            <span>{phrase}</span>
            <span className="opacity-30">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
