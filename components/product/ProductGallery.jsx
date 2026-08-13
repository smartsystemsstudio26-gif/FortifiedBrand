import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IMG } from "@/lib/media";
import Lightbox from "@/components/Lightbox";

export default function ProductGallery({ images = [], activeColour = "Black", product = null }) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    setActive(0);
  }, [activeColour]);

  const isComingSoon = !images || images.length === 0;
  const displayImages = isComingSoon ? [] : images;

  if (isComingSoon) {
    return (
      <div className="lg:sticky lg:top-24">
        <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-[#0F0F0F] to-[#050505] border border-neutral-900 rounded flex flex-col items-center justify-center p-8 text-center select-none shadow-2xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.6em] text-[#555] mb-4">FORTIFIED BRAND</span>
            <div className="h-12 w-12 border border-dashed border-neutral-800 rounded-full flex items-center justify-center text-neutral-700 font-mono text-xs mb-6 font-bold animate-pulse">FL</div>
            <h2 className="font-display text-2xl font-black tracking-[0.2em] text-white/50 uppercase mb-2">
              {product?.category || "STREETWEAR"}
            </h2>
            <div className="h-[1px] w-12 bg-neutral-800 my-4" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#8A8A8A] border border-neutral-800 px-4 py-1.5 bg-black/40">
              COMING SOON
            </span>
            <p className="mt-6 text-xs text-neutral-600 max-w-[280px] leading-relaxed">
              This highly anticipated piece is currently in development. Sign up for early access notifications.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:sticky lg:top-24">
      <div
        className="relative aspect-[4/5] overflow-hidden bg-[#0a0a0a] cursor-pointer"
        onClick={() => setLightboxOpen(true)}
      >
        <motion.img
          key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          src={displayImages[active] || "/images/embroidered-black/emb_black_front.jpg"}
          alt="Product view"
          className="h-full w-full object-cover"
        />

        {/* Front / Back Toggle Selector */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-4 left-4 flex gap-1 bg-black/60 backdrop-blur-md border border-white/10 px-1.5 py-1 rounded-full z-10 max-w-[90vw] overflow-x-auto no-scrollbar">
            {displayImages.length === 4 ? (
              <>
                <button
                  onClick={(event) => { event.stopPropagation(); setActive(0); }}
                  className={`font-mono text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 rounded transition-all whitespace-nowrap ${
                    active === 0 ? "bg-white text-black font-bold" : "text-[#A8A8A8] hover:text-white"
                  }`}
                >
                  Front
                </button>
                <button
                  onClick={(event) => { event.stopPropagation(); setActive(1); }}
                  className={`font-mono text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 rounded transition-all whitespace-nowrap ${
                    active === 1 ? "bg-white text-black font-bold" : "text-[#A8A8A8] hover:text-white"
                  }`}
                >
                  Back
                </button>
                <button
                  onClick={(event) => { event.stopPropagation(); setActive(2); }}
                  className={`font-mono text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 rounded transition-all whitespace-nowrap ${
                    active === 2 ? "bg-white text-black font-bold" : "text-[#A8A8A8] hover:text-white"
                  }`}
                >
                  Front (Close)
                </button>
                <button
                  onClick={(event) => { event.stopPropagation(); setActive(3); }}
                  className={`font-mono text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 rounded transition-all whitespace-nowrap ${
                    active === 3 ? "bg-white text-black font-bold" : "text-[#A8A8A8] hover:text-white"
                  }`}
                >
                  Back (Close)
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={(event) => { event.stopPropagation(); setActive(0); }}
                  className={`font-mono text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 rounded transition-all whitespace-nowrap ${
                    active === 0 ? "bg-white text-black font-bold" : "text-[#A8A8A8] hover:text-white"
                  }`}
                >
                  Front
                </button>
                <button
                  onClick={(event) => { event.stopPropagation(); setActive(1); }}
                  className={`font-mono text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 rounded transition-all whitespace-nowrap ${
                    active === 1 ? "bg-white text-black font-bold" : "text-[#A8A8A8] hover:text-white"
                  }`}
                >
                  Back
                </button>
                {displayImages.length > 2 && (
                  <button
                    onClick={(event) => { event.stopPropagation(); setActive(2); }}
                    className={`font-mono text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 rounded transition-all whitespace-nowrap ${
                      active === 2 ? "bg-white text-black font-bold" : "text-[#A8A8A8] hover:text-white"
                    }`}
                  >
                    Detail
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
      {displayImages.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto no-scrollbar py-1">
          {displayImages.map((img, i) => (
            <button
              key={i}
              onClick={(event) => { event.stopPropagation(); setActive(i); }}
              className={`relative h-24 w-20 flex-shrink-0 overflow-hidden border-2 transition-all rounded-xs ${active === i ? "border-black shadow-xs" : "border-neutral-200 hover:border-neutral-400 opacity-70 hover:opacity-100"}`}
            >
              <img src={img || "/images/embroidered-black/emb_black_front.jpg"} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={displayImages}
        initialIndex={active}
      />
    </div>
  );
}
