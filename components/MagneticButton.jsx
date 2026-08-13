import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function MagneticButton({ children, to, onClick, variant = "solid", className = "" }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    setPos({ x: x * 0.3, y: y * 0.3 });
  };
  const reset = () => setPos({ x: 0, y: 0 });

  const base =
    "relative inline-flex items-center justify-center px-9 py-4 text-xs font-mono uppercase tracking-[0.25em] transition-colors duration-300";
  
  let styles = "";
  if (variant === "solid") {
    styles = "bg-white text-black hover:bg-[#A8A8A8]";
  } else if (variant === "solid-black") {
    styles = "bg-black text-white hover:bg-neutral-900 border border-black";
  } else if (variant === "outline-dark") {
    styles = "border border-black bg-transparent !text-black hover:bg-black/5";
  } else if (variant === "outline-light") {
    styles = "border border-white/70 bg-black/60 !text-white backdrop-blur-md hover:bg-white hover:!text-black";
  } else {
    styles = "border border-neutral-300 bg-neutral-100 !text-black hover:border-black hover:bg-black hover:!text-white font-bold transition-all shadow-xs";
  }

  const content = (
    <motion.span
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className={`${base} ${styles} ${className}`}
    >
      {children}
    </motion.span>
  );

  if (to) return <Link to={to} onClick={onClick}>{content}</Link>;
  return <button onClick={onClick} className="bg-transparent">{content}</button>;
}
