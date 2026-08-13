import React from "react";
import { Circle, Maximize, Layers, Weight, Shirt, MapPin } from "lucide-react";
import Reveal from "@/components/Reveal";

export default function MoreMeaning({ activeColour = "Black" }) {
  const isWhite = activeColour === "White";
  const items = [
    { Icon: Circle, label: isWhite ? "Monolith White Colour" : "Jet Black Colour" },
    { Icon: Maximize, label: "Oversized Fit" },
    { Icon: Layers, label: "Premium Cotton Construction" },
    { Icon: Weight, label: "280 GSM Heavyweight Cotton" },
    { Icon: Shirt, label: "Ribbed Crewneck Collar" },
    { Icon: MapPin, label: "Made in South Africa" },
  ];

  return (
    <section className="border-t border-neutral-200 bg-neutral-50 text-black">
      <div className="mx-auto max-w-[1600px] px-6 py-24 md:px-12">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-neutral-500 font-bold">More Meaning</p>
          <h2 className="mt-4 font-display text-4xl font-black tracking-monolith text-black md:text-6xl">The Details</h2>
        </Reveal>
        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3">
          {items.map(({ Icon, label }, i) => (
            <Reveal key={label} delay={(i % 3) * 0.08}>
              <div className="flex flex-col gap-6 p-8 md:p-10 bg-white border border-neutral-200 rounded-lg shadow-xs hover:border-black transition-all group">
                <Icon className="h-6 w-6 text-neutral-800 group-hover:text-black transition-colors" strokeWidth={1.5} />
                <p className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-black">{label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}