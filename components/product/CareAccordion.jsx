import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const care = [
  { t: "Wash with Similar Colours", d: "Machine wash cold with like colours to preserve the jet black finish." },
  { t: "Spot Clean Only", d: "For minor marks, spot clean gently rather than a full wash." },
  { t: "Do Not Bleach", d: "Bleaching will damage the fibres and fade the colour permanently." },
  { t: "Do Not Tumble Dry", d: "Hang to dry in shade to maintain the oversized shape and weight." },
  { t: "Do Not Iron Dirty", d: "Ensure the garment is clean before ironing on a low setting, avoiding prints." },
];

export default function CareAccordion() {
  const [open, setOpen] = useState(0);
  return (
    <div>
      {care.map((c, i) => (
        <div key={c.t} className="border-b border-neutral-200">
          <button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between py-5 text-left group">
            <span className="font-mono text-xs uppercase tracking-[0.15em] text-black font-bold group-hover:text-neutral-600 transition-colors">{c.t}</span>
            <span className="text-black font-bold">{open === i ? "—" : "+"}</span>
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <p className="pb-5 text-sm leading-relaxed text-neutral-700 font-medium">{c.d}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}