import React from "react";
import { useCurrency } from "@/context/CurrencyContext";
import { Globe, ChevronDown } from "lucide-react";

export default function CurrencySelectorBadge({ className = "", compact = false, showLabel = true }) {
  const { currentCountry, currentCurrency, openCurrencyModal } = useCurrency();

  return (
    <button
      type="button"
      onClick={openCurrencyModal}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200/80 text-black font-mono text-xs transition-all cursor-pointer group ${className}`}
      title={`Current Currency: ${currentCountry.name} (${currentCurrency.code}). Click to switch country or currency.`}
    >
      <span className="text-base leading-none">{currentCountry.flag}</span>
      <span className="font-bold text-[11px] tracking-tight">{currentCurrency.code}</span>
      {showLabel && currentCurrency.symbol && (
        <span className="text-neutral-500 text-[10px]">({currentCurrency.symbol})</span>
      )}
      <ChevronDown className="w-3 h-3 text-neutral-400 group-hover:text-black transition-colors" />
    </button>
  );
}
