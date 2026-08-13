import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Truck, ShieldCheck, Star } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useCart } from "@/lib/CartContext";
import { useWishlist } from "@/lib/WishlistContext";
import { getProductColourDescription, getProductColourName, getProductDefaultColour, zar } from "@/lib/media";
import ProductGallery from "@/components/product/ProductGallery";
import MoreMeaning from "@/components/product/MoreMeaning";
import CareAccordion from "@/components/product/CareAccordion";
import SizeGuide from "@/components/product/SizeGuide";
import Reviews from "@/components/product/Reviews";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import BackButton from "@/components/BackButton";

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [size, setSize] = useState(null);
  const [colour, setColour] = useState("Black");
  const [reviews, setReviews] = useState([]);
  
  const { toggleWishlist, isWishlisted } = useWishlist();

  const [error, setError] = useState(false);

  const loadReviews = () => {
    if (id) {
      base44.entities.Review.filter({ product_id: id }, "-created_date")
        .then(setReviews)
        .catch(() => {});
    }
  };

  useEffect(() => {
    loadReviews();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
    base44.entities.Product.get(id)
      .then((p) => {
        if (!p || p.hidden) {
          setError(true);
          return;
        }
        setProduct(p);
        setSize(p.sizes?.includes("M") ? "M" : p.sizes?.[0]);
        setColour(getProductDefaultColour(p));
        base44.entities.Product.list("-created_date", 20)
          .then((all) => setRelated(all.filter((x) => x.id !== p.id && !x.hidden).slice(0, 4)))
          .catch((err) => console.warn("Failed to load related products:", err));
      })
      .catch(() => setError(true));
  }, [id]);

  // Keep the product information aligned with the selected tee colour.
  const displayTitle = React.useMemo(
    () => getProductColourName(product, colour),
    [product, colour],
  );

  const displayDescription = React.useMemo(
    () => getProductColourDescription(product, colour),
    [product, colour],
  );

  if (error)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white text-black">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-500 font-bold">Piece not found</p>
        <BackButton to="/shop" />
      </div>
    );

  if (!product)
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-black" />
      </div>
    );

  // Show the image set that matches the selected colour when available
  const activeImages =
    product.colorImages && product.colorImages[colour] && product.colorImages[colour].length > 0
      ? product.colorImages[colour]
      : product.images;
  const isComingSoon = !activeImages || activeImages.length === 0;
  const images = isComingSoon ? [] : activeImages;
  
  // Calculate stock based on color selection
  const colorStockQty = product.colorStock && product.colorStock[colour] !== undefined 
    ? product.colorStock[colour] 
    : (product.stock ?? 0);
  const inStock = !isComingSoon && colorStockQty > 0;

  const colours = [
    { name: "Black", hex: "#0a0a0a" },
    { name: "White", hex: "#ffffff" }
  ];

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  return (
    <div className="pt-24 bg-white min-h-screen text-black">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-6 pb-12 pt-6 md:px-12 lg:grid-cols-2">
        <ProductGallery images={images} activeColour={colour} product={product} />

        <div className="flex flex-col">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-bold">{product.collection}</p>
          <h1 className="mt-4 font-display text-4xl font-black leading-none tracking-monolith text-black md:text-6xl">{displayTitle}</h1>
          
          {/* Star Rating summary */}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className={`h-3.5 w-3.5 ${
                    n <= Math.round(Number(avgRating))
                      ? "fill-black text-black"
                      : "text-neutral-300 fill-neutral-200"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => {
                document.getElementById("reviews-section")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-600 hover:text-black transition-colors cursor-pointer border-b border-dashed border-neutral-300 hover:border-black pb-0.5 font-bold"
            >
              {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"} ({avgRating})
            </button>
          </div>

          <p className="mt-5 font-mono text-2xl font-bold text-black">{zar(product.price)}</p>

          <p className="mt-8 max-w-md leading-relaxed text-neutral-700 whitespace-pre-line font-medium">{displayDescription}</p>

          <div className="mt-8 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] font-bold">
            <span className={`h-2 w-2 rounded-full ${isComingSoon ? "bg-amber-500 animate-pulse" : inStock ? "bg-green-600" : "bg-red-600"}`} />
            <span className="text-neutral-700">
              {isComingSoon ? "Coming Soon" : inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <div className="mt-8">
            <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.2em] text-black font-bold">Colour — {colour}</span>
            <div className="flex items-center gap-4">
              {colours.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColour(c.name)}
                  aria-label={c.name}
                  className={`relative flex items-center gap-2 px-3 py-2 rounded border transition-all ${
                    colour === c.name 
                      ? "border-black bg-black text-white font-bold" 
                      : "border-neutral-300 bg-neutral-50 text-neutral-700 hover:border-black"
                  }`}
                >
                  <span 
                    className="h-4 w-4 rounded-full border border-neutral-400 inline-block" 
                    style={{ backgroundColor: c.hex }} 
                  />
                  <span className="font-mono text-xs uppercase tracking-wider">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black font-bold">Select Size</span>
              <SizeGuide />
            </div>
            <div className="flex flex-wrap gap-2">
              {(product.sizes || ["XS", "S", "M", "L", "XL"]).map((s) => (
                <button 
                  key={s} 
                  onClick={() => setSize(s)} 
                  className={`h-12 w-12 border font-mono text-xs font-bold transition-colors rounded-xs ${
                    size === s ? "border-black bg-black text-white" : "border-neutral-300 text-neutral-700 hover:border-black bg-neutral-50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-neutral-500 font-semibold">Model is wearing Size M</p>
          </div>

          <div className="mt-8 flex gap-3">
            <motion.button 
              whileTap={{ scale: 0.97 }} 
              disabled={isComingSoon || !inStock} 
              onClick={() => addItem(product, size, colour)} 
              className="flex-1 bg-black py-4 font-mono text-xs uppercase tracking-[0.25em] text-white font-bold transition-colors hover:bg-neutral-800 disabled:opacity-40 rounded-xs shadow-sm"
            >
              {isComingSoon ? "Coming Soon" : inStock ? "Add to Bag" : "Out of Stock"}
            </motion.button>
            <button
              onClick={() => toggleWishlist(product)}
              className="flex h-[52px] w-[52px] items-center justify-center border border-neutral-300 hover:border-black text-black hover:scale-105 active:scale-95 transition-all duration-300 rounded-xs bg-neutral-50"
              title="Add to Wishlist"
            >
              <Heart className={`h-5 w-5 transition-colors duration-300 ${isWishlisted(product.id) ? "fill-black text-black" : "text-neutral-500"}`} />
            </button>
          </div>

          <div className="mt-6 space-y-3 border-t border-neutral-200 pt-6 font-mono text-[10px] uppercase tracking-[0.15em] text-neutral-600 font-semibold">
            <p className="flex items-center gap-3"><Truck className="h-4 w-4 text-black" /> SA Express Courier R100 (1–3 Days) · Worldwide Express Air R450</p>
            <p className="flex items-center gap-3"><ShieldCheck className="h-4 w-4 text-black" /> 14-day returns on eligible items</p>
          </div>

          <div className="mt-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-bold">Product Care</p>
            <div className="mt-4"><CareAccordion /></div>
          </div>
        </div>
      </div>

      <MoreMeaning activeColour={colour} />
      <Reviews productId={product.id} onReviewAdded={loadReviews} />

      {related.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-6 pb-28 md:px-12">
          <Reveal className="mb-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-neutral-500 font-bold">You May Also Like</p>
            <h2 className="mt-4 font-display text-4xl font-black tracking-monolith text-black md:text-6xl">Related</h2>
          </Reveal>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}

      <div className="mx-auto max-w-[1600px] px-6 pb-20 md:px-12">
        <div className="pt-8 border-t border-neutral-200 flex justify-start">
          <BackButton label="BACK" to="/shop" />
        </div>
      </div>
    </div>
  );
}
