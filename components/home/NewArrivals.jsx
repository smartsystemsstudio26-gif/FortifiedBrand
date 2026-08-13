import React from "react";
import Reveal from "@/components/Reveal";
import ProductCard from "@/components/ProductCard";
import MagneticButton from "@/components/MagneticButton";

export default function NewArrivals({ products }) {
  return (
    <section className="mx-auto max-w-[1600px] px-6 py-28 md:px-12 bg-white text-black">
      <Reveal className="mb-14">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-neutral-500 font-bold">05 — Latest Drop</p>
        <h2 className="mt-4 font-display text-4xl sm:text-5xl font-black tracking-monolith text-black md:text-7xl">New Arrivals</h2>
      </Reveal>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {products.slice(0, 4).map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
      <div className="mt-14 flex justify-center">
        <MagneticButton to="/shop" variant="ghost" isLight={false}>Shop All</MagneticButton>
      </div>
    </section>
  );
}
