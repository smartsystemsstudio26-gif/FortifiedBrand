import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(max-width: 768px)").matches) return;
    const move = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      const el = e.target;
      setHovering(!!el.closest("a, button, [data-cursor]"));
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  if (typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches) return null;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full bg-white mix-blend-difference"
        animate={{ x: pos.x - 4, y: pos.y - 4, scale: hovering ? 0 : 1 }}
        transition={{ type: "tween", ease: "linear", duration: 0.02 }}
        style={{ width: 8, height: 8 }}
      />
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none rounded-full border border-[#A8A8A8] mix-blend-difference"
        animate={{ x: pos.x - 20, y: pos.y - 20, scale: hovering ? 1.6 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        style={{ width: 40, height: 40 }}
      />
    </>
  );
}