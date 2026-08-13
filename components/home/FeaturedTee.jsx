import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { zar } from "@/lib/media";
import Reveal from "@/components/Reveal";

export default function FeaturedTee({ product }) {
  if (!product) return null;

  const hasImages = Array.isArray(product.images) && product.images.length > 0;
  const img = hasImages ? product.images[0] : null;

  return (
    <section className="relative w-full border-t border-b border-neutral-200 bg-white text-black py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-24">
          
          {/* Left Column - Large Image Showcase */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="group relative aspect-[4/5] w-full overflow-hidden bg-neutral-100 border border-neutral-200 flex flex-col items-center justify-center rounded-sm shadow-sm"
          >
            {img ? (
              <>
                <img
                  src={img}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </>
            ) : (
              <div className="p-8 text-center select-none">
                <span className="font-mono text-[10px] uppercase tracking-[0.6em] text-neutral-500 mb-2 block font-bold">FORTIFIED</span>
                <span className="font-display text-2xl font-black tracking-monolith text-black uppercase block">{product.name}</span>
                <div className="h-[1px] w-12 bg-neutral-300 my-4 mx-auto" />
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-600 border border-neutral-300 px-4 py-1 bg-white inline-block font-bold">
                  PHOTO COMING SOON
                </span>
              </div>
            )}
          </motion.div>

          {/* Right Column - Product details & editorial write-up */}
          <div className="space-y-8 text-left">
            <Reveal>
              <div className="flex items-center gap-3">
                <span className="h-[1px] w-8 bg-neutral-400" />
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-bold">
                  Featured Spotlight
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="font-display text-4xl font-black uppercase tracking-monolith text-black md:text-6xl">
                {product.name}
              </h2>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="font-mono text-2xl font-bold text-black">
                {zar(product.price)}
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <p className="max-w-md font-body text-base leading-relaxed text-neutral-700 font-medium">
                {product.description || 
                  "A meticulous execution of minimalist design principles. Crafted from ultra-heavyweight cotton, offering a structured silhouette and unmatched durability."}
              </p>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  to={`/product/${product.id}`}
                  className="inline-flex items-center justify-center border border-black bg-black px-8 py-4 font-mono text-xs uppercase tracking-[0.2em] text-white transition-colors hover:bg-neutral-800 font-bold shadow-sm rounded-xs"
                >
                  Acquire Piece
                </Link>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-600 font-bold sm:ml-4">
                  Collection: {product.collection || "Limited Release"}
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
