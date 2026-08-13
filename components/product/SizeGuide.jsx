import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const chart = {
  cm: [
    ["Size", "Chest", "Length", "Sleeve"],
    ["XS", "108", "68", "22"],
    ["S", "112", "70", "23"],
    ["M", "116", "72", "24"],
    ["L", "120", "74", "25"],
    ["XL", "124", "76", "26"],
  ],
  in: [
    ["Size", "Chest", "Length", "Sleeve"],
    ["XS", "42.5", "26.8", "8.7"],
    ["S", "44.1", "27.6", "9.1"],
    ["M", "45.7", "28.3", "9.4"],
    ["L", "47.2", "29.1", "9.8"],
    ["XL", "48.8", "29.9", "10.2"],
  ],
};

export default function SizeGuide({ trigger }) {
  const [open, setOpen] = useState(false);
  const [unit, setUnit] = useState("cm");
  const [height, setHeight] = useState("");

  const recommend = () => {
    const h = parseInt(height);
    if (!h) return null;
    if (h < 158) return "XS";
    if (h < 165) return "S";
    if (h < 175) return "M";
    if (h < 185) return "L";
    return "XL";
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-600 hover:text-black font-bold border-b border-dashed border-neutral-400 hover:border-black pb-0.5 transition-colors">
        {trigger || "Size Guide"}
      </button>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-6">
            <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-lg border border-neutral-200 bg-white p-8 rounded-xl shadow-2xl text-black">
              <button onClick={() => setOpen(false)} className="absolute right-5 top-5 text-neutral-500 hover:text-black transition-colors"><X className="h-5 w-5" /></button>
              <h3 className="font-display text-2xl font-black tracking-monolith text-black">Oversized Fit Guide</h3>

              <div className="mt-5 flex gap-2">
                {["cm", "in"].map((u) => (
                  <button key={u} onClick={() => setUnit(u)} className={`px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] font-bold rounded-xs ${unit === u ? "bg-black text-white" : "border border-neutral-300 text-neutral-700 hover:border-black"}`}>{u}</button>
                ))}
              </div>

              <table className="mt-6 w-full font-mono text-xs">
                <tbody>
                  {chart[unit].map((row, ri) => (
                    <tr key={ri} className={ri === 0 ? "text-neutral-500 font-bold" : "text-black"}>
                      {row.map((cell, ci) => (
                        <td key={ci} className={`border-b border-neutral-200 py-2.5 ${ci === 0 ? "text-left uppercase tracking-[0.15em] font-bold" : "text-right font-medium"}`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-8 border-t border-neutral-200 pt-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-600 font-bold">Height Calculator</p>
                <div className="mt-3 flex items-center gap-3">
                  <input value={height} onChange={(e) => setHeight(e.target.value)} placeholder="Your height (cm)" className="flex-1 border border-neutral-300 bg-neutral-50 px-4 py-3 font-mono text-sm text-black placeholder:text-neutral-400 focus:border-black rounded-xs" />
                  {recommend() && <span className="font-mono text-sm text-black font-bold">Recommended: <span className="text-2xl font-black underline">{recommend()}</span></span>}
                </div>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-neutral-500 font-semibold">Model is wearing Size M</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}