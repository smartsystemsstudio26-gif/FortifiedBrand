import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, RotateCw } from "lucide-react";

export default function Lightbox({
  isOpen,
  onClose,
  images = [],
  initialIndex = 0,
}) {
  const [index, setIndex] = useState(initialIndex);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setIndex(initialIndex);
      setRotation(0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, initialIndex]);

  const handleNext = useCallback((e) => {
    if (e) e.stopPropagation();
    setIndex((prev) => (prev + 1) % images.length);
    setRotation(0);
  }, [images.length]);

  const handlePrev = useCallback((e) => {
    if (e) e.stopPropagation();
    setIndex((prev) => (prev - 1 + images.length) % images.length);
    setRotation(0);
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[index];

  const rotate = (e) => {
    e.stopPropagation();
    setRotation((prev) => prev + 90);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-xl"
        onClick={onClose}
        id="lightbox-container"
      >
        {/* Top bar with image info and controls */}
        <div className="flex h-20 w-full items-center justify-between px-6 md:px-12 z-50">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#A8A8A8]">
            <span className="text-white font-bold">{index + 1}</span> of {images.length} · Editorial Preview
          </div>

          <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
            {/* Rotate */}
            <button
              onClick={rotate}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#A8A8A8] hover:text-white transition-all hover:scale-105"
              title="Rotate"
              id="lightbox-btn-rotate"
            >
              <RotateCw size={15} />
            </button>

            {/* Divider */}
            <div className="h-5 w-[1px] bg-white/10" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all hover:scale-105"
              aria-label="Close preview"
              id="lightbox-btn-close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Main stage */}
        <div 
          className="relative flex-1 flex items-center justify-center overflow-hidden px-16 select-none"
        >
          {/* Left Arrow */}
          {images.length > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-6 md:left-12 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/40 text-[#A8A8A8] hover:text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-black/80"
              aria-label="Previous image"
              id="lightbox-btn-prev"
            >
              <ChevronLeft size={22} />
            </button>
          )}

          {/* Image Canvas */}
          <div className="relative max-h-[75vh] max-w-[85vw] overflow-hidden">
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{
                rotate: rotation,
                opacity: 1,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={currentImage || "/images/embroidered-black/emb_black_front.jpg"}
                alt="Fullscreen Preview"
                referrerPolicy="no-referrer"
                className="pointer-events-none max-h-[75vh] max-w-[85vw] object-contain shadow-2xl rounded-sm"
              />
            </motion.div>
          </div>

          {/* Right Arrow */}
          {images.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-6 md:right-12 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-black/40 text-[#A8A8A8] hover:text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-black/80"
              aria-label="Next image"
              id="lightbox-btn-next"
            >
              <ChevronRight size={22} />
            </button>
          )}
        </div>

        {/* Thumbnails strip at the bottom */}
        {images.length > 1 && (
          <div 
            className="flex h-24 w-full items-center justify-center gap-3 bg-black/30 backdrop-blur-md px-6 py-4 border-t border-white/5 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-2 max-w-full overflow-x-auto no-scrollbar py-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setIndex(i);
                    setRotation(0);
                  }}
                  className={`relative h-12 w-10 flex-shrink-0 overflow-hidden border transition-all ${
                    index === i ? "border-white ring-1 ring-white/20" : "border-white/10 hover:border-white/40"
                  }`}
                  id={`lightbox-thumb-${i}`}
                >
                  <img src={img || "/images/embroidered-black/emb_black_front.jpg"} alt="" className="h-full w-full object-cover opacity-60 hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
