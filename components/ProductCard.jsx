import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Star } from "lucide-react";
import { getProductColourName, getProductDefaultColour, zar } from "@/lib/media";
import { useWishlist } from "@/lib/WishlistContext";
import { base44 } from "@/api/base44Client";

export default function ProductCard({ product, index = 0 }) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  
  // Match each card's initial colour to the product variant in its title.
  const [activeColour, setActiveColour] = useState(() => getProductDefaultColour(product));
  const [viewIndex, setViewIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    base44.entities.Review.filter({ product_id: product.id })
      .then(setReviews)
      .catch(() => {});
  }, [product.id]);

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const displayName = getProductColourName(product, activeColour);
  const colourImages = product.colorImages?.[activeColour];
  const displayImages = colourImages?.length ? colourImages : (product.images || []);
  const isComingSoon = displayImages.length === 0;

  useEffect(() => {
    setViewIndex(0);
  }, [activeColour]);

  const imagesLen = displayImages.length || 0;
  const hoverIndex = imagesLen === 4 
    ? (viewIndex === 0 ? 1 : 0)
    : (imagesLen > 1 ? 1 - viewIndex : 0);

  const img = displayImages[viewIndex] || displayImages[0] || null;
  const hover = displayImages[hoverIndex] || displayImages[0] || null;
  const wish = isWishlisted(product.id);

  // Check stock specifically for this color
  const colorStockQty = product.colorStock && product.colorStock[activeColour] !== undefined
    ? product.colorStock[activeColour]
    : (product.stock ?? 1);
  const isColorOutOfStock = colorStockQty === 0;

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="group block relative">
        <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100 border border-neutral-200 rounded-sm">
          {/* Main and Hover Image */}
          {isComingSoon ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-100 p-5 text-center select-none">
              <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-neutral-500 mb-1.5 font-bold">FORTIFIED</span>
              <span className="font-display text-sm font-black tracking-monolith text-black uppercase">{product.category}</span>
              <div className="h-[1px] w-6 bg-neutral-300 my-2.5" />
              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-neutral-600 border border-neutral-300 px-2 py-0.5 bg-white font-bold">COMING SOON</span>
            </div>
          ) : (
            <>
              {Boolean(img) && (
                <img 
                  src={img} 
                  alt={displayName} 
                  className="h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0" 
                />
              )}
              {Boolean(hover) && (
                <img 
                  src={hover} 
                  alt="" 
                  className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100" 
                />
              )}
            </>
          )}

          {/* Out of stock tint overlay */}
          {!isComingSoon && isColorOutOfStock && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-10 pointer-events-none">
              <span className="border border-red-500/50 bg-black/95 text-red-500 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.25em] font-black rounded">
                Out of Stock
              </span>
            </div>
          )}
          
          {isComingSoon && (
            <span className="absolute left-4 top-4 border border-neutral-300 bg-white/90 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-black font-bold z-10 shadow-sm">
              Coming Soon
            </span>
          )}

          {/* Limited Release / Custom Badging */}
          {product.collection === "Limited Edition" && !isColorOutOfStock && (
            <span className="absolute left-4 top-4 border border-black/10 bg-black px-3 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-white font-bold z-10 shadow-sm">
              Limited
            </span>
          )}

          {/* Front / Back selection floating overlay */}
          {displayImages && displayImages.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/90 backdrop-blur-md border border-neutral-200 px-1.5 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 max-w-[95%] shadow-md">
              {displayImages.length === 4 ? (
                <>
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setViewIndex(0); }}
                    className={`font-mono text-[8px] uppercase tracking-[0.1em] px-1.5 py-0.5 rounded transition-all whitespace-nowrap ${viewIndex === 0 ? "bg-black text-white font-bold" : "text-neutral-600 hover:text-black"}`}
                  >
                    Front
                  </button>
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setViewIndex(1); }}
                    className={`font-mono text-[8px] uppercase tracking-[0.1em] px-1.5 py-0.5 rounded transition-all whitespace-nowrap ${viewIndex === 1 ? "bg-black text-white font-bold" : "text-neutral-600 hover:text-black"}`}
                  >
                    Back
                  </button>
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setViewIndex(2); }}
                    className={`font-mono text-[8px] uppercase tracking-[0.1em] px-1.5 py-0.5 rounded transition-all whitespace-nowrap ${viewIndex === 2 ? "bg-black text-white font-bold" : "text-neutral-600 hover:text-black"}`}
                  >
                    Front (Close)
                  </button>
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setViewIndex(3); }}
                    className={`font-mono text-[8px] uppercase tracking-[0.1em] px-1.5 py-0.5 rounded transition-all whitespace-nowrap ${viewIndex === 3 ? "bg-black text-white font-bold" : "text-neutral-600 hover:text-black"}`}
                  >
                    Back (Close)
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setViewIndex(0);
                    }}
                    className={`font-mono text-[8px] uppercase tracking-[0.15em] px-2 py-0.5 rounded transition-all ${
                      viewIndex === 0 ? "bg-black text-white font-bold" : "text-neutral-600 hover:text-black"
                    }`}
                  >
                    Front
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setViewIndex(1);
                    }}
                    className={`font-mono text-[8px] uppercase tracking-[0.15em] px-2 py-0.5 rounded transition-all ${
                      viewIndex === 1 ? "bg-black text-white font-bold" : "text-neutral-600 hover:text-black"
                    }`}
                  >
                    Back
                  </button>
                </>
              )}
            </div>
          )}

          {/* Wishlist Heart */}
          <button
            onClick={handleWishlistClick}
            className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 border border-neutral-200 backdrop-blur-sm text-neutral-600 hover:text-black transition-all duration-300 hover:scale-110 active:scale-90 shadow-sm"
            aria-label="Add to Wishlist"
          >
            <Heart
              className={`h-4 w-4 transition-all duration-300 ${
                wish ? "fill-black text-black scale-110" : "text-neutral-500"
              }`}
            />
          </button>
        </div>
        
        <div className="mt-4 flex items-start justify-between">
          <div>
            <p className="text-sm font-bold text-black group-hover:text-neutral-700 transition-colors">{displayName}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-semibold">{product.collection}</p>
            
            {/* Star Rating display on card */}
            {avgRating && (
              <div className="mt-2 flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star
                      key={n}
                      className={`h-2.5 w-2.5 ${
                        n <= Math.round(Number(avgRating))
                          ? "fill-black text-black"
                          : "text-neutral-300 fill-neutral-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-mono text-[8px] text-neutral-600 font-bold">({avgRating})</span>
              </div>
            )}
            
            {/* Quick Palette Selector */}
            <div className="mt-3 flex items-center gap-1.5" onClick={(e) => e.preventDefault()}>
              {["Black", "White"].map(col => {
                const hex = col === "White" ? "#ffffff" : "#0a0a0a";
                const isStocked = (product.colorStock?.[col] ?? 1) > 0;
                return (
                  <button
                    key={col}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setActiveColour(col);
                    }}
                    className={`relative h-4 w-4 rounded-full border transition-all ${
                      activeColour === col ? "ring-2 ring-black border-white scale-110" : "border-neutral-300 hover:border-black"
                    }`}
                    style={{ backgroundColor: hex }}
                    title={`${col} ${isStocked ? "" : "(Out of Stock)"}`}
                  >
                    {!isStocked && (
                      <span className="absolute inset-0 flex items-center justify-center text-[8px] text-red-500 font-bold">×</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="font-mono text-sm font-bold text-black">{zar(product.price)}</span>
            {isColorOutOfStock && (
              <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-red-600 bg-red-50 px-1.5 py-0.5 border border-red-200 rounded font-bold">Sold Out</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
