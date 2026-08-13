import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Search } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { useSearch } from "@/lib/SearchContext";
import SpinningLogo from "@/components/SpinningLogo";
import NavigationDrawer from "@/components/NavigationDrawer";
import SaleNotificationBanner from "@/components/SaleNotificationBanner";
import { useStoreSettings } from "@/lib/storeSettings";

export default function Navbar() {
  const { count, setOpen: setCartOpen } = useCart();
  const { openSearch } = useSearch();
  const { storeSettings } = useStoreSettings();
  
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close drawer on page change
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  // Determine if top header is over a dark page hero (e.g., Homepage hero)
  const isDarkHero = location.pathname === "/" && !scrolled;

  const textClass = !isDarkHero
    ? "!text-black drop-shadow-[0_1px_0_rgba(255,255,255,0.7)]"
    : "!text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.95)]";
  const bgClass = !isDarkHero ? "bg-black" : "bg-white";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 border-b ${
          scrolled
            ? "bg-white/95 border-neutral-100 backdrop-blur-md"
            : "bg-transparent border-transparent"
        }`}
      >
        <SaleNotificationBanner />
        <div className={scrolled ? "py-3.5 transition-all duration-300" : "py-6 transition-all duration-300"}>
          <nav className="relative mx-auto flex max-w-[1600px] items-center justify-between px-6 md:px-12 h-10">
          
          {/* LEFT: AMIRI-inspired Hamburger Button */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="group relative flex h-10 w-auto items-center justify-start rounded-full bg-transparent focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-2 focus:ring-offset-black active:scale-95 transition-transform"
              aria-label="Toggle Navigation Drawer"
            >
              {/* Hamburger Icon Container */}
              <div className="relative flex h-[12px] w-6 flex-col justify-between items-center">
                <span
                  className={`h-0.5 w-7 rounded-full ${bgClass} shadow-[0_1px_2px_rgba(0,0,0,0.75)] transition-all duration-300 ease-out ${
                    drawerOpen ? "translate-y-[5px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`h-0.5 w-7 rounded-full ${bgClass} shadow-[0_1px_2px_rgba(0,0,0,0.75)] transition-all duration-300 ease-out ${
                    drawerOpen ? "opacity-0 scale-x-0" : ""
                  }`}
                />
                <span
                  className={`h-0.5 w-7 rounded-full ${bgClass} shadow-[0_1px_2px_rgba(0,0,0,0.75)] transition-all duration-300 ease-out ${
                    drawerOpen ? "-translate-y-[5.5px] -rotate-45" : ""
                  }`}
                />
              </div>
              <span className={`hidden md:inline font-mono text-[10px] uppercase tracking-[0.3em] ${textClass} transition-colors ml-3 group-hover:text-neutral-500`}>
                {drawerOpen ? "Close" : "Menu"}
              </span>
            </button>
          </div>
 
          {/* CENTER: Absolutely Centered Brand Identity */}
          <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center">
            <Link to="/" className={`flex items-center gap-2.5 md:gap-3.5 ${textClass} group`}>
              <SpinningLogo
                size={scrolled ? 36 : 46}
                logoSrc={storeSettings?.logoUrl || "/images/brand/fiy-logo.png"}
                logoInvert={storeSettings?.logoInvert ?? false}
                logoGlow={storeSettings?.logoGlow ?? true}
                logoBadge={storeSettings?.logoBadge ?? true}
              />
              <div className="flex flex-col items-stretch leading-none">
                <span className={`font-display text-base md:text-xl font-black tracking-[0.3em] md:tracking-[0.35em] -mr-[0.3em] md:-mr-[0.35em] ${textClass} transition-colors duration-300 group-hover:text-neutral-500`}>
                  FORTIFIED
                </span>
                {!scrolled && (
                  <div className={`mx-auto mt-0.5 flex w-[62%] justify-between font-mono text-[5px] font-bold uppercase md:mt-1 md:text-[6px] ${textClass} select-none`}>
                    {"PERMANENT ART".split("").map((char, index) => (
                      <span key={index}>
                        {char === " " ? "\u00A0" : char}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          </div>
 
          {/* RIGHT: User Utilities */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Search Trigger Button */}
            <button
              onClick={openSearch}
              className={`relative ${textClass} transition-transform hover:scale-105 p-1.5 flex items-center gap-1.5`}
              aria-label="Open search engine"
              title="Search Vault (⌘K)"
            >
              <Search className="h-4 w-4 stroke-current stroke-[2.25] drop-shadow-[0_1px_2px_rgba(0,0,0,0.75)]" />
            </button>

            {/* Shopping Bag Trigger */}
            <button
              onClick={() => setCartOpen(true)}
              className={`relative ${textClass} transition-transform hover:scale-105 p-1.5`}
              aria-label="Open cart"
            >
              <ShoppingBag className="h-4 w-4 stroke-current stroke-[2.25] drop-shadow-[0_1px_2px_rgba(0,0,0,0.75)]" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-black font-mono text-[8px] text-white font-black">
                  {count}
                </span>
              )}
            </button>
          </div>
        </nav>
      </div>
    </header>

      {/* AMIRI-inspired Navigation Drawer */}
      <NavigationDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
