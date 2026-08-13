import React, { useState } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import { Globe, Search, Check, X, ShieldCheck, ArrowRight, RefreshCw } from "lucide-react";

export default function CurrencySelectorModal() {
  const {
    isCurrencyModalOpen,
    closeCurrencyModal,
    currentCountry,
    currentCurrency,
    setCountryCode,
    setCurrencyCode,
    allCountries,
    allCurrencies,
    formatPrice
  } = useCurrency();

  const [search, setSearch] = useState("");

  if (!isCurrencyModalOpen) return null;

  // Filter countries or currencies based on search
  const filteredCountries = allCountries.filter((c) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.currency.code.toLowerCase().includes(q) ||
      c.currency.name.toLowerCase().includes(q)
    );
  });

  const popularCurrencies = [
    { code: "ZAR", flag: "🇿🇦", label: "South Africa (ZAR)" },
    { code: "USD", flag: "🇺🇸", label: "United States (USD)" },
    { code: "GBP", flag: "🇬🇧", label: "United Kingdom (GBP)" },
    { code: "EUR", flag: "🇪🇺", label: "Eurozone (EUR)" },
    { code: "CAD", flag: "🇨🇦", label: "Canada (CAD)" },
    { code: "AUD", flag: "🇦🇺", label: "Australia (AUD)" },
    { code: "AED", flag: "🇦🇪", label: "UAE (AED)" },
    { code: "NGN", flag: "🇳🇬", label: "Nigeria (NGN)" },
    { code: "KE", flag: "🇰🇪", label: "Kenya (KES)" }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col max-h-[85vh] text-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl">
              <Globe className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="font-display text-base font-black uppercase tracking-wider">
                International Region & Currency
              </h2>
              <p className="font-mono text-[10px] text-neutral-400">
                Select your destination country to adjust prices live up to payment
              </p>
            </div>
          </div>
          <button
            onClick={closeCurrencyModal}
            className="p-2 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Preview Bar */}
        <div className="px-5 py-3.5 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-xl">{currentCountry.flag}</span>
            <span className="font-bold text-black">{currentCountry.name}</span>
            <span className="text-neutral-500">({currentCurrency.code})</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase text-neutral-500 block">Sample Tee Price</span>
            <span className="font-bold text-black">{formatPrice(1950, true)}</span>
          </div>
        </div>

        {/* Quick Popular Picks */}
        <div className="p-4 border-b border-neutral-100 bg-white">
          <p className="font-mono text-[10px] uppercase font-bold text-neutral-400 tracking-widest mb-2.5">
            Popular Destinations
          </p>
          <div className="flex flex-wrap gap-1.5">
            {popularCurrencies.map((p) => {
              const isSelected =
                (p.code === "ZAR" && currentCurrency.code === "ZAR") ||
                currentCurrency.code === p.code;
              return (
                <button
                  key={p.code}
                  onClick={() => {
                    if (p.code === "ZAR") {
                      setCountryCode("ZA");
                    } else if (p.code === "USD") {
                      setCountryCode("US");
                    } else if (p.code === "GBP") {
                      setCountryCode("GB");
                    } else if (p.code === "EUR") {
                      setCountryCode("DE");
                    } else if (p.code === "CAD") {
                      setCountryCode("CA");
                    } else if (p.code === "AUD") {
                      setCountryCode("AU");
                    } else if (p.code === "AED") {
                      setCountryCode("AE");
                    } else if (p.code === "NGN") {
                      setCountryCode("NG");
                    } else if (p.code === "KE") {
                      setCountryCode("KE");
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 border transition-all ${
                    isSelected
                      ? "bg-black text-white border-black font-bold shadow-sm"
                      : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-black"
                  }`}
                >
                  <span>{p.flag}</span>
                  <span>{p.code}</span>
                  {isSelected && <Check className="w-3 h-3 text-emerald-400 ml-0.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-neutral-100 bg-neutral-50/50">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country, currency (e.g. USA, Euro, Pound, Nigeria...)"
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-mono focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Country & Currency List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 divide-y divide-neutral-100">
          {filteredCountries.length === 0 ? (
            <div className="text-center py-10 text-neutral-400 font-mono text-xs">
              No matching countries found for "{search}".
            </div>
          ) : (
            filteredCountries.map((c) => {
              const isSelected = currentCountry.code === c.code;
              const curr = c.currency;

              return (
                <div
                  key={c.code}
                  onClick={() => setCountryCode(c.code)}
                  className={`pt-2.5 pb-2 px-3 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                    isSelected
                      ? "bg-black text-white font-bold shadow-sm"
                      : "hover:bg-neutral-100 text-neutral-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl shrink-0">{c.flag}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-mono font-bold">{c.name}</p>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold uppercase ${
                            isSelected
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-neutral-200/80 text-neutral-700"
                          }`}
                        >
                          {curr.code} ({curr.symbol})
                        </span>
                      </div>
                      <p
                        className={`text-[10px] font-mono ${
                          isSelected ? "text-neutral-300" : "text-neutral-500"
                        }`}
                      >
                        {curr.name} · {curr.code === "ZAR" ? "Base Currency" : `Rate: 1 ZAR = ${curr.symbol}${curr.rate}`}
                      </p>
                    </div>
                  </div>

                  {isSelected ? (
                    <div className="flex items-center gap-1 text-emerald-400 font-mono text-xs font-bold shrink-0">
                      <Check className="w-4 h-4" />
                      <span>Active</span>
                    </div>
                  ) : (
                    <span className="text-[10px] font-mono text-neutral-400 hover:text-black shrink-0">
                      Select →
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-neutral-900 text-neutral-300 border-t border-neutral-800 flex items-center justify-between font-mono text-[10px]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Guaranteed live currency conversion up to checkout payment authorization</span>
          </div>
          <button
            onClick={closeCurrencyModal}
            className="px-4 py-2 bg-white text-black font-bold uppercase tracking-wider rounded-lg hover:bg-neutral-200 transition-all shrink-0"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
}
