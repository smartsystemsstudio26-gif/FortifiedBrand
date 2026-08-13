import React from "react";
import { Link } from "react-router-dom";
import Reveal from "@/components/Reveal";
import { IMG } from "@/lib/media";

const cards = [
  { name: "Fortified Archive", img: IMG.collA, span: "md:col-span-2 md:row-span-2", position: "object-center" },
  { name: "Permanent Art", img: IMG.collB, span: "", position: "object-[70%_center]" },
  { name: "Studio Uniform", img: IMG.collC, span: "", position: "object-[68%_center]" },
  { name: "The Original Series", img: IMG.collA, span: "md:col-span-2", position: "object-center" },
];

export default function Collections() {
  return (
    <section className="mx-auto max-w-[1600px] px-6 py-28 md:px-12">
      <Reveal className="mb-14 flex items-end justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-neutral-400">01 — The Archive</p>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl font-black tracking-monolith text-black md:text-7xl">Collections</h2>
        </div>
        <Link to="/shop" className="hidden font-mono text-[11px] uppercase tracking-[0.25em] text-neutral-500 hover:text-black md:block">
          View All →
        </Link>
      </Reveal>

      <div className="grid auto-rows-[260px] grid-cols-1 gap-4 md:grid-cols-4">
        {cards.map((c, i) => (
          <Reveal key={c.name} delay={i * 0.08} className={c.span}>
            <Link to="/shop" className="group relative block h-full overflow-hidden bg-neutral-900 border border-neutral-200 rounded-sm">
              {c.img ? (
                <img 
                  src={c.img} 
                  alt={c.name} 
                  className={`h-full w-full object-cover ${c.position} transition-transform duration-[1200ms] group-hover:scale-105`} 
                />
              ) : (
                <div className="absolute inset-0 bg-neutral-100 p-6 flex flex-col justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-neutral-600">FORTIFIED ARCHIVE</span>
                </div>
              )}
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
