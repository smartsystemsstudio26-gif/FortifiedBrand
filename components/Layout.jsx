import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import SearchModal from "./SearchModal";
import CustomCursor from "./CustomCursor";
import SpinningLogo from "./SpinningLogo";

export default function Layout() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <CustomCursor />
      <Navbar />
      <CartDrawer />
      <SearchModal />
      <main>
        <Outlet />
      </main>

      {/* Floating Spinning Logo on the side of the website (Bottom-Right, interactive) */}
      <div className="fixed bottom-8 right-8 z-30 hidden md:block">
        <button
          onClick={scrollToTop}
          className="group relative flex h-16 w-16 items-center justify-center rounded-full bg-transparent border-0 p-1 transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Scroll to top"
        >
          <SpinningLogo size={50} isLight={true} />
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 rounded surface-dark px-2 py-1 text-[9px] font-mono uppercase tracking-wider fg-light transition-all duration-200 group-hover:scale-100 whitespace-nowrap">
            TOP
          </span>
        </button>
      </div>

      <Footer />
    </div>
  );
}