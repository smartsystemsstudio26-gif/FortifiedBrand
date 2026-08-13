import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Phone } from "lucide-react";
import SpinningLogo from "./SpinningLogo";
import AdminLoginModal from "./AdminLoginModal";
import { FORTIFIED_SOCIALS, WhatsAppIcon, SouthAfricaFlag, GmailIcon } from "./SocialIcons";

export default function Footer() {
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  return (
    <>
      <footer className="border-t border-neutral-200 bg-white text-black">
        {/* Main Footer - White Background */}
        <div className="mx-auto max-w-[1600px] px-6 py-16 md:px-12 lg:px-16">
          <div className="grid gap-12 md:grid-cols-12 lg:gap-16">
            {/* Brand Left Column */}
            <div className="md:col-span-6 lg:col-span-6">
              <div className="flex items-center gap-3">
                <SpinningLogo size={52} />
                <h3 className="font-display text-3xl font-black tracking-monolith text-black md:text-4xl">
                  FORTIFIED
                </h3>
              </div>
              <p className="mt-4 font-mono text-xs uppercase tracking-[0.25em] text-neutral-500 font-bold">
                PERMANENT ART. TIMELESS QUALITY.
              </p>
              <div className="mt-2 space-y-1 font-mono text-[11px] uppercase tracking-[0.15em] text-neutral-600">
                <p>Enterprise Name: <span className="text-black font-bold">FORTIFIED BRAND (PTY) LTD</span></p>
                <p>Enterprise number: <span className="text-black font-bold">2025/120241/07</span></p>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {FORTIFIED_SOCIALS.map(({ Icon, href, name }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={name}
                    title={name}
                    className="flex h-10 w-10 items-center justify-center transition-all hover:scale-110 active:scale-95 drop-shadow-sm"
                  >
                    <Icon className="h-6 w-6" />
                  </a>
                ))}
              </div>
            </div>

            {/* Middle Column - Explore */}
            <div className="md:col-span-3 lg:col-span-3">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-neutral-500 font-bold">
                EXPLORE
              </p>
              <ul className="mt-5 space-y-3">
                {[
                  { l: "Shop", t: "/shop" },
                  { l: "Lookbook", t: "/lookbook" },
                  { l: "Capsule Drops", t: "/drop" },
                  { l: "About", t: "/about" },
                  { l: "My Orders & Tracking", t: "/my-orders" },
                  { l: "Guest Track Order", t: "/track-order" },
                  { l: "Client Services", t: "/services" },
                  { l: "Returns & Shipping", t: "/services" },
                ].map((x) => (
                  <li key={x.l}>
                    <Link
                      to={x.t}
                      className="text-sm text-neutral-700 transition-colors hover:text-black font-medium"
                    >
                      {x.l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column - Contact & Admin Access */}
            <div className="md:col-span-3 lg:col-span-3 flex flex-col justify-between">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-neutral-500 font-bold">
                  CONTACT
                </p>
                <ul className="mt-5 space-y-3 text-sm text-neutral-700">
                  <li className="flex items-center gap-2">
                    <a
                      href="tel:+27685940131"
                      title="Call Us"
                      className="text-neutral-800 hover:text-black transition-colors"
                    >
                      <Phone className="h-4 w-4" />
                    </a>
                    <a
                      href="https://wa.me/27685940131"
                      target="_blank"
                      rel="noreferrer"
                      title="WhatsApp Us"
                      className="transition-transform hover:scale-110"
                    >
                      <WhatsAppIcon className="h-4 w-4" />
                    </a>
                    <a href="tel:+27685940131" className="transition-colors hover:text-black font-medium">
                      +27 68 594 0131
                    </a>
                  </li>
                  <li>
                    <a href="mailto:fortifiedbrand31@gmail.com" className="transition-colors hover:text-black font-medium inline-flex items-center gap-2">
                      <GmailIcon className="h-4 w-4 shrink-0" />
                      <span>fortifiedbrand31@gmail.com</span>
                    </a>
                  </li>
                  <li className="pt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-black font-bold flex items-center gap-2">
                    <SouthAfricaFlag className="h-3.5 w-5 rounded-[2px] shadow-sm border border-neutral-200 inline-block shrink-0" />
                    <span>MADE IN SOUTH AFRICA</span>
                  </li>
                </ul>
              </div>

              {/* Stealth Admin Button */}
              <div className="mt-8 pt-4">
                <button
                  onClick={() => setIsAdminLoginOpen(true)}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 bg-neutral-100 border border-neutral-300 hover:border-black text-black font-mono text-xs font-black uppercase tracking-widest px-5 py-3 shadow-sm active:scale-95 opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity duration-300 cursor-pointer rounded-sm"
                  title="Admin Portal"
                >
                  <ShieldCheck className="h-4 w-4 text-black" />
                  <span>ADMIN PORTAL</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Details Bar - Dark Grey */}
        <div className="bg-neutral-900 border-t border-neutral-800 text-neutral-300">
          <div className="mx-auto max-w-[1600px] px-6 py-6 md:px-12 lg:px-16 flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-[11px] font-mono uppercase tracking-[0.15em]">
            <div className="flex items-center gap-2">
              <p className="text-white font-bold">© 2026 FORTIFIED BRAND</p>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-neutral-800 border border-neutral-700 text-neutral-200 rounded text-[10px] font-bold">
                <span>🇿🇦</span> South Africa
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-neutral-400">
              <span className="text-neutral-300">WEBSITE DESIGNED BY SMART SYSTEMS STUDIO</span>
              <a
                href="mailto:smartsystemsstudio26@gmail.com"
                className="lowercase transition-colors hover:text-white text-neutral-300 font-medium"
              >
                smartsystemsstudio26@gmail.com
              </a>
              <a
                href="tel:+27630751348"
                className="transition-colors hover:text-white text-neutral-300 font-medium"
              >
                063 075 1348
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
      />
    </>
  );
}
