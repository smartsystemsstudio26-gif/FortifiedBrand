import { useState, useEffect } from "react";
import { syncStoreSettingsToFirestore, subscribeStoreSettingsFromFirestore } from "./firebase";

const SETTINGS_KEY = "fortified_store_settings";

export const DEFAULT_STORE_SETTINGS = {
  // Marquee running text
  marqueeEnabled: true,
  marqueeText: "FORTIFIED LIMITED EDITION • 10% OFF ALL TEES • EXPRESS DOOR-TO-DOOR COURIER NATIONWIDE • PERMANENT ART",
  marqueeSpeed: 20,
  marqueeTheme: "white", // "white" | "dark" | "red" | "gold"
  marqueeTextColor: "black", // "black" | "white" | "gold" | "red"

  // Main Page Fortifiedbrand Launch Countdown
  launchCountdownEnabled: true,
  launchTitle: "FORTIFIEDBRAND OFFICIAL LAUNCH",
  launchSubtext: "OFFICIAL STORE LAUNCH & LIMITED EDITION DROP RELEASE",
  launchTargetDate: "2026-08-25T00:00:00",
  launchCtaText: "VIP EARLY ACCESS",
  launchCtaLink: "/shop",

  // Sale notification banner (72hr sale, 10% off, etc)
  saleBannerEnabled: true,
  saleBannerText: "⚡ 72 HOUR FLASH SALE — 10% OFF SITEWIDE",
  saleBannerSubtext: "Express door-to-door courier nationwide across South Africa (R100 flat rate)",
  saleBannerCode: "FORTIFIED10",
  saleBannerHours: 72,
  saleBannerCtaPath: "/shop",
  saleBannerStartTime: Date.now(),
  saleBannerStyle: "white", // "white" | "red" | "gold" | "black" | "emerald" | "neon" | "blue"
  saleDiscountPercent: 10,
  saleScope: "all", // "all" | "collections" | "products"

  // Shipping Rates & Logistics Settings
  nationalShippingFee: 100, // R 100 standard door-to-door express courier in South Africa
  nationalFreeThreshold: 0, // No complimentary shipping
  internationalShippingFee: 450, // R 450 flat rate for international express air shipping
  internationalFreeThreshold: 0, // No complimentary shipping
  nationalShippingDays: "1–3 Business Days",
  internationalShippingDays: "3–7 Business Days",

  // Brand media assets
  logoUrl: "/images/brand/fiy-logo.png",
  logoInvert: false,
  logoGlow: true,
  logoBadge: true,
  heroBgUrl: "/images/backgrounds/hero.jpg",
  heroVideoUrl: "/videos/hero-background.mp4",
  heroMediaType: "image", // "image" | "video"
  campaignVideoUrl: "/videos/campaign.mp4",

  // Payment gateway configuration. Secrets are NEVER stored in browser storage or Firestore.
  payfastMerchantId: "",
  payfastEnv: "live", // "sandbox" | "live"
  yocoPublicKey: import.meta.env.VITE_YOCO_PUBLIC_KEY || "",
  paypalMeUrl: "https://paypal.me/VumileTshazi",
  paypalHandle: "@VumileTshazi",
  bankEftDetails: "Bank: First National Bank (FNB)\nAccount Name: FORTIFIED BRAND\nAccount Number: 62890123456\nBranch Code: 250655",
};

export function getStoreSettings() {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.nationalShippingFee === 150) parsed.nationalShippingFee = 100;
      if (parsed.nationalFreeThreshold === 2500) parsed.nationalFreeThreshold = 0;
      if (parsed.internationalFreeThreshold === 3500) parsed.internationalFreeThreshold = 0;
      // Convert old default dark/red themes to white background with black text
      if (parsed.saleBannerStyle === "red" || parsed.saleBannerStyle === "black" || !parsed.saleBannerStyle) {
        parsed.saleBannerStyle = "white";
      }
      if (parsed.marqueeTheme === "dark" || !parsed.marqueeTheme) {
        parsed.marqueeTheme = "white";
      }
      if (parsed.marqueeTextColor === "white" || !parsed.marqueeTextColor) {
        parsed.marqueeTextColor = "black";
      }
      if (parsed.saleBannerEnabled === undefined) parsed.saleBannerEnabled = true;
      if (parsed.marqueeEnabled === undefined) parsed.marqueeEnabled = true;
      if (parsed.launchCountdownEnabled === undefined) parsed.launchCountdownEnabled = true;
      // Never allow server credentials to come back from browser storage or Firestore.
      delete parsed.yocoSecretKey;
      delete parsed.payfastMerchantKey;
      delete parsed.payfastPassphrase;
      parsed.yocoPublicKey = parsed.yocoPublicKey || import.meta.env.VITE_YOCO_PUBLIC_KEY || "";
      if (!parsed.payfastMerchantId || parsed.payfastMerchantId === "10000100") {
        parsed.payfastMerchantId = "";
      }
      if (parsed.payfastEnv !== "sandbox" && parsed.payfastEnv !== "live") {
        parsed.payfastEnv = "live";
      }
      return { ...DEFAULT_STORE_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.error("Error reading store settings from localStorage:", e);
  }
  return DEFAULT_STORE_SETTINGS;
}

export function saveStoreSettings(newSettings) {
  try {
    const current = getStoreSettings();
    const updated = { ...current, ...newSettings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("fortified_settings_updated"));
    window.dispatchEvent(new Event("storage"));
    
    // Asynchronously push to Firebase Firestore
    syncStoreSettingsToFirestore(updated).catch(() => {});
    
    return updated;
  } catch (e) {
    console.error("Error saving store settings to localStorage:", e);
    return getStoreSettings();
  }
}

export function useStoreSettings() {
  const [settings, setSettings] = useState(getStoreSettings());

  useEffect(() => {
    const handleUpdate = () => {
      setSettings(getStoreSettings());
    };
    window.addEventListener("fortified_settings_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    // Subscribe to real-time Firestore updates
    const unsubscribeFirestore = subscribeStoreSettingsFromFirestore((remoteSettings) => {
      if (remoteSettings && typeof remoteSettings === "object") {
        try {
          const current = getStoreSettings();
          const safeRemoteSettings = { ...remoteSettings };
          delete safeRemoteSettings.yocoSecretKey;
          delete safeRemoteSettings.payfastMerchantKey;
          delete safeRemoteSettings.payfastPassphrase;
          const merged = { ...current, ...safeRemoteSettings };
          localStorage.setItem(SETTINGS_KEY, JSON.stringify(merged));
          setSettings(merged);
        } catch (err) {
          console.warn("Error applying remote settings:", err);
        }
      }
    });

    return () => {
      window.removeEventListener("fortified_settings_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
      if (unsubscribeFirestore) unsubscribeFirestore();
    };
  }, []);

  return {
    settings,
    updateSettings: saveStoreSettings,
    storeSettings: settings,
    updateStoreSettings: saveStoreSettings,
  };
}
