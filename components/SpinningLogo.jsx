import React, { useState } from "react";

export default function SpinningLogo({ 
  size = 50, 
  logoSrc = "/images/brand/fiy-logo.png",
  logoInvert = false,
  logoGlow = true,
  logoBadge = true,
  className = "" 
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ perspective: "1000px" }}
    >
      <div
        style={{ transformStyle: "preserve-3d", width: size, height: size }}
        className="relative flex items-center justify-center"
      >
        {/* Glass backdrop disk so dark logos are visible on dark themes */}
        {logoBadge && (
          <div
            className="absolute inset-0 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-sm pointer-events-none"
            style={{ transform: "translateZ(0px)" }}
          />
        )}

        {!imgError && logoSrc ? (
          <img
            src={logoSrc}
            alt="Brand Logo"
            width={size}
            height={size}
            className={`w-full h-full object-contain p-0.5 ${
              logoGlow ? "drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]" : "drop-shadow-md"
            }`}
            style={{
              backfaceVisibility: "visible",
              transform: "translateZ(1px)",
              filter: logoInvert ? "invert(1) brightness(1.3)" : undefined,
            }}
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="w-full h-full rounded-full border border-white/30 bg-black/90 flex items-center justify-center font-bold text-white tracking-widest text-xs"
            style={{ transform: "translateZ(1px)" }}
          >
            F
          </div>
        )}
      </div>
    </div>
  );
}
