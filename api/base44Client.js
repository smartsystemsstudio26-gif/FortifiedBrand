import { IMG } from '@/lib/media';
import { db } from '../lib/firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

// Seed data for local storage
const SEED_PRODUCTS = [
  {
    id: "prod-9",
    name: "FORTIFIED EMBROIDERED TEE — BLACK",
    price: 1950,
    images: [
      "/images/embroidered-black/emb_black_front.jpg",
      "/images/embroidered-black/emb_black_back.jpg",
      "/images/embroidered-black/emb_black_detail_1.jpg",
      "/images/embroidered-black/emb_black_detail_2.jpg"
    ],
    colorImages: {
      "Black": [
        "/images/embroidered-black/emb_black_front.jpg",
        "/images/embroidered-black/emb_black_back.jpg",
        "/images/embroidered-black/emb_black_detail_1.jpg",
        "/images/embroidered-black/emb_black_detail_2.jpg"
      ],
      "White": [
        "/images/embroidered-white/emb_white_front.jpg",
        "/images/embroidered-white/emb_white_back.jpg",
        "/images/embroidered-white/emb_white_detail_front.jpg",
        "/images/embroidered-white/emb_white_detail_back.jpg"
      ]
    },
    description: "Embroidered. Elevated. FORTIFIED.\n\nIntroducing the FORTIFIED Embroidered Tee in Black, designed with a refined combination of embroidery and print for a distinctive FORTIFIED aesthetic.\n\nMade from 280 GSM heavyweight cotton, this tee delivers a substantial, structured feel with the relaxed oversized fit that defines the FORTIFIED silhouette.\n\nThe left chest features detailed FORTIFIED embroidery with our signature \"PERMANENT ART\" branding, while the back features a bold printed graphic that adds character without compromising the clean, minimal aesthetic.\n\nBuilt for those who appreciate quality, detail and timeless streetwear design, the FORTIFIED Embroidered Tee is made to stand out while remaining effortlessly wearable.\n\nPRODUCT DETAILS:\n\n• 280 GSM heavyweight cotton\n• Relaxed oversized fit\n• Black colourway\n• FORTIFIED embroidered chest branding\n• PERMANENT ART chest detail\n• Printed back graphic\n• Ribbed crewneck collar\n• Structured heavyweight feel\n• Premium construction\n• Designed for everyday wear\n\nPERMANENT ART. TIMELESS QUALITY.",
    collection: "New Arrivals",
    collections: ["New Arrivals", "Premium Cotton Collection", "Oversized Collection", "Best Sellers"],
    category: "Embroidered Tees",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "White"],
    colorStock: { "Black": 10, "White": 10 },
    stock: 20,
    featured: true,
    created_date: "2026-07-17T08:00:00Z"
  },
  {
    id: "prod-5",
    name: "FORTIFIED EMBROIDERED TEE — WHITE",
    price: 1950,
    images: [
      "/images/embroidered-white/emb_white_front.jpg",
      "/images/embroidered-white/emb_white_back.jpg",
      "/images/embroidered-white/emb_white_detail_front.jpg",
      "/images/embroidered-white/emb_white_detail_back.jpg"
    ],
    colorImages: {
      "White": [
        "/images/embroidered-white/emb_white_front.jpg",
        "/images/embroidered-white/emb_white_back.jpg",
        "/images/embroidered-white/emb_white_detail_front.jpg",
        "/images/embroidered-white/emb_white_detail_back.jpg"
      ],
      "Black": [
        "/images/embroidered-black/emb_black_front.jpg",
        "/images/embroidered-black/emb_black_back.jpg",
        "/images/embroidered-black/emb_black_detail_1.jpg",
        "/images/embroidered-black/emb_black_detail_2.jpg"
      ]
    },
    description: "Embroidered. Elevated. FORTIFIED.\n\nIntroducing the FORTIFIED Embroidered Tee in White, designed with a refined combination of embroidery and print for a distinctive FORTIFIED aesthetic.\n\nMade from 280 GSM heavyweight cotton, this tee delivers a substantial, structured feel with the relaxed oversized fit that defines the FORTIFIED silhouette.\n\nThe left chest features detailed FORTIFIED embroidery with our signature \"PERMANENT ART\" branding, while the back features a bold black printed graphic that creates a clean contrast against the white cotton.\n\nBuilt for those who appreciate quality, detail and timeless streetwear design, the FORTIFIED Embroidered Tee is made to stand out while remaining effortlessly wearable.\n\nPRODUCT DETAILS:\n\n• 280 GSM heavyweight cotton\n• Relaxed oversized fit\n• White colourway\n• FORTIFIED embroidered chest branding\n• PERMANENT ART chest detail\n• Black printed back graphic\n• Ribbed crewneck collar\n• Structured heavyweight feel\n• Premium construction\n• Designed for everyday wear\n\nPERMANENT ART. TIMELESS QUALITY.",
    collection: "New Arrivals",
    collections: ["New Arrivals", "Premium Cotton Collection", "Oversized Collection", "Best Sellers"],
    category: "Embroidered Tees",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "White"],
    colorStock: { "Black": 10, "White": 10 },
    stock: 20,
    featured: true,
    created_date: "2026-07-15T08:00:00Z"
  },
  {
    id: "prod-8",
    name: "FORTIFIED CLASSIC TEE — BLACK",
    price: 1550,
    images: [
      "/images/classic-front-black/classic_black_front.jpg",
      "/images/classic-front-black/classic_black_back.jpg",
      "/images/classic-front-black/classic_black_detail.jpg",
      "/images/classic-front-black/classic_black_detail_2.jpg"
    ],
    colorImages: {
      "Black": [
        "/images/classic-front-black/classic_black_front.jpg",
        "/images/classic-front-black/classic_black_back.jpg",
        "/images/classic-front-black/classic_black_detail.jpg",
        "/images/classic-front-black/classic_black_detail_2.jpg"
      ],
      "White": [
        "/images/classic-front-white/classic_white_front.jpg",
        "/images/classic-front-white/classic_white_back.jpg",
        "/images/classic-front-white/classic_white_detail.jpg",
        "/images/classic-front-white/classic_white_detail_2.jpg"
      ]
    },
    description: "Clean. Bold. FORTIFIED.\n\nIntroducing the FORTIFIED Classic Tee in Black, featuring our signature FORTIFIED chest print in white for a bold yet timeless look.\n\nMade from 280 GSM heavyweight cotton, this tee delivers a substantial, structured feel while remaining comfortable for everyday wear. The relaxed oversized fit creates the distinctive FORTIFIED silhouette, while the contrasting white chest print gives the design a clean and confident finish.\n\nBuilt for everyday wear and designed to become a wardrobe essential, the FORTIFIED Classic Tee combines heavyweight construction with a timeless streetwear aesthetic.\n\nPRODUCT DETAILS:\n\n• 280 GSM heavyweight cotton\n• Relaxed oversized fit\n• Black colourway\n• Signature white FORTIFIED chest print\n• Structured heavyweight feel\n• Premium construction\n• Designed for everyday wear\n\nPERMANENT ART. TIMELESS QUALITY.",
    collection: "New Arrivals",
    collections: ["New Arrivals", "Premium Cotton Collection", "Oversized Collection", "Best Sellers"],
    category: "Printed Tees",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "White"],
    colorStock: { "Black": 15, "White": 15 },
    stock: 30,
    featured: true,
    created_date: "2026-07-16T08:10:00Z"
  },
  {
    id: "prod-7",
    name: "FORTIFIED CLASSIC TEE — WHITE",
    price: 1550,
    images: [
      "/images/classic-front-white/classic_white_front.jpg",
      "/images/classic-front-white/classic_white_back.jpg",
      "/images/classic-front-white/classic_white_detail.jpg",
      "/images/classic-front-white/classic_white_detail_2.jpg"
    ],
    colorImages: {
      "White": [
        "/images/classic-front-white/classic_white_front.jpg",
        "/images/classic-front-white/classic_white_back.jpg",
        "/images/classic-front-white/classic_white_detail.jpg",
        "/images/classic-front-white/classic_white_detail_2.jpg"
      ],
      "Black": [
        "/images/classic-front-black/classic_black_front.jpg",
        "/images/classic-front-black/classic_black_back.jpg",
        "/images/classic-front-black/classic_black_detail.jpg",
        "/images/classic-front-black/classic_black_detail_2.jpg"
      ]
    },
    description: "Clean. Bold. FORTIFIED.\n\nIntroducing the FORTIFIED Classic Tee in White, featuring our signature FORTIFIED chest print in black for a clean and timeless look.\n\nMade from 280 GSM heavyweight cotton, this tee delivers a substantial, structured feel while remaining comfortable for everyday wear. The relaxed oversized fit creates the distinctive FORTIFIED silhouette, while the minimal front print keeps the design sharp and versatile.\n\nBuilt for everyday wear and designed to become a wardrobe essential, the FORTIFIED Classic Tee combines premium heavyweight construction with a timeless streetwear aesthetic.\n\nPRODUCT DETAILS:\n\n• 280 GSM heavyweight cotton\n• Relaxed oversized fit\n• White colourway\n• Signature black FORTIFIED chest print\n• Structured heavyweight feel\n• Premium construction\n• Designed for everyday wear\n\nPERMANENT ART. TIMELESS QUALITY.",
    collection: "New Arrivals",
    collections: ["New Arrivals", "Premium Cotton Collection", "Oversized Collection", "Best Sellers"],
    category: "Printed Tees",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "White"],
    colorStock: { "Black": 15, "White": 15 },
    stock: 30,
    featured: true,
    created_date: "2026-07-16T08:00:00Z"
  },
  {
    id: "prod-1",
    name: "MONOLITH HEAVYWEIGHT TEE",
    price: 750,
    images: [
      "/images/embroidered-black/emb_black_front.jpg",
      "/images/embroidered-black/emb_black_back.jpg",
      "/images/embroidered-black/emb_black_detail_1.jpg"
    ],
    description: "An absolute classic streetwear silhouette. Engineered with 280 GSM premium heavyweight cotton, featuring a meticulously tailored oversized fit.",
    collection: "New Arrivals",
    category: "T-Shirts",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "White"],
    colorStock: { "Black": 10, "White": 8 },
    stock: 18,
    featured: false,
    created_date: "2026-07-11T08:00:00Z"
  },
  {
    id: "prod-2",
    name: "TEMPLE COTTON BOX TEE",
    price: 800,
    images: [
      "/images/embroidered-white/emb_white_front.jpg",
      "/images/embroidered-white/emb_white_back.jpg",
      "/images/embroidered-white/emb_white_detail_front.jpg"
    ],
    description: "Constructed with structural drop shoulders and premium double-needle stitching for ultimate style and wear longevity.",
    collection: "Premium Cotton Collection",
    category: "T-Shirts",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "White"],
    colorStock: { "Black": 13, "White": 10 },
    stock: 23,
    featured: false,
    created_date: "2026-07-10T08:00:00Z"
  },
  {
    id: "prod-3",
    name: "ARCHIVE GRAPHIC TEE",
    price: 950,
    images: [
      "/images/classic-front-black/classic_black_front.jpg",
      "/images/classic-front-black/classic_black_back.jpg",
      "/images/classic-front-black/classic_black_detail.jpg"
    ],
    description: "A limited-edition art piece featuring silk-screen hand-printed high-contrast back graphics.",
    collection: "Limited Edition",
    category: "T-Shirts",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "White"],
    colorStock: { "Black": 10, "White": 10 },
    stock: 20,
    featured: false,
    created_date: "2026-07-09T08:00:00Z"
  },
  {
    id: "prod-10",
    name: "MONOLITH ARCHIVAL OVERSIZED HOODIE",
    price: 2350,
    images: [
      "/images/classic-front-black/classic_black_front.jpg",
      "/images/classic-front-black/classic_black_back.jpg"
    ],
    description: "Archival heavyweight 450 GSM fleece hoodie with structural drop shoulders and deep double-layered hood.",
    collection: "New Arrivals",
    collections: ["New Arrivals", "Best Sellers", "Limited Edition", "Oversized Collection", "Premium Cotton Collection", "Core Collection"],
    category: "Hoodies",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "White", "Sand", "Slate"],
    colorStock: { "Black": 0, "White": 0, "Sand": 0, "Slate": 0 },
    stock: 0,
    featured: true,
    hidden: true,
    created_date: "2026-07-20T08:00:00Z"
  },
  {
    id: "prod-11",
    name: "FORTIFIED HEAVYWEIGHT FLEECE HOODIE",
    price: 2200,
    images: [
      "/images/classic-front-white/classic_white_front.jpg",
      "/images/classic-front-white/classic_white_back.jpg"
    ],
    description: "Heavyweight fleece hoodie built for cold weather structural layering with rib-knit cuffs and hem.",
    collection: "New Arrivals",
    collections: ["New Arrivals", "Best Sellers", "Limited Edition", "Oversized Collection", "Premium Cotton Collection", "Core Collection"],
    category: "Hoodies",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Grey", "Navy", "Olive"],
    colorStock: { "Black": 0, "Grey": 0, "Navy": 0, "Olive": 0 },
    stock: 0,
    featured: true,
    hidden: true,
    created_date: "2026-07-19T08:00:00Z"
  },
  {
    id: "prod-12",
    name: "FORTIFIED HEAVYWEIGHT COTTON SWEATPANTS",
    price: 1650,
    images: [
      "/images/embroidered-black/emb_black_front.jpg"
    ],
    description: "Relaxed tailored heavyweight cotton sweatpants with elasticated cuffs and custom hardware.",
    collection: "New Arrivals",
    collections: ["New Arrivals", "Best Sellers", "Limited Edition", "Core Collection", "Premium Cotton Collection"],
    category: "Sweatpants",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Grey", "Sand", "Olive"],
    colorStock: { "Black": 0, "Grey": 0, "Sand": 0, "Olive": 0 },
    stock: 0,
    featured: false,
    hidden: true,
    created_date: "2026-07-18T08:00:00Z"
  },
  {
    id: "prod-13",
    name: "ATELIER TAPERED FLEECE JOGGERS",
    price: 1580,
    images: [
      "/images/embroidered-white/emb_white_front.jpg"
    ],
    description: "Tapered fleece joggers engineered with reinforced knee panels and deep zip pockets.",
    collection: "New Arrivals",
    collections: ["New Arrivals", "Best Sellers", "Limited Edition", "Core Collection"],
    category: "Sweatpants",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Grey", "Navy", "Charcoal"],
    colorStock: { "Black": 0, "Grey": 0, "Navy": 0, "Charcoal": 0 },
    stock: 0,
    featured: false,
    hidden: true,
    created_date: "2026-07-17T08:00:00Z"
  },
  {
    id: "prod-14",
    name: "FORTIFIED EMBROIDERED POLO SHIRT",
    price: 1250,
    images: [
      "/images/classic-front-black/classic_black_front.jpg"
    ],
    description: "Structured piqué cotton polo shirt featuring signature chest embroidery.",
    collection: "New Arrivals",
    collections: ["New Arrivals", "Best Sellers", "Limited Edition", "Core Collection"],
    category: "Golf / Polo Shirts",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "White", "Navy", "Sand"],
    colorStock: { "Black": 0, "White": 0, "Navy": 0, "Sand": 0 },
    stock: 0,
    featured: false,
    hidden: true,
    created_date: "2026-07-16T08:00:00Z"
  },
  {
    id: "prod-15",
    name: "ATELIER PIQUÉ GOLF SHIRT",
    price: 1200,
    images: [
      "/images/classic-front-white/classic_white_front.jpg"
    ],
    description: "Premium breathable piqué golf shirt with ribbed collar and minimal branding.",
    collection: "New Arrivals",
    collections: ["New Arrivals", "Best Sellers", "Limited Edition", "Core Collection"],
    category: "Golf / Polo Shirts",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "White", "Olive", "Grey"],
    colorStock: { "Black": 0, "White": 0, "Olive": 0, "Grey": 0 },
    stock: 0,
    featured: false,
    hidden: true,
    created_date: "2026-07-15T08:00:00Z"
  },
  {
    id: "prod-16",
    name: "FORTIFIED ATELIER STRUCTURED TRUCKER CAP",
    price: 650,
    images: [
      "/images/classic-front-white/classic_white_front.jpg"
    ],
    description: "High-density structured trucker cap with foam front panel and breathable mesh.",
    collection: "New Arrivals",
    collections: ["New Arrivals", "Best Sellers", "Limited Edition", "Core Collection"],
    category: "Caps",
    sizes: ["One Size"],
    colors: ["Black", "White", "Navy", "Olive"],
    colorStock: { "Black": 0, "White": 0, "Navy": 0, "Olive": 0 },
    stock: 0,
    featured: false,
    hidden: true,
    created_date: "2026-07-14T08:00:00Z"
  },
  {
    id: "prod-17",
    name: "MONOLITH ARCHITECTURAL CAP",
    price: 680,
    images: [
      "/images/classic-front-black/classic_black_front.jpg"
    ],
    description: "Unstructured low-profile cotton dad cap with metal clasp closure.",
    collection: "New Arrivals",
    collections: ["New Arrivals", "Best Sellers", "Limited Edition", "Core Collection"],
    category: "Caps",
    sizes: ["One Size"],
    colors: ["Black", "White", "Sand", "Grey"],
    colorStock: { "Black": 0, "White": 0, "Sand": 0, "Grey": 0 },
    stock: 0,
    featured: false,
    hidden: true,
    created_date: "2026-07-13T08:00:00Z"
  }
];

const getImageListForProduct = (p) => {
  return p.images && p.images.length > 0 ? p.images : [];
};

const getSeedForId = (id) => SEED_PRODUCTS.find(s => s.id === id);

let MOCK_PRODUCTS = [];
try {
  const stored = localStorage.getItem("fortified_products");
  if (stored) {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length > 0) {
      MOCK_PRODUCTS = parsed;
    } else {
      MOCK_PRODUCTS = [...SEED_PRODUCTS];
    }
  } else {
    MOCK_PRODUCTS = [...SEED_PRODUCTS];
    localStorage.setItem("fortified_products", JSON.stringify(MOCK_PRODUCTS));
  }
} catch (e) {
  MOCK_PRODUCTS = [...SEED_PRODUCTS];
}

const saveProductsToStorage = (products) => {
  try {
    localStorage.setItem("fortified_products", JSON.stringify(products));
    MOCK_PRODUCTS = products;
    window.dispatchEvent(new Event("fortified_products_updated"));
    window.dispatchEvent(new Event("storage"));

    // Sync to Firestore asynchronously
    try {
      const catalogRef = doc(db, "products", "catalog");
      setDoc(catalogRef, { items: products, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
    } catch (e) {
      console.warn("Firestore products sync error:", e);
    }
  } catch (e) {
    console.error("Failed to save products to localStorage", e);
  }
};

// Listen to live Firestore product updates
try {
  const catalogRef = doc(db, "products", "catalog");
  onSnapshot(catalogRef, (snap) => {
    if (snap.exists()) {
      const data = snap.data();
      if (data && Array.isArray(data.items) && data.items.length > 0) {
        MOCK_PRODUCTS = data.items;
        localStorage.setItem("fortified_products", JSON.stringify(data.items));
        window.dispatchEvent(new Event("fortified_products_updated"));
      }
    }
  }, (err) => {
    console.warn("Firestore product snapshot error:", err);
  });
} catch (e) {
  console.warn("Firestore products subscription init error:", e);
}

const MOCK_REVIEWS = [
  {
    id: "rev-1",
    product_id: "prod-1",
    author: "Zola M.",
    rating: 5,
    title: "Incredible Heavyweight Feel",
    body: "Incredible quality. The 280 GSM feel is thick and luxurious, holding its shape perfectly after washing.",
    created_date: "2026-07-12T10:00:00Z"
  },
  {
    id: "rev-2",
    product_id: "prod-1",
    author: "Liam K.",
    rating: 5,
    title: "Perfect Oversized Fit",
    body: "The perfect oversized fit. Hard to find tees with this drape.",
    created_date: "2026-07-13T12:00:00Z"
  },
  {
    id: "rev-3",
    product_id: "prod-2",
    author: "Naledi S.",
    rating: 5,
    title: "Superb drape and structure",
    body: "The drop shoulders look very modern and the double-needle stitching makes it feel indestructible. Absolutely buying more colors.",
    created_date: "2026-07-14T09:15:00Z"
  },
  {
    id: "rev-4",
    product_id: "prod-3",
    author: "Thabo M.",
    rating: 5,
    title: "Incredible Silk-Screen Print",
    body: "This is truly a wearable art piece. The high-contrast back graphics are thick and sharp. Amazing limited-edition drop.",
    created_date: "2026-07-15T14:30:00Z"
  },
  {
    id: "rev-5",
    product_id: "prod-5",
    author: "Jessica D.",
    rating: 5,
    title: "Masterpiece Embroidery",
    body: "Meticulous chain-stitch details. The contrast of the black embroidery on the heavy white tee is gorgeous. Highly recommended!",
    created_date: "2026-07-16T11:00:00Z"
  },
  {
    id: "rev-6",
    product_id: "prod-8",
    author: "Sipho N.",
    rating: 4,
    title: "Stunning Print Quality",
    body: "Bold print that doesn't fade. The fit is beautifully boxy. Only wish the collar was slightly softer, but it holds its shape extremely well.",
    created_date: "2026-07-18T16:45:00Z"
  },
  {
    id: "rev-7",
    product_id: "prod-9",
    author: "Marcus T.",
    rating: 5,
    title: "Elite Streetwear Standard",
    body: "The 280 GSM cotton feels heavy and structured, and the chest embroidery is extremely precise. Best black tee in my collection.",
    created_date: "2026-07-19T09:00:00Z"
  }
];

const SEED_ORDERS = [
  {
    id: "ord-1006",
    order_number: "FTD-982104",
    created_date: "2026-07-28T14:20:00Z",
    customer_name: "Zola Dlamini",
    customer_email: "zola.dlamini@mweb.co.za",
    customer_phone: "+27 82 456 7890",
    country: "South Africa",
    country_code: "ZA",
    country_flag: "🇿🇦",
    shipping_address: "14 Rosebank Road, Sandton, Johannesburg, 2196, 🇿🇦 South Africa",
    payment_method: "Card",
    payment_status: "Paid",
    subtotal: 1950,
    total: 1950,
    currency: "ZAR",
    status: "Delivered",
    tracking_number: "RAM-ZA-882194",
    items: [
      { product_id: "prod-9", name: "FORTIFIED EMBROIDERED TEE — BLACK", size: "L", colour: "Black", quantity: 1, price: 1950, image: "/images/embroidered-black/emb_black_front.jpg" }
    ]
  },
  {
    id: "ord-1005",
    order_number: "FTD-982103",
    created_date: "2026-07-27T09:15:00Z",
    customer_name: "Marcus Thorne",
    customer_email: "marcus.t@gmail.com",
    customer_phone: "+27 71 892 1102",
    country: "South Africa",
    country_code: "ZA",
    country_flag: "🇿🇦",
    shipping_address: "88 Kloof Street, Gardens, Cape Town, 8001, 🇿🇦 South Africa",
    payment_method: "PayPal",
    payment_status: "Paid",
    subtotal: 2300,
    total: 2300,
    currency: "ZAR",
    status: "Shipped",
    tracking_number: "DHL-EX-99104",
    items: [
      { product_id: "prod-7", name: "FORTIFIED CLASSIC TEE — WHITE", size: "XL", colour: "White", quantity: 1, price: 1550, image: "/images/classic-front-white/classic_white_front.jpg" },
      { product_id: "prod-1", name: "MONOLITH HEAVYWEIGHT TEE", size: "M", colour: "Black", quantity: 1, price: 750, image: "/images/embroidered-black/emb_black_front.jpg" }
    ]
  },
  {
    id: "ord-1004",
    order_number: "FTD-982102",
    created_date: "2026-07-26T18:45:00Z",
    customer_name: "Jessica Daniels",
    customer_email: "jessica.daniels@yahoo.com",
    customer_phone: "+27 83 123 9988",
    country: "South Africa",
    country_code: "ZA",
    country_flag: "🇿🇦",
    shipping_address: "42 Florida Road, Morningside, Durban, 4001, 🇿🇦 South Africa",
    payment_method: "Card",
    payment_status: "Paid",
    subtotal: 3900,
    total: 3900,
    currency: "ZAR",
    status: "Processing",
    tracking_number: "RAM-ZA-449102",
    items: [
      { product_id: "prod-5", name: "FORTIFIED EMBROIDERED TEE — WHITE", size: "M", colour: "White", quantity: 2, price: 1950, image: "/images/embroidered-white/emb_white_front.jpg" }
    ]
  },
  {
    id: "ord-1003",
    order_number: "FTD-982101",
    created_date: "2026-07-25T11:05:00Z",
    customer_name: "Sipho Ndlovu",
    customer_email: "sipho.ndlovu@gmail.com",
    customer_phone: "+27 76 554 1212",
    country: "South Africa",
    country_code: "ZA",
    country_flag: "🇿🇦",
    shipping_address: "105 Lynnwood Rd, Brooklyn, Pretoria, 0181, 🇿🇦 South Africa",
    payment_method: "Ozow",
    payment_status: "Paid",
    subtotal: 950,
    total: 950,
    currency: "ZAR",
    status: "Delivered",
    tracking_number: "RAM-ZA-118204",
    items: [
      { product_id: "prod-3", name: "ARCHIVE GRAPHIC TEE", size: "L", colour: "Black", quantity: 1, price: 950, image: "/images/classic-front-black/classic_black_front.jpg" }
    ]
  },
  {
    id: "ord-1002",
    order_number: "FTD-982100",
    created_date: "2026-07-24T16:30:00Z",
    customer_name: "Alex Vance",
    customer_email: "alex.vance@uk-design.co.uk",
    customer_phone: "+44 7700 900077",
    country: "United Kingdom",
    country_code: "GB",
    country_flag: "🇬🇧",
    shipping_address: "12 Regent Street, Soho, London, W1B 5RL, 🇬🇧 United Kingdom",
    payment_method: "Stripe",
    payment_status: "Paid",
    subtotal: 3900,
    total: 3900,
    currency: "ZAR",
    status: "Pending",
    tracking_number: "DHL-UK-88491",
    items: [
      { product_id: "prod-9", name: "FORTIFIED EMBROIDERED TEE — BLACK", size: "XL", colour: "Black", quantity: 2, price: 1950, image: "/images/embroidered-black/emb_black_front.jpg" }
    ]
  },
  {
    id: "ord-1001",
    order_number: "FTD-982099",
    created_date: "2026-07-22T08:10:00Z",
    customer_name: "Naledi Soto",
    customer_email: "naledi@soto.co.za",
    customer_phone: "+27 82 991 0022",
    country: "South Africa",
    country_code: "ZA",
    country_flag: "🇿🇦",
    shipping_address: "55 West Street, Sandton, Johannesburg, 2196, 🇿🇦 South Africa",
    payment_method: "Apple Pay",
    payment_status: "Paid",
    subtotal: 800,
    total: 800,
    currency: "ZAR",
    status: "Delivered",
    tracking_number: "RAM-ZA-773019",
    items: [
      { product_id: "prod-2", name: "TEMPLE COTTON BOX TEE", size: "S", colour: "White", quantity: 1, price: 800, image: "/images/classic-front-white/classic_white_front.jpg" }
    ]
  }
];

let MOCK_ORDERS = [];
try {
  const storedOrders = localStorage.getItem("fortified_orders");
  if (storedOrders) {
    MOCK_ORDERS = JSON.parse(storedOrders);
  } else {
    MOCK_ORDERS = SEED_ORDERS;
    localStorage.setItem("fortified_orders", JSON.stringify(MOCK_ORDERS));
  }
} catch (e) {
  MOCK_ORDERS = SEED_ORDERS;
}

const saveOrdersToStorage = (orders) => {
  try {
    localStorage.setItem("fortified_orders", JSON.stringify(orders));
  } catch (e) {
    console.error("Failed to save orders to localStorage", e);
  }
};

const DEFAULT_FALLBACK_IMAGES = [
  "/images/embroidered-black/emb_black_front.jpg",
  "/images/embroidered-white/emb_white_front.jpg",
  "/images/classic-front-black/classic_black_front.jpg",
  "/images/classic-front-white/classic_white_front.jpg"
];

// Helper to sanitize product data
const sanitizeProduct = (p) => {
  if (!p) return p;
  const product = { ...p };

  // Keep only valid non-empty image URLs, replacing stale/invalid non-existent paths
  product.images = (product.images || [])
    .filter(img => typeof img === 'string' && img.trim().length > 0)
    .map(img => {
      if (img.includes("/images/products/")) {
        return DEFAULT_FALLBACK_IMAGES[0];
      }
      return img;
    });

  if (product.images.length === 0) {
    product.images = [DEFAULT_FALLBACK_IMAGES[Math.floor(Math.random() * DEFAULT_FALLBACK_IMAGES.length)]];
  }

  // Preserve sizes or default to standard range
  if (!product.sizes || product.sizes.length === 0) {
    product.sizes = ["XS", "S", "M", "L", "XL"];
  }

  // Preserve colors or default
  if (!product.colors || product.colors.length === 0) {
    product.colors = ["Black", "White"];
  }

  // Sync colorStock and stock
  if (product.colorStock) {
    let sum = 0;
    Object.values(product.colorStock).forEach(v => { sum += (Number(v) || 0); });
    product.stock = sum || product.stock || 20;
  } else {
    product.stock = Number(product.stock) || 20;
  }

  return product;
};

// Pure local async execution without external network dependencies
const execLocal = async (fn) => {
  const res = fn();
  return Array.isArray(res) ? res.map(sanitizeProduct) : sanitizeProduct(res);
};

export const base44 = {
  get asServiceRole() {
    return new Proxy({}, {
      get() {
        return {};
      }
    });
  },
  entities: {
    Product: {
      list: (order, limit, includeHidden = false) => execLocal(() => {
        let sorted = MOCK_PRODUCTS.filter(p => includeHidden || !p.hidden);
        if (order === "-created_date") {
          sorted.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
        } else if (order === "created_date") {
          sorted.sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
        }
        if (limit) {
          sorted = sorted.slice(0, limit);
        }
        return sorted;
      }),
      get: (id) => execLocal(() => {
        return MOCK_PRODUCTS.find(p => p.id === id) || MOCK_PRODUCTS[0];
      }),
      filter: (query, order, includeHidden = false) => execLocal(() => {
        let filtered = MOCK_PRODUCTS.filter(p => includeHidden || !p.hidden);
        if (query?.category) {
          const cat = query.category.toLowerCase();
          filtered = filtered.filter(p => {
            const pCat = p.category ? p.category.toLowerCase() : "";
            const name = p.name ? p.name.toLowerCase() : "";

            if (cat.includes("hoodie") || pCat.includes("hoodie")) {
              return pCat.includes("hoodie") || name.includes("hoodie");
            }
            if (cat.includes("sweatpant") || cat.includes("jogger") || pCat.includes("sweatpant")) {
              return pCat.includes("sweatpant") || name.includes("sweatpant") || name.includes("jogger");
            }
            if (cat.includes("polo") || cat.includes("golf") || pCat.includes("polo") || pCat.includes("golf")) {
              return pCat.includes("polo") || pCat.includes("golf") || name.includes("polo") || name.includes("golf");
            }
            if (cat.includes("cap") || cat.includes("headwear") || pCat.includes("cap")) {
              return pCat.includes("cap") || name.includes("cap") || name.includes("hat");
            }
            if (cat.includes("embroidered")) {
              return pCat.includes("embroidered") || name.includes("embroidered");
            }
            if (cat.includes("printed")) {
              return pCat.includes("printed") || name.includes("printed");
            }
            if (cat === "t-shirts" || cat === "tees") {
              return pCat === "t-shirts" || pCat.includes("embroidered") || pCat.includes("printed") || name.includes("tee");
            }
            return pCat === cat || pCat.includes(cat) || cat.includes(pCat);
          });
        }
        if (query?.collection) {
          const queryCol = query.collection.toLowerCase();
          filtered = filtered.filter(p => {
            if (Array.isArray(p.collections)) {
              return p.collections.some(c => c.toLowerCase() === queryCol);
            }
            if (Array.isArray(p.collection)) {
              return p.collection.some(c => c.toLowerCase() === queryCol);
            }
            return p.collection?.toLowerCase() === queryCol;
          });
        }
        if (order === "-created_date") {
          filtered.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
        } else if (order === "created_date") {
          filtered.sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
        }
        return filtered;
      }),
      create: (data) => execLocal(() => {
        const newProd = {
          id: data.id || `prod-${Date.now()}`,
          name: data.name,
          price: Number(data.price) || 0,
          images: data.images || [],
          description: data.description || "",
          collection: data.collection || "New Arrivals",
          category: data.category || "T-Shirts",
          sizes: data.sizes || ["S", "M", "L", "XL"],
          colors: data.colors || ["Black"],
          colorStock: data.colorStock || { "Black": 10 },
          stock: Number(data.stock) || 10,
          featured: !!data.featured,
          created_date: new Date().toISOString()
        };
        MOCK_PRODUCTS.push(newProd);
        saveProductsToStorage(MOCK_PRODUCTS);
        return newProd;
      }),
      update: (id, data) => execLocal(() => {
        const idx = MOCK_PRODUCTS.findIndex(p => p.id === id);
        if (idx !== -1) {
          MOCK_PRODUCTS[idx] = { ...MOCK_PRODUCTS[idx], ...data };
          saveProductsToStorage(MOCK_PRODUCTS);
          return MOCK_PRODUCTS[idx];
        }
        return MOCK_PRODUCTS[0];
      }),
      delete: (id) => execLocal(() => {
        MOCK_PRODUCTS = MOCK_PRODUCTS.filter(p => p.id !== id);
        saveProductsToStorage(MOCK_PRODUCTS);
        return { id, success: true };
      })
    },
    Review: {
      filter: (query) => Promise.resolve(MOCK_REVIEWS.filter(r => r.product_id === query?.product_id)),
      create: (data) => Promise.resolve(() => {
        const newReview = { ...data, id: `rev-${Date.now()}`, created_date: new Date().toISOString() };
        MOCK_REVIEWS.push(newReview);
        return newReview;
      })()
    },
    Order: {
      list: (order, limit) => Promise.resolve((() => {
        let sorted = [...MOCK_ORDERS];
        if (order === "-created_date") {
          sorted.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
        } else if (order === "created_date") {
          sorted.sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
        }
        if (limit) sorted = sorted.slice(0, limit);
        return sorted;
      })()),
      get: (id) => Promise.resolve(MOCK_ORDERS.find(o => o.id === id || o.order_number === id) || MOCK_ORDERS[0]),
      filter: (query) => Promise.resolve((() => {
        let filtered = [...MOCK_ORDERS];
        if (query?.status) {
          filtered = filtered.filter(o => o.status?.toLowerCase() === query.status.toLowerCase());
        }
        return filtered;
      })()),
      create: (data) => Promise.resolve((() => {
        const newOrd = {
          id: `ord-${Date.now()}`,
          order_number: data.order_number || `FTD-${Date.now().toString().slice(-6)}`,
          created_date: new Date().toISOString(),
          payment_status: "Paid",
          ...data
        };
        MOCK_ORDERS.unshift(newOrd);
        saveOrdersToStorage(MOCK_ORDERS);

        // Deduct inventory automatically on order creation
        if (Array.isArray(newOrd.items)) {
          newOrd.items.forEach(item => {
            const p = MOCK_PRODUCTS.find(prod => prod.id === item.product_id || prod.name === item.name);
            if (p) {
              const qty = Number(item.quantity) || 1;
              p.stock = Math.max(0, (p.stock || 0) - qty);
              if (p.colorStock && item.colour && p.colorStock[item.colour] !== undefined) {
                p.colorStock[item.colour] = Math.max(0, p.colorStock[item.colour] - qty);
              }
            }
          });
          saveProductsToStorage(MOCK_PRODUCTS);
        }

        return newOrd;
      })()),
      update: (id, data) => Promise.resolve((() => {
        const idx = MOCK_ORDERS.findIndex(o => o.id === id || o.order_number === id);
        if (idx !== -1) {
          MOCK_ORDERS[idx] = { ...MOCK_ORDERS[idx], ...data };
          saveOrdersToStorage(MOCK_ORDERS);
          return MOCK_ORDERS[idx];
        }
        return null;
      })()),
      delete: (id) => Promise.resolve((() => {
        MOCK_ORDERS = MOCK_ORDERS.filter(o => o.id !== id && o.order_number !== id);
        saveOrdersToStorage(MOCK_ORDERS);
        return { success: true };
      })())
    }
  },
  auth: {
    me: async () => {
      const stored = localStorage.getItem("fortified_user");
      return stored ? JSON.parse(stored) : null;
    },
    loginViaEmailPassword: async (email) => {
      const mockUser = { email, id: "usr-1", name: email.split("@")[0] };
      localStorage.setItem("fortified_user", JSON.stringify(mockUser));
      return { user: mockUser };
    },
    register: async (data) => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem("fortified_otp_" + data.email, code);
      try {
        await base44.integrations.Core.SendEmail({
          to: data.email,
          subject: "FORTIFIED - Verification Code",
          body: `Your verification code is: ${code}`,
          type: "Verification"
        });
      } catch (e) {
        console.warn("Could not log email dispatch:", e);
      }
      return { email: data.email, status: "pending_verification", code };
    },
    verifyOtp: async (data) => {
      if (data.otpCode && data.otpCode.length === 6) {
        const mockUser = { email: data.email, id: "usr-" + Date.now(), name: data.email?.split("@")[0] || "User" };
        localStorage.setItem("fortified_user", JSON.stringify(mockUser));
        return { access_token: "mock-access-token", user: mockUser };
      }
      throw new Error("Please enter a valid 6-digit verification code");
    },
    resendOtp: async (email) => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem("fortified_otp_" + email, code);
      try {
        await base44.integrations.Core.SendEmail({
          to: email,
          subject: "FORTIFIED - New Verification Code",
          body: `Your new verification code is: ${code}`,
          type: "Verification"
        });
      } catch (e) {
        console.warn("Could not log email dispatch:", e);
      }
      return { success: true, code };
    },
    resetPasswordRequest: async () => {
      return { success: true };
    },
    resetPassword: async () => {
      return { success: true };
    },
    loginWithProvider: (provider, redirectUrl) => {
      const mockUser = { email: "user@fortified.com", id: "usr-google", name: "Fortified Member" };
      localStorage.setItem("fortified_user", JSON.stringify(mockUser));
      if (redirectUrl) window.location.href = redirectUrl;
    },
    logout: () => {
      localStorage.removeItem("fortified_user");
      window.location.reload();
    },
    redirectToLogin: () => {
      window.location.href = "/login";
    },
    setToken: () => {}
  },
  integrations: {
    Core: {
      SendEmail: async (params) => {
        console.log("Mock email sent:", params);
        try {
          const storedEmails = JSON.parse(localStorage.getItem("fortified_sent_emails") || "[]");
          storedEmails.unshift({
            id: `email-${Date.now()}`,
            timestamp: new Date().toISOString(),
            to: params.to || params.recipient || "customer@fortified.co.za",
            subject: params.subject || "FORTIFIED Notification",
            body: params.body || params.message || params.content || "",
            status: "Delivered",
            type: params.type || "Dispatch Notice"
          });
          localStorage.setItem("fortified_sent_emails", JSON.stringify(storedEmails.slice(0, 50)));
        } catch (e) {
          console.error("Failed to log email history", e);
        }
        return { success: true, messageId: `msg-${Date.now()}` };
      }
    }
  }
};
