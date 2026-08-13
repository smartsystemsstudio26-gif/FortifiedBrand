import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import Lightbox from "@/components/Lightbox";
import CampaignVideoPlayer from "@/components/CampaignVideoPlayer";
import { getStoredLookbookShots, DEFAULT_LOOKBOOK_SHOTS } from "@/lib/lookbookState";
import { Video } from "lucide-react";

export default function Lookbook() {
  const [shots, setShots] = useState(() => {
    try {
      const stored = getStoredLookbookShots();
      return Array.isArray(stored) && stored.length > 0 ? stored : DEFAULT_LOOKBOOK_SHOTS;
    } catch {
      return DEFAULT_LOOKBOOK_SHOTS;
    }
  });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const refreshShots = () => {
      try {
        const updated = getStoredLookbookShots();
        if (Array.isArray(updated) && updated.length > 0) {
          setShots(updated);
        }
      } catch {
        // Fallback
      }
    };
    window.addEventListener("storage", refreshShots);
    window.addEventListener("fortified_lookbook_updated", refreshShots);
    return () => {
      window.removeEventListener("storage", refreshShots);
      window.removeEventListener("fortified_lookbook_updated", refreshShots);
    };
  }, []);

  const safeShots = Array.isArray(shots) && shots.length > 0 ? shots : DEFAULT_LOOKBOOK_SHOTS;

  return (
    <div className="pt-32 pb-24 bg-white min-h-screen text-black">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-mono text-[10px] uppercase tracking-[0.4em] text-neutral-500 font-bold"
        >
          Editorial · SS Volume 01
        </motion.p>
        <h1 className="mt-3 font-display text-5xl sm:text-7xl md:text-8xl font-black tracking-monolith text-black uppercase">
          Lookbook
        </h1>
        <p className="mt-4 max-w-md font-mono text-xs uppercase tracking-[0.2em] text-neutral-600 font-medium leading-relaxed">
          Shot in raw concrete. Framed in shadow. A study of permanence in motion.
        </p>
      </div>

      {/* Campaign Film Section */}
      <div className="mx-auto mt-12 max-w-[1600px] px-6 md:px-12">
        <Reveal>
          <CampaignVideoPlayer aspectRatio="aspect-[16/9]" />
        </Reveal>
      </div>

      {/* Gallery Grid */}
      <div className="mx-auto mt-12 grid max-w-[1600px] grid-cols-1 gap-6 px-6 pb-28 md:grid-cols-3 md:px-12">
        {safeShots.map((s, i) => (
          <Reveal key={s.id ? `${s.id}-${i}` : i} delay={(i % 3) * 0.1} className={s.span || "md:col-span-1"}>
            <div 
              className="group block cursor-pointer"
              onClick={() => {
                if (s.type === "video") return;
                setLightboxIndex(i);
                setLightboxOpen(true);
              }}
            >
              <div className={`relative overflow-hidden ${s.ratio || "aspect-[4/5]"} rounded-sm border border-neutral-200 bg-neutral-100 shadow-sm`}>
                {s.type === "video" ? (
                  <div className="relative h-full w-full bg-black">
                    <video
                      src={s.videoUrl || s.img || "/videos/hero-background.mp4"}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className={`h-full w-full object-cover ${s.position || "object-center"}`}
                    />
                    <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-white font-mono text-[9px] uppercase tracking-widest px-2.5 py-1 rounded border border-white/20 flex items-center gap-1.5 z-10">
                      <Video className="h-3 w-3 text-emerald-400" />
                      <span>MOTION FILM</span>
                    </div>
                  </div>
                ) : (
                  <img
                    src={s.img || "/images/classic-front-black/classic_black_front.jpg"}
                    alt={s.title || "Lookbook shot"}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/images/classic-front-black/classic_black_front.jpg";
                    }}
                    className={`h-full w-full object-cover ${s.position || "object-center"} transition-transform duration-700 group-hover:scale-[1.02]`}
                  />
                )}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <h3 className="font-display text-sm font-black tracking-tight text-black uppercase">{s.title || "Lookbook Entry"}</h3>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-semibold">{s.subtitle || "Fortified Collection"}</p>
                </div>
                {s.type !== "video" && (
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-black font-bold border border-neutral-300 px-2.5 py-1 bg-neutral-50 group-hover:bg-black group-hover:text-white transition-colors rounded-xs">
                    Expand →
                  </span>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={safeShots.filter((s) => s.type !== "video" && s.img).map((s) => s.img)}
        initialIndex={lightboxIndex}
      />
    </div>
  );
}
