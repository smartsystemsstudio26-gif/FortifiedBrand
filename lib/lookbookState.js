import { IMG } from "@/lib/media";

export const DEFAULT_LOOKBOOK_SHOTS = [
  { id: "look1", img: IMG?.lookbook0 || "/images/classic-front-black/classic_black_front.jpg", title: "LOOK 01 — FORTIFIED STUDIO", subtitle: "Black Permanent Art Tee", span: "md:col-span-1", ratio: "aspect-[4/5]", position: "object-[58%_center]", type: "image" },
  { id: "look2", img: IMG?.lookbook2 || "/images/classic-front-white/classic_white_front.jpg", title: "LOOK 02 — CLASSIC WHITE", subtitle: "Front Print Presentation", span: "md:col-span-1", ratio: "aspect-[4/5]", position: "object-[72%_center]", type: "image" },
  { id: "look3", img: IMG?.lookbook1 || "/images/embroidered-black/emb_black_back.jpg", title: "LOOK 03 — PERMANENT ART", subtitle: "Signature Back Print", span: "md:col-span-1", ratio: "aspect-[4/5]", position: "object-center", type: "image" },
  { id: "look4", img: IMG?.lookbook0 || "/images/embroidered-white/emb_white_front.jpg", title: "LOOK 04 — QUIET STRENGTH", subtitle: "Embroidered Chest Detail", span: "md:col-span-1", ratio: "aspect-[4/5]", position: "object-[70%_center]", type: "image" },
  { id: "look5", img: IMG?.lookbook1 || "/images/classic-front-black/classic_black_back.jpg", title: "LOOK 05 — THE FULL ARCHIVE", subtitle: "Fortified Permanent Art", span: "md:col-span-2", ratio: "aspect-[16/9]", position: "object-center", type: "image" },
  { id: "look6", img: IMG?.lookbook2 || "/images/classic-front-white/classic_white_back.jpg", title: "LOOK 06 — WHITE STUDY", subtitle: "Premium Cotton Collection", span: "md:col-span-1", ratio: "aspect-[4/5]", position: "object-[66%_center]", type: "image" },
];

export const SS26_STREETWEAR_PACK = [
  { id: "look1", img: IMG?.lookbook0 || "/images/classic-front-black/classic_black_front.jpg", title: "LOOK 01 — MONOLITH BLACK", subtitle: "Heavyweight 280GSM Tee", span: "md:col-span-1", ratio: "aspect-[4/5]", position: "object-[58%_center]", type: "image" },
  { id: "look2", img: IMG?.lookbook2 || "/images/classic-front-white/classic_white_front.jpg", title: "LOOK 02 — ARCHITECTURAL WHITE", subtitle: "Drop Shoulder Fit", span: "md:col-span-1", ratio: "aspect-[4/5]", position: "object-[72%_center]", type: "image" },
  { id: "look3", img: IMG?.lookbook1 || "/images/embroidered-black/emb_black_back.jpg", title: "LOOK 03 — EMBROIDERED BACK", subtitle: "Minimal Branding", span: "md:col-span-1", ratio: "aspect-[4/5]", position: "object-center", type: "image" },
  { id: "look4", img: IMG?.heroVideoUrl || "/videos/hero-background.mp4", videoUrl: "/videos/hero-background.mp4", title: "LOOK 04 — MOTION CINEMATIC", subtitle: "SS26 Studio In Action", span: "md:col-span-2", ratio: "aspect-[16/9]", position: "object-center", type: "video" },
  { id: "look5", img: IMG?.lookbook0 || "/images/embroidered-white/emb_white_front.jpg", title: "LOOK 05 — QUIET STRENGTH", subtitle: "Raw Concrete Framing", span: "md:col-span-1", ratio: "aspect-[4/5]", position: "object-[70%_center]", type: "image" },
  { id: "look6", img: IMG?.lookbook2 || "/images/classic-front-white/classic_white_back.jpg", title: "LOOK 06 — WHITE STUDY", subtitle: "Permanent Collection", span: "md:col-span-1", ratio: "aspect-[4/5]", position: "object-[66%_center]", type: "image" },
];

export function getStoredLookbookShots() {
  if (typeof window === "undefined") return DEFAULT_LOOKBOOK_SHOTS;
  try {
    const stored = localStorage.getItem("fortified_lookbook_shots");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed to parse stored lookbook shots", e);
  }
  return DEFAULT_LOOKBOOK_SHOTS;
}

export function saveLookbookShots(shots) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("fortified_lookbook_shots", JSON.stringify(shots));
    window.dispatchEvent(new Event("fortified_lookbook_updated"));
    window.dispatchEvent(new Event("storage"));
  } catch (e) {
    console.error("Failed to save lookbook shots", e);
  }
}

export const DEFAULT_CAPSULE_DROPS = [
  {
    id: "drop1",
    name: "MONOLITH CAPSULE '26",
    status: "ACTIVE DROP",
    launchDate: "2026-08-22T18:00:00",
    units: 450,
    limitText: "LIMITED RUN — 30 PIECES",
    priceRange: "R 750 - R 1,200",
    bgUrl: "/images/drop/drop-bg.png"
  },
  {
    id: "drop2",
    name: "ARCHITECTURAL EMBROIDERY VOL. 3",
    status: "ACTIVE DROP",
    launchDate: "2026-09-15T12:00:00",
    units: 320,
    limitText: "LIMITED ALLOCATION",
    priceRange: "R 850 - R 1,400",
    bgUrl: ""
  },
  {
    id: "drop3",
    name: "BLACK & WHITE ESSENTIALS",
    status: "CORE LINE",
    launchDate: "Continuous",
    units: 650,
    limitText: "PERMANENT COLLECTION",
    priceRange: "R 700 - R 950",
    bgUrl: ""
  }
];

export function getStoredCapsuleDrops() {
  if (typeof window === "undefined") return DEFAULT_CAPSULE_DROPS;
  try {
    const stored = localStorage.getItem("fortified_capsule_drops");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed to parse stored capsule drops", e);
  }
  return DEFAULT_CAPSULE_DROPS;
}

export function saveCapsuleDrops(drops) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("fortified_capsule_drops", JSON.stringify(drops));
    window.dispatchEvent(new Event("fortified_drops_updated"));
    window.dispatchEvent(new Event("storage"));
  } catch (e) {
    console.error("Failed to save capsule drops", e);
  }
}

