import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import MagneticButton from "@/components/MagneticButton";
import { IMG } from "@/lib/media";
import { useStoreSettings } from "@/lib/storeSettings";

export default function Hero() {
  const ref = useRef(null);
  const { storeSettings } = useStoreSettings();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const heroMediaType = storeSettings?.heroMediaType || "image"; // "image" | "video"
  const heroImageSrc = storeSettings?.heroBgUrl || IMG.hero || IMG.heroSlide1;
  const heroVideoSrc = storeSettings?.heroVideoUrl || "/videos/hero-background.mp4";

  return (
    <section ref={ref} className="relative h-[100vh] overflow-hidden bg-black select-none">
      {/* Background Media with Parallax */}
      <motion.div style={{ y: imgY, scale }} className="absolute inset-0">
        {heroMediaType === "video" && heroVideoSrc ? (
          <video
            key={heroVideoSrc}
            src={heroVideoSrc}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover opacity-100"
            poster={heroImageSrc}
          />
        ) : heroImageSrc ? (
          <img
            src={heroImageSrc}
            alt="Hero Background"
            className="h-full w-full object-cover opacity-100"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-[#0e0e0e] via-[#050505] to-black" />
        )}

        {/* Dark Overlay for visual depth and text readability */}
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
      </motion.div>

      {/* Content Overlay */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 flex h-full flex-col items-center justify-end pb-16 px-6 text-center max-w-5xl mx-auto"
      >
        <div className="flex flex-col gap-4 sm:flex-row mb-6">
          <MagneticButton to="/shop" variant="solid">Shop Collection</MagneticButton>
          <MagneticButton to="/lookbook" variant="outline-light">View Lookbook</MagneticButton>
        </div>
      </motion.div>

      <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.4em] text-white/40">
        Scroll to enter
      </div>
    </section>
  );
}
