import React from "react";
import { Link } from "react-router-dom";
import Reveal from "@/components/Reveal";
import TeeSlideshow from "@/components/TeeSlideshow";
import CampaignVideoPlayer from "@/components/CampaignVideoPlayer";

export default function LookbookTeaser() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 py-28 md:px-12 bg-white text-black">
      <Reveal className="mb-14">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-neutral-500 font-bold">04 — Editorial</p>
        <h2 className="mt-4 font-display text-4xl sm:text-5xl font-black tracking-monolith text-black md:text-7xl">Lookbook</h2>
      </Reveal>
      
      <div className="grid gap-6 md:grid-cols-3">
        {/* Campaign Film Section */}
        <Reveal className="md:col-span-2">
          <CampaignVideoPlayer aspectRatio="aspect-[16/10]" />
        </Reveal>

        {/* Editorial link */}
        <Reveal delay={0.1}>
          <Link 
            to="/lookbook" 
            className="group relative flex aspect-[16/10] flex-col justify-end overflow-hidden md:aspect-auto md:h-full rounded-sm border border-neutral-300 bg-neutral-100 shadow-sm"
          >
            <div className="absolute inset-0 transition-transform duration-[1200ms] group-hover:scale-105">
              <TeeSlideshow />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="relative p-8 md:p-10">
              <p className="text-xl md:text-2xl text-white font-display tracking-tight font-black uppercase">Enter the full editorial</p>
              <span className="mt-3 inline-block font-mono text-[10px] uppercase tracking-[0.25em] text-white font-bold border border-white/30 bg-black/40 px-3 py-1 rounded-xs">Open Lookbook →</span>
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
