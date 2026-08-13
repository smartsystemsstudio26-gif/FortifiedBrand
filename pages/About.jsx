import React from "react";
import Reveal from "@/components/Reveal";
import Marquee from "@/components/home/Marquee";
import TeeSlideshow from "@/components/TeeSlideshow";
import { IMG } from "@/lib/media";

const chapters = [
  { n: "Our Vision", t: "FORTIFIED exists for those who stand different. We treat every garment as permanent art — an object of intention rather than impulse, made to outlast the churn of seasons." },
  { n: "Our Craftsmanship", t: "Built to premium manufacturing standards. Dense, warm cotton. Reinforced construction. A finish that reveals itself in the details others overlook." },
  { n: "Premium Materials", t: "280 GSM medium-weight cotton with a warm premium feel and exceptional durability. Ribbed crewneck collars. Embroidery over screen print where it matters." },
  { n: "Made in South Africa", t: "Proudly designed and manufactured in South Africa, engineered for a global stage. Local heritage, worldwide standard." },
];

export default function About() {
  return (
    <div className="pt-36 bg-white text-black min-h-screen">
      <section className="mx-auto max-w-[1600px] px-6 md:px-12">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-neutral-500 font-bold">The Legacy</p>
          <h1 className="mt-6 max-w-5xl font-display text-5xl font-black leading-[0.95] tracking-monolith text-black md:text-8xl">
            Permanent Art.<br />Timeless Quality.
          </h1>
        </Reveal>
      </section>

      <div className="my-20"><Marquee /></div>

      <section className="mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="grid gap-16 md:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100 border border-neutral-300 rounded-lg select-none shadow-md">
              <TeeSlideshow />
            </div>
          </Reveal>
          <div className="flex flex-col justify-center gap-12">
            {chapters.map((c, i) => (
              <Reveal key={c.n} delay={i * 0.05}>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-bold">{c.n}</p>
                <p className="mt-4 text-lg leading-relaxed text-neutral-800 font-medium">{c.t}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-6 py-28 md:px-12">
        <Reveal className="relative overflow-hidden bg-neutral-100 border border-neutral-300 rounded-lg shadow-md">
          {IMG.lookWide ? (
            <img src={IMG.lookWide} alt="Fortified campaign" className="h-[60vh] w-full object-cover" />
          ) : (
            <div className="h-[60vh] w-full bg-gradient-to-br from-neutral-200 via-neutral-100 to-neutral-300" />
          )}
        </Reveal>
      </section>
    </div>
  );
}
