import React from "react";

/**
 * FlagImage Component
 * Renders a high-definition national flag SVG/PNG image based on ISO 2-letter country code (e.g. ZA, US, GB).
 * Prevents OS-specific emoji rendering issues on Windows where emoji flags display as abbreviated letters like "ZA".
 */
export default function FlagImage({ code, className = "w-5 h-3.5 object-cover rounded-[2px] border border-neutral-300 shadow-xs shrink-0 inline-block align-middle" }) {
  if (!code || typeof code !== "string" || code.length !== 2) {
    return <span className="text-sm">🌐</span>;
  }

  const lower = code.toLowerCase();
  
  return (
    <img
      src={`https://flagcdn.com/w40/${lower}.png`}
      srcSet={`https://flagcdn.com/w80/${lower}.png 2x`}
      alt={code.toUpperCase()}
      className={className}
      loading="lazy"
      onError={(e) => {
        // Fallback to stylized text if network fails
        e.currentTarget.onerror = null;
        e.currentTarget.style.display = "none";
      }}
    />
  );
}
