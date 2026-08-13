export const IMG = {
  hero: "/images/backgrounds/hero.jpg",
  heroSlide1: "",
  heroSlide2: "",
  teeFront: "",
  teeBack: "",
  macro: "",
  look1: "",
  look2: "",
  lookWide: "",
  craft: "",
  collA: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-07-18%20at%2009.36.13%20%281%29-5I4oGXN65PSH9qQbjMUy0vkOuuA7dx.jpeg",
  collB: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-07-18%20at%2009.36.14-rCiYLXtHvAJmbhhbOwYhzqPyLALure.jpeg",
  collC: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-07-18%20at%2009.36.13-UbmfuMZEe4c1xopdKJnrgzWzfiGouN.jpeg",
  ethos: "",
  whiteTeeFront: "",
  whiteTeeBack: "",
  blackTeeFront: "",
  blackTeeBack: "",
  printedWhiteFront: "",
  printedWhiteBack: "",
  printedBlackFront: "",
  printedBlackBack: "",
  embBlack0: "",
  embBlack1: "",
  embBlack2: "",
  embBlack3: "",
  embWhite0: "",
  embWhite1: "",
  embWhite2: "",
  embWhite3: "",
  classicBlackEmb: "",
  classicWhiteWidePrint0: "",
  classicWhiteWidePrint1: "",
  classicWhiteWidePrint2: "",
  classicJetBlackWidePrint0: "",
  classicJetBlackWidePrint1: "",
  classicJetBlackWidePrint2: "",
  lookbook0: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-07-18%20at%2009.36.13-PoVubia3jRXBkSZ9CSTUacjhglbMm0.jpeg",
  lookbook1: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-07-18%20at%2009.36.13%20%281%29-lX3MSliKaKdQxGF9HEMN940q6kccZl.jpeg",
  lookbook2: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-07-18%20at%2009.36.14-owxmSKvXOQULzzkmphImhMMJJTGxw3.jpeg",
};

// All T-shirt images used for the looping editorial slideshow
export const TEE_SLIDESHOW = [
  "/images/embroidered-black/emb_black_front.jpg",
  "/images/embroidered-white/emb_white_front.jpg",
  "/images/classic-front-black/classic_black_front.jpg",
  "/images/classic-front-white/classic_white_front.jpg",
  "/images/embroidered-black/emb_black_back.jpg",
  "/images/embroidered-white/emb_white_back.jpg",
  "/images/classic-front-black/classic_black_back.jpg",
  "/images/classic-front-white/classic_white_back.jpg",
];

export const CAMPAIGN_VIDEO = {
  driveId: "",
  driveUrl: "",
  embedUrl: "",
  streamUrl: "/videos/campaign.mp4",
  fallbackLocalUrl: "",
};

import { formatPriceWithCurrency } from "./currency";

export const zar = (n, currencyCode) => {
  if (currencyCode) {
    return formatPriceWithCurrency(n, currencyCode);
  }
  try {
    const savedCurrency = typeof window !== "undefined" ? localStorage.getItem("fortified_currency_code") : null;
    if (savedCurrency) {
      return formatPriceWithCurrency(n, savedCurrency);
    }
  } catch (e) {
    // fallback
  }
  return `R ${Number(n || 0).toLocaleString("en-ZA")}`;
};

export const getProductDefaultColour = (product) => {
  const name = product?.name || "";
  const namedColour = name.match(/\b(black|white)\b/i)?.[1];
  if (namedColour) {
    return namedColour.charAt(0).toUpperCase() + namedColour.slice(1).toLowerCase();
  }
  return product?.colors?.[0] || "Black";
};

export const getProductColourName = (product, colour) => {
  const name = product?.name || "";
  if (!product?.colorImages?.[colour]) return name;

  if (/\b(black|white)\b/i.test(name)) {
    return name.replace(/\b(black|white)\b/i, colour.toUpperCase());
  }

  return `${name} ${colour.toUpperCase()}`;
};

export const getProductColourDescription = (product, colour) => {
  const description = product?.description || product?.tagline || "";
  if (!product?.colorImages?.[colour]) return description;

  if (/Introducing the FORTIFIED Embroidered Tee in (Black|White)/i.test(description)) {
    if (colour === "Black") {
      return description
        .replace(/FORTIFIED Embroidered Tee in White/gi, "FORTIFIED Embroidered Tee in Black")
        .replace(/White colourway/gi, "Black colourway");
    } else if (colour === "White") {
      return description
        .replace(/FORTIFIED Embroidered Tee in Black/gi, "FORTIFIED Embroidered Tee in White")
        .replace(/Black colourway/gi, "White colourway");
    }
    return description;
  }

  if (/Introducing the FORTIFIED Classic Tee in (White|Black)/i.test(description)) {
    if (colour === "Black") {
      return description
        .replace(/FORTIFIED Classic Tee in White/gi, "FORTIFIED Classic Tee in Black")
        .replace(/chest print in black/gi, "chest print in white")
        .replace(/White colourway/gi, "Black colourway")
        .replace(/signature black FORTIFIED/gi, "signature white FORTIFIED");
    } else if (colour === "White") {
      return description
        .replace(/FORTIFIED Classic Tee in Black/gi, "FORTIFIED Classic Tee in White")
        .replace(/chest print in white/gi, "chest print in black")
        .replace(/Black colourway/gi, "White colourway")
        .replace(/signature white FORTIFIED/gi, "signature black FORTIFIED");
    }
    return description;
  }

  if (/Introducing the (Black|White) embroider/i.test(description)) {
    return description.replace(
      /Introducing the (Black|White) embroider/i,
      `Introducing the ${colour} embroider`,
    );
  }

  if (/Introducing the FORTIFIED Classic Tee written/i.test(description)) {
    return description.replace(
      /Introducing the FORTIFIED Classic Tee/i,
      `Introducing the ${colour} FORTIFIED Classic Tee`,
    );
  }

  return description;
};
