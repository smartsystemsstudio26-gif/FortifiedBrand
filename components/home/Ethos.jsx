import React from "react";
import Reveal from "@/components/Reveal";

const pillars = [
  { n: "Our Vision", t: "Garments engineered as permanent art — worn, not consumed." },
  { n: "Craftsmanship", t: "Built to premium manufacturing standards with a warm, dense feel." },
  { n: "Made in SA", t: "Proudly designed and manufactured in South Africa for a global stage." },
];

export default function Ethos() {
  return (
    <section className="relative overflow-hidden py-32 bg-white text-black border-t border-b border-neutral-200">
      <div className="relative mx-auto max-w-[1600px] px-6 md:px-12">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-neutral-500 font-bold">03 — Philosophy</p>
          <h2 className="mt-6 max-w-4xl font-display text-3xl sm:text-4xl font-black leading-tight tracking-monolith text-black md:text-6xl">
            We do not chase trends. We forge permanence.
          </h2>
        </Reveal>
        <div className="mt-20 grid gap-px border border-neutral-200 md:grid-cols-3 bg-neutral-200 rounded-lg overflow-hidden shadow-sm">
          {pillars.map((p, i) => (
            <Reveal key={p.n} delay={i * 0.1} className="bg-white p-10">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-bold">{p.n}</p>
              <p className="mt-5 text-lg leading-relaxed text-neutral-900 font-medium">{p.t}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
