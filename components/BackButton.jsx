import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ className = "", label = "BACK", to = null, dark = false, onClick = null }) {
  const navigate = useNavigate();

  const handleBack = (e) => {
    if (onClick) {
      onClick(e);
      return;
    }
    if (to) {
      navigate(to);
    } else if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const textLabel = (typeof label === "string" && label.trim()) ? label.toUpperCase() : "BACK";

  return (
    <button
      onClick={handleBack}
      type="button"
      className={`group inline-flex items-center gap-2 py-1 bg-transparent border-0 shadow-none font-mono text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-150 cursor-pointer ${
        dark
          ? "text-neutral-400 hover:text-white"
          : "text-neutral-600 hover:text-black"
      } ${className}`}
      aria-label="Go back"
      title="Go back"
    >
      <ArrowLeft className="h-4 w-4 stroke-[2.25] transition-transform duration-150 group-hover:-translate-x-1 shrink-0" />
      <span>{textLabel}</span>
    </button>
  );
}

