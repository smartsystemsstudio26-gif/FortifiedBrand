import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Heart, Bookmark, ChevronDown, ChevronUp, ShoppingBag, Plus, Minus, ArrowRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { IMG, zar } from "@/lib/media";
import { useCart } from "@/lib/CartContext";
import { useWishlist } from "@/lib/WishlistContext";
import { useAuth } from "@/lib/use-auth";
import SpinningLogo from "@/components/SpinningLogo";
import { FORTIFIED_SOCIALS } from "@/components/SocialIcons";
import CurrencySelectorBadge from "@/components/CurrencySelectorBadge";

export default function NavigationDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { items: cartItems, addItem } = useCart();
  const { items: wishlistItems, toggleWishlist, isWishlisted } = useWishlist();
  const { isAuthenticated, user, logout, navigateToLogin } = useAuth();

  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Expandable Menu States
  const [shopExpanded, setShopExpanded] = useState(false);
  const [collectionsExpanded, setCollectionsExpanded] = useState(false);
  const [wishlistExpanded, setWishlistExpanded] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    "NEW ARRIVALS": false,
    "BEST SELLERS": false,
    "LIMITED EDITION": false,
    "COMING SOON": false,
    "SALE": false,
  });

  const toggleSection = (sectionTitle) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle],
    }));
  };

  // Shop Filters Active States inside Drawer
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("");
  const [selectedSort, setSelectedSort] = useState("Newest");

  // Load products for Search & Featured section
  useEffect(() => {
    setLoadingProducts(true);
    base44.entities.Product.list("-created_date", 100)
      .then((list) => {
        setProducts(list || []);
      })
      .catch((err) => console.error("Failed to load products in drawer:", err))
      .finally(() => setLoadingProducts(false));
  }, []);

  // Close drawer on path change
  useEffect(() => {
    onClose();
  }, [location.pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Instant Search Filtered Products
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return products.filter((p) => {
      const nameMatch = p.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const descMatch = p.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const colMatch = p.collection?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(p.collections) && p.collections.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())));
      return nameMatch || descMatch || colMatch;
    }).slice(0, 5);
  }, [searchQuery, products]);

  // Featured Product Choice (Product with 'featured' flag or first product)
  const featuredProduct = useMemo(() => {
    if (products.length === 0) return null;
    return products.find((p) => p.featured) || products[0];
  }, [products]);

  // Navigation Links Lists
  const headingSections = [
    {
      title: "NEW ARRIVALS",
      filter: { collection: "New Arrivals" },
      subLinks: [
        { label: "ALL NEW ARRIVALS", filter: { collection: "New Arrivals" } },
        { label: "HOODIES & FLEECE", filter: { collection: "New Arrivals", category: "Hoodies" } },
        { label: "SWEATPANTS & JOGGERS", filter: { collection: "New Arrivals", category: "Sweatpants" } },
        { label: "GOLF & POLO SHIRTS", filter: { collection: "New Arrivals", category: "Golf / Polo Shirts" } },
        { label: "CAPS & HEADWEAR", filter: { collection: "New Arrivals", category: "Caps" } },
        { label: "EMBROIDERED TEES", filter: { collection: "New Arrivals", category: "Embroidered Tees" } },
        { label: "PRINTED TEES", filter: { collection: "New Arrivals", category: "Printed Tees" } },
        { label: "CLASSIC T-SHIRTS", filter: { collection: "New Arrivals", category: "T-Shirts" } },
      ]
    },
    {
      title: "BEST SELLERS",
      filter: { collection: "Best Sellers" },
      subLinks: [
        { label: "ALL BEST SELLERS", filter: { collection: "Best Sellers" } },
        { label: "HOODIES & FLEECE", filter: { collection: "Best Sellers", category: "Hoodies" } },
        { label: "SWEATPANTS & JOGGERS", filter: { collection: "Best Sellers", category: "Sweatpants" } },
        { label: "GOLF & POLO SHIRTS", filter: { collection: "Best Sellers", category: "Golf / Polo Shirts" } },
        { label: "CAPS & HEADWEAR", filter: { collection: "Best Sellers", category: "Caps" } },
        { label: "EMBROIDERED TEES", filter: { collection: "Best Sellers", category: "Embroidered Tees" } },
        { label: "PRINTED TEES", filter: { collection: "Best Sellers", category: "Printed Tees" } },
        { label: "CLASSIC T-SHIRTS", filter: { collection: "Best Sellers", category: "T-Shirts" } },
      ]
    },
    {
      title: "LIMITED EDITION",
      filter: { collection: "Limited Edition" },
      subLinks: [
        { label: "ALL LIMITED EDITION", filter: { collection: "Limited Edition" } },
        { label: "HOODIES & FLEECE", filter: { collection: "Limited Edition", category: "Hoodies" } },
        { label: "SWEATPANTS & JOGGERS", filter: { collection: "Limited Edition", category: "Sweatpants" } },
        { label: "GOLF & POLO SHIRTS", filter: { collection: "Limited Edition", category: "Golf / Polo Shirts" } },
        { label: "CAPS & HEADWEAR", filter: { collection: "Limited Edition", category: "Caps" } },
        { label: "EMBROIDERED TEES", filter: { collection: "Limited Edition", category: "Embroidered Tees" } },
        { label: "PRINTED TEES", filter: { collection: "Limited Edition", category: "Printed Tees" } },
        { label: "CLASSIC T-SHIRTS", filter: { collection: "Limited Edition", category: "T-Shirts" } },
      ]
    },
    {
      title: "COMING SOON",
      filter: { availability: "Coming Soon" },
      subLinks: [
        { label: "ALL COMING SOON", filter: { availability: "Coming Soon" } },
        { label: "HOODIES & FLEECE", filter: { availability: "Coming Soon", category: "Hoodies" } },
        { label: "SWEATPANTS & JOGGERS", filter: { availability: "Coming Soon", category: "Sweatpants" } },
        { label: "GOLF & POLO SHIRTS", filter: { availability: "Coming Soon", category: "Golf / Polo Shirts" } },
        { label: "CAPS & HEADWEAR", filter: { availability: "Coming Soon", category: "Caps" } },
        { label: "EMBROIDERED TEES", filter: { availability: "Coming Soon", category: "Embroidered Tees" } },
        { label: "PRINTED TEES", filter: { availability: "Coming Soon", category: "Printed Tees" } },
        { label: "CLASSIC T-SHIRTS", filter: { availability: "Coming Soon", category: "T-Shirts" } },
      ]
    },
    {
      title: "SALE",
      filter: { collection: "Sale" },
      subLinks: [
        { label: "ALL SALE", filter: { collection: "Sale" } },
        { label: "HOODIES & FLEECE", filter: { collection: "Sale", category: "Hoodies" } },
        { label: "SWEATPANTS & JOGGERS", filter: { collection: "Sale", category: "Sweatpants" } },
        { label: "GOLF & POLO SHIRTS", filter: { collection: "Sale", category: "Golf / Polo Shirts" } },
        { label: "CAPS & HEADWEAR", filter: { collection: "Sale", category: "Caps" } },
        { label: "EMBROIDERED TEES", filter: { collection: "Sale", category: "Embroidered Tees" } },
        { label: "PRINTED TEES", filter: { collection: "Sale", category: "Printed Tees" } },
        { label: "CLASSIC T-SHIRTS", filter: { collection: "Sale", category: "T-Shirts" } },
      ]
    }
  ];

  const collectionsList = [
    "Core Collection",
    "Permanent Art",
    "Minimal Series",
    "Signature Collection",
    "Premium Essentials",
    "Future Drops",
    "Seasonal Collection"
  ];

  const categoriesList = ["Hoodies", "Sweatpants", "Golf / Polo Shirts", "Caps", "Embroidered Tees", "Printed Tees", "T-Shirts"];

  const categoryHasProducts = (catName) => {
    if (!catName) return true;
    const target = catName.toLowerCase();
    return products.some((p) => {
      if (p.hidden) return false;
      const c = p.category ? p.category.toLowerCase() : "";
      const name = p.name ? p.name.toLowerCase() : "";
      if (target.includes("hoodie")) return c.includes("hoodie") || name.includes("hoodie");
      if (target.includes("sweatpant") || target.includes("jogger")) return c.includes("sweatpant") || name.includes("sweatpant") || name.includes("jogger");
      if (target.includes("polo") || target.includes("golf")) return c.includes("polo") || c.includes("golf") || name.includes("polo") || name.includes("golf");
      if (target.includes("cap") || target.includes("headwear")) return c.includes("cap") || name.includes("cap");
      if (target.includes("embroidered")) return c.includes("embroidered") || name.includes("embroidered");
      if (target.includes("printed")) return c.includes("printed") || name.includes("printed");
      if (target.includes("t-shirt") || target === "tees") return c === "t-shirts" || name.includes("tee") || name.includes("t-shirt");
      return c === target || name.includes(target);
    });
  };

  const visibleCategoriesList = useMemo(() => {
    return categoriesList.filter((cat) => categoryHasProducts(cat));
  }, [products]);
  const sizesList = ["XS", "S", "M", "L", "XL"];
  const colorsList = [
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#FFFFFF", border: true },
  ];

  const sortOptions = [
    { label: "Newest", value: "Newest" },
    { label: "Best Selling", value: "Best Selling" },
    { label: "Featured", value: "Featured" },
    { label: "Price Low → High", value: "Price Low → High" },
    { label: "Price High → Low", value: "Price High → Low" },
  ];

  // Apply Filter & Redirect to Shop Page
  const applyFilterAndGo = (filters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val) params.set(key, val);
    });
    navigate(`/shop?${params.toString()}`);
    onClose();
  };

  const handleQuickShop = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, "M", 1);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark blurred Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-[3px] transition-all duration-300"
          />

          {/* Left Navigation Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", ease: [0.16, 1, 0.3, 1], duration: 0.45 }}
            className="fixed bottom-0 left-0 top-0 z-50 flex h-full w-[90%] flex-col bg-white text-neutral-900 shadow-2xl rounded-r-[12px] md:w-[420px] lg:w-[460px] overflow-hidden border-r border-neutral-200"
          >
            {/* Top Section */}
            <div className="relative flex flex-col px-8 pt-8 pb-4 border-b border-neutral-200 bg-white">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-6 top-8 text-neutral-500 hover:text-black transition-colors duration-200 cursor-pointer"
                aria-label="Close menu"
              >
                <X className="h-6 w-6 stroke-[1.5]" />
              </button>

              {/* Logo & Slogan */}
              <div className="flex items-center gap-3.5">
                <SpinningLogo size={48} />
                <div className="flex flex-col items-start gap-0.5">
                  <span className="font-display text-2xl font-black tracking-[0.3em] text-black">
                    FORTIFIED
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.55em] text-neutral-500 font-bold">
                    PERMANENT ART
                  </span>
                </div>
              </div>
            </div>

            {/* Scrollable Container */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-8 py-6 space-y-8 bg-white">
              
              {/* Premium Search Field */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
                    onClose();
                  }
                }}
                className="relative w-full"
              >
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neutral-400">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-lg py-3.5 pl-11 pr-4 font-mono text-[11px] tracking-wider text-black placeholder:text-neutral-400 focus:outline-none focus:border-black transition-colors duration-300"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-4 flex items-center text-neutral-400 hover:text-black"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}

                {/* Instant Search Results Panel */}
                <AnimatePresence>
                  {searchQuery.trim() && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-lg shadow-2xl z-50 p-3 max-h-[300px] overflow-y-auto space-y-2"
                    >
                      <p className="font-mono text-[8px] uppercase tracking-widest text-neutral-500 font-bold px-2 mb-1">
                        Search Results ({searchResults.length})
                      </p>
                      {searchResults.length === 0 ? (
                        <p className="font-mono text-[10px] text-neutral-500 p-3 text-center">
                          No matching pieces found
                        </p>
                      ) : (
                        searchResults.map((product) => (
                          <Link
                            key={product.id}
                            to={`/product/${product.id}`}
                            className="flex items-center gap-3 p-2 rounded hover:bg-neutral-100 transition-colors duration-200 group"
                          >
                            {product.images?.[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="h-10 w-8 object-cover bg-neutral-100 rounded"
                                loading="lazy"
                              />
                            ) : (
                              <div className="h-10 w-8 bg-neutral-100 rounded flex items-center justify-center font-mono text-[7px] text-neutral-500">
                                ARCHIVE
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-[11px] font-sans font-bold text-black truncate group-hover:text-black transition-colors">
                                {product.name}
                              </h4>
                              <p className="font-mono text-[9px] text-neutral-500 mt-0.5">
                                {product.collection || "Permanent Art"}
                              </p>
                            </div>
                            <span className="font-mono text-[10px] font-bold text-neutral-800">
                              {zar(product.price)}
                            </span>
                          </Link>
                        ))
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>

              {/* Navigation Structure */}
              <nav className="flex flex-col space-y-4">
                
                {/* Direct Page Links: Lookbook & Drops */}
                <div className="border-b border-neutral-200 pb-3 flex flex-col gap-1">
                  <Link
                    to="/lookbook"
                    onClick={onClose}
                    className="flex w-full items-center justify-between py-2 font-display text-md font-bold tracking-[0.15em] text-neutral-800 hover:text-black transition-colors"
                  >
                    <span>LOOKBOOK EDITORIAL</span>
                    <ArrowRight className="h-4 w-4 text-neutral-400" />
                  </Link>
                  <Link
                    to="/drop"
                    onClick={onClose}
                    className="flex w-full items-center justify-between py-2 font-display text-md font-bold tracking-[0.15em] text-neutral-800 hover:text-black transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span>CAPSULE DROPS</span>
                      <span className="font-mono text-[8px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">LIVE</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-neutral-400" />
                  </Link>
                </div>

                {/* Expandable SHOP with Filters */}
                <div className="border-b border-neutral-200 pb-3">
                  <button
                    onClick={() => setShopExpanded(!shopExpanded)}
                    className="flex w-full items-center justify-between py-2 text-left group cursor-pointer"
                  >
                    <span className="font-display text-lg font-black tracking-[0.15em] text-black transition-colors">
                      SHOP
                    </span>
                    {shopExpanded ? (
                      <ChevronUp className="h-4 w-4 text-neutral-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-neutral-500" />
                    )}
                  </button>

                  <AnimatePresence>
                    {shopExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mt-3 pl-2 pr-1 space-y-5 pb-4"
                      >
                        {/* Filter by Category */}
                        <div>
                          <label className="font-mono text-[9px] uppercase tracking-[0.3em] text-neutral-500 font-bold block mb-2">
                            Category
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {visibleCategoriesList.map((cat) => (
                              <button
                                key={cat}
                                onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
                                className={`font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 border rounded-full transition-all duration-300 cursor-pointer ${
                                  selectedCategory === cat
                                    ? "bg-black text-white border-black font-bold"
                                    : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:text-black hover:border-black"
                                }`}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Filter by Size */}
                        <div>
                          <label className="font-mono text-[9px] uppercase tracking-[0.3em] text-neutral-500 font-bold block mb-2">
                            Size
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {sizesList.map((sz) => (
                              <button
                                key={sz}
                                onClick={() => setSelectedSize(selectedSize === sz ? "" : sz)}
                                className={`h-8 w-8 flex items-center justify-center font-mono text-[10px] border transition-all duration-300 cursor-pointer rounded-sm ${
                                  selectedSize === sz
                                    ? "bg-black text-white border-black font-bold"
                                    : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:text-black hover:border-black"
                                }`}
                              >
                                {sz}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Filter by Colour Swatches */}
                        <div>
                          <label className="font-mono text-[9px] uppercase tracking-[0.3em] text-neutral-500 font-bold block mb-2.5">
                            Colour
                          </label>
                          <div className="flex flex-wrap gap-3">
                            {colorsList.map((col) => (
                              <button
                                key={col.name}
                                title={col.name}
                                onClick={() => setSelectedColor(selectedColor === col.name ? "" : col.name)}
                                className="relative group/swatch focus:outline-none"
                              >
                                <span
                                  style={{ backgroundColor: col.hex }}
                                  className={`block h-7 w-7 rounded-full transition-transform duration-300 cursor-pointer ${
                                    selectedColor === col.name
                                      ? "scale-115 ring-2 ring-black ring-offset-2 ring-offset-white"
                                      : "hover:scale-115 hover:shadow-md"
                                  } ${col.border ? "border border-neutral-300" : ""}`}
                                />
                                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-black border border-neutral-800 text-[8px] font-mono uppercase tracking-widest text-white px-1.5 py-0.5 rounded opacity-0 pointer-events-none group-hover/swatch:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                                  {col.name}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Sort By */}
                        <div>
                          <label className="font-mono text-[9px] uppercase tracking-[0.3em] text-neutral-500 font-bold block mb-2">
                            Sort By
                          </label>
                          <div className="grid grid-cols-1 gap-1">
                            {sortOptions.map((opt) => (
                              <button
                                key={opt.value}
                                onClick={() => setSelectedSort(opt.value)}
                                className={`text-left py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors cursor-pointer ${
                                  selectedSort === opt.value
                                    ? "text-black font-bold"
                                    : "text-neutral-600 hover:text-black"
                                }`}
                              >
                                {selectedSort === opt.value ? "• " : "  "} {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Apply Button */}
                        <button
                          onClick={() =>
                            applyFilterAndGo({
                              category: selectedCategory,
                              size: selectedSize,
                              color: selectedColor,
                              sort: selectedSort,
                            })
                          }
                          className="w-full bg-black text-white py-3 font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-center hover:bg-neutral-800 transition-colors rounded-sm cursor-pointer"
                        >
                          APPLY FILTERS
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                 {/* Main Navigation Links */}
                {headingSections.map((section) => {
                  const isExpanded = expandedSections[section.title];
                  return (
                    <div key={section.title} className="border-b border-neutral-200 pb-2">
                      <button
                        onClick={() => toggleSection(section.title)}
                        className="flex w-full items-center justify-between py-2.5 text-left group cursor-pointer"
                      >
                        <span className="font-display text-md font-bold tracking-[0.15em] text-neutral-800 group-hover:text-black transition-colors">
                          {section.title}
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-neutral-500 group-hover:text-black transition-colors" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-neutral-500 group-hover:text-black transition-colors" />
                        )}
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden pl-4 mt-1.5 space-y-2 pb-2"
                          >
                            {section.subLinks
                              .filter((sub) => !sub.filter?.category || categoryHasProducts(sub.filter.category))
                              .map((sub) => (
                              <button
                                key={sub.label}
                                onClick={() => applyFilterAndGo(sub.filter)}
                                className="block font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-600 hover:text-black font-medium transition-colors py-1 text-left w-full cursor-pointer"
                              >
                                {sub.label}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                {/* Expandable COLLECTIONS */}
                <div className="border-t border-neutral-200 pt-3">
                  <button
                    onClick={() => setCollectionsExpanded(!collectionsExpanded)}
                    className="flex w-full items-center justify-between py-2 text-left group cursor-pointer"
                  >
                    <span className="font-display text-md font-bold tracking-[0.15em] text-neutral-800 group-hover:text-black transition-colors">
                      COLLECTIONS
                    </span>
                    {collectionsExpanded ? (
                      <ChevronUp className="h-4 w-4 text-neutral-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-neutral-500" />
                    )}
                  </button>

                  <AnimatePresence>
                    {collectionsExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pl-3 mt-2 space-y-2.5 pb-2"
                      >
                        {collectionsList.map((col) => (
                          <button
                            key={col}
                            onClick={() => applyFilterAndGo({ collection: col })}
                            className="block font-mono text-[10px] uppercase tracking-widest text-neutral-600 hover:text-black font-medium transition-colors py-1 cursor-pointer"
                          >
                            {col}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Expandable WISHLIST */}
                <div className="border-t border-neutral-200 pt-3">
                  <button
                    onClick={() => setWishlistExpanded(!wishlistExpanded)}
                    className="flex w-full items-center justify-between py-2 text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Heart
                        className={`h-4 w-4 transition-all duration-300 ${
                          wishlistItems.length > 0 ? "fill-red-600 text-red-600 scale-110" : "text-neutral-500"
                        }`}
                      />
                      <span className="font-display text-md font-bold tracking-[0.15em] text-neutral-800 group-hover:text-black transition-colors">
                        WISHLIST ({wishlistItems.length})
                      </span>
                    </div>
                    {wishlistExpanded ? (
                      <ChevronUp className="h-4 w-4 text-neutral-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-neutral-500" />
                    )}
                  </button>

                  <AnimatePresence>
                    {wishlistExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pl-2 mt-3 space-y-3 pb-3"
                      >
                        {wishlistItems.length === 0 ? (
                          <p className="font-mono text-[9px] text-neutral-500 py-2 uppercase tracking-[0.15em]">
                            Wishlist is empty.
                          </p>
                        ) : (
                          wishlistItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-3">
                              <Link to={`/product/${item.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                                {item.images?.[0] ? (
                                  <img
                                    src={item.images[0]}
                                    alt={item.name}
                                    className="h-10 w-8 object-cover bg-neutral-100 rounded"
                                    loading="lazy"
                                  />
                                ) : (
                                  <div className="h-10 w-8 bg-neutral-100 rounded flex items-center justify-center font-mono text-[7px] text-neutral-500">
                                    ARCHIVE
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <h5 className="font-sans text-[10px] font-bold text-black truncate">{item.name}</h5>
                                  <p className="font-mono text-[9px] text-neutral-500 mt-0.5">{zar(item.price)}</p>
                                </div>
                              </Link>
                              <button
                                onClick={() => toggleWishlist(item)}
                                className="text-neutral-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                                title="Remove bookmark"
                              >
                                <X className="h-3.5 w-3.5 stroke-[1.5]" />
                              </button>
                            </div>
                          ))
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </nav>

              {/* Featured Section */}
              {featuredProduct && (
                <div className="border-t border-neutral-200 pt-8">
                  <p className="font-mono text-[8px] uppercase tracking-[0.4em] text-neutral-500 font-bold mb-4">
                    Featured Spotlight
                  </p>
                  <div className="group bg-neutral-50 border border-neutral-200 rounded-lg p-3 relative overflow-hidden flex flex-col">
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-white rounded flex flex-col justify-center items-center border border-neutral-200">
                      {featuredProduct.images?.[0] ? (
                        <img
                          src={featuredProduct.images[0]}
                          alt={featuredProduct.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="p-4 text-center">
                          <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-neutral-500">FORTIFIED ARCHIVE</span>
                        </div>
                      )}
                      <span className="absolute left-3 top-3 bg-black text-white font-mono text-[8px] uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm font-black">
                        NEW
                      </span>
                    </div>

                    <div className="mt-4 flex flex-col gap-1 text-left">
                      <Link
                        to={`/product/${featuredProduct.id}`}
                        className="font-sans text-[13px] font-bold text-black hover:underline truncate"
                      >
                        {featuredProduct.name}
                      </Link>
                      <p className="font-mono text-[11px] font-bold text-neutral-700">
                        {zar(featuredProduct.price)}
                      </p>
                    </div>

                    <button
                      onClick={(e) => handleQuickShop(e, featuredProduct)}
                      className="mt-4 w-full bg-black text-white hover:bg-neutral-800 border border-transparent py-2.5 font-mono text-[9px] uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-1.5 font-bold rounded-sm cursor-pointer"
                    >
                      <ShoppingBag className="h-3 w-3" />
                      Quick Shop
                    </button>
                  </div>
                </div>
              )}

              {/* Brand Story Section */}
              <div className="border-t border-neutral-200 pt-8 pb-4 text-left space-y-4">
                <div className="flex items-center gap-2">
                  <span className="h-[1px] w-6 bg-neutral-300" />
                  <span className="font-mono text-[8px] uppercase tracking-[0.5em] text-neutral-500 font-bold">
                    Our Philosophy
                  </span>
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-display text-sm font-black tracking-widest text-black">
                    FORTIFIED
                  </h4>
                  <p className="font-mono text-[10px] text-neutral-500 font-bold uppercase tracking-[0.3em]">
                    Permanent Art
                  </p>
                </div>
                <p className="font-body text-[11px] leading-relaxed text-neutral-600 max-w-xs">
                  Designed with intention. Built for everyday expression. Minimal. Timeless. Premium.
                </p>
              </div>

              {/* Social Channels Section */}
              <div className="border-t border-neutral-200 pt-8">
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-neutral-500 font-bold block mb-3">
                  OFFICIAL SOCIAL CHANNELS
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
                  {FORTIFIED_SOCIALS.map(({ Icon, href, name, handle }) => (
                    <a
                      key={name}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 p-2 border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 hover:border-black transition-all group rounded-lg"
                    >
                      <div className="flex h-8 w-8 items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-mono text-[10px] uppercase font-bold text-black tracking-wider truncate">
                          {name}
                        </span>
                        <span className="font-mono text-[9px] text-neutral-500 group-hover:text-black truncate">
                          {handle}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>

                {/* Footer Links Grid */}
                <div className="grid grid-cols-2 gap-y-3.5 gap-x-4">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      logout(false);
                      onClose();
                      window.location.href = "/";
                    }}
                    className="text-left font-mono text-[9px] uppercase tracking-[0.2em] text-red-600 hover:text-red-700 font-bold transition-colors cursor-pointer"
                  >
                    LOGOUT ({user?.email?.split('@')[0] || "MEMBER"})
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={onClose}
                    className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-600 hover:text-black font-medium transition-colors"
                  >
                    LOGIN
                  </Link>
                )}
                
                <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500 font-bold">
                    REGION & CURRENCY
                  </span>
                  <CurrencySelectorBadge />
                </div>

                <Link
                  to="/account"
                  onClick={onClose}
                  className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-600 hover:text-black font-medium transition-colors"
                >
                  MY ACCOUNT
                </Link>
                <Link
                  to="/my-orders"
                  onClick={onClose}
                  className="font-mono text-[9px] uppercase tracking-[0.2em] text-black font-bold hover:text-neutral-600 transition-colors"
                >
                  MY ORDERS & TRACKING
                </Link>
                <Link
                  to="/admin"
                  className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-600 hover:text-black font-medium transition-colors"
                >
                  ADMIN CONTROL
                </Link>
                <button
                  onClick={() => setWishlistExpanded(true)}
                  className="text-left font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-600 hover:text-black font-medium transition-colors cursor-pointer"
                >
                  WISHLIST
                </button>
                <Link
                  to="/services"
                  className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-600 hover:text-black font-medium transition-colors"
                >
                  TRACK ORDER
                </Link>
                <Link
                  to="/about"
                  className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-600 hover:text-black font-medium transition-colors"
                >
                  CONTACT
                </Link>
                <Link
                  to="/services"
                  className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-600 hover:text-black font-medium transition-colors"
                >
                  SIZE GUIDE
                </Link>
                <Link
                  to="/services"
                  className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-600 hover:text-black font-medium transition-colors"
                >
                  SHIPPING
                </Link>
                <Link
                  to="/services"
                  className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-600 hover:text-black font-medium transition-colors"
                >
                  RETURNS
                </Link>
                <Link
                  to="/services"
                  className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-600 hover:text-black font-medium transition-colors col-span-2"
                >
                  FAQ
                </Link>
              </div>
            </div>
            </div>

            {/* Sticky Social Icons in bottom of Drawer */}
            <div className="border-t border-neutral-200 bg-neutral-50 px-8 py-5 flex items-center justify-between gap-4">
              <span className="font-mono text-[8px] uppercase tracking-[0.25em] text-neutral-500 font-bold shrink-0">
                © {new Date().getFullYear()} Fortified
              </span>
              <div className="flex items-center gap-3 flex-wrap justify-end">
                {FORTIFIED_SOCIALS.map(({ Icon, href, name }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 transition-all hover:scale-125 active:scale-95 drop-shadow-sm"
                    aria-label={name}
                    title={name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
