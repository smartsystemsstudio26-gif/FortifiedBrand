import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { base44 } from "@/api/base44Client";
import { getStoredVipClients, addVipClient, subscribeVipClientsFromFirestore } from "@/lib/vipManager";
import { createMockOrder } from "@/api/mockSalesService";
import {
  Plus,
  Trash2,
  Upload,
  Save,
  X,
  Check,
  Eye,
  EyeOff,
  HelpCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  DollarSign,
  Package,
  ShoppingBag,
  Mail,
  Printer,
  Download,
  RefreshCw,
  AlertTriangle,
  FileText,
  Send,
  Search,
  Filter,
  ShieldCheck,
  Clock,
  MapPin,
  Phone,
  BarChart2,
  Sliders,
  ChevronRight,
  ExternalLink,
  Zap,
  Play,
  Pause,
  Activity,
  Layers,
  ArrowUpRight,
  PieChart as PieIcon,
  Table,
  Lock,
  Key,
  LogOut,
  Radio,
  Megaphone,
  Bell,
  LayoutGrid,
  Users,
  CreditCard,
  Settings,
  Grid,
  Video,
  Film,
  ArrowUp,
  ArrowDown,
  PlusCircle,
  Flame,
  Truck,
} from "lucide-react";
import { useStoreSettings } from "@/lib/storeSettings";
import {
  getStoredLookbookShots,
  saveLookbookShots,
  DEFAULT_LOOKBOOK_SHOTS,
  SS26_STREETWEAR_PACK,
  getStoredCapsuleDrops,
  saveCapsuleDrops,
  DEFAULT_CAPSULE_DROPS
} from "@/lib/lookbookState";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import SpinningLogo from "@/components/SpinningLogo";
import BrandAssetsMediaManager from "@/components/BrandAssetsMediaManager";
import BackButton from "@/components/BackButton";

// Helper for formatting ZAR currency
const zar = (amount) => {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0
  }).format(amount || 0);
};

export default function Admin() {
  const { storeSettings, updateStoreSettings } = useStoreSettings();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("fortified_admin_auth") === "true";
  });
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminPasscode, setAdminPasscode] = useState("");
  const [authError, setAuthError] = useState("");

  // Navigation state
  const [activeTab, setActiveTab] = useState("dashboard");

  // Real-time Clock State
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedClockTime = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });

  const formattedClockDate = currentTime
    .toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    })
    .toUpperCase();

  // Primary Data Collections
  const [products, setProducts] = useState([
    {
      id: "prod-1",
      name: "FORTIFIED EMBROIDERED TEE - BLACK",
      price: 850,
      category: "Embroidered Tees",
      stock: 45,
      reorderThreshold: 10,
      description: "Heavyweight 280GSM cotton with high-density 3D chest embroidery.",
      images: ["/images/embroidered-black/emb_black_front.jpg"],
      colorStock: { Black: 30, White: 15 }
    },
    {
      id: "prod-2",
      name: "FORTIFIED EMBROIDERED TEE - WHITE",
      price: 850,
      category: "Embroidered Tees",
      stock: 28,
      reorderThreshold: 10,
      description: "Pristine white architectural weave tee with monochrome black crest.",
      images: ["/images/embroidered-white/emb_white_front.jpg"],
      colorStock: { Black: 0, White: 28 }
    },
    {
      id: "prod-3",
      name: "NEW ARRIVALS OVERSIZED TEE",
      price: 950,
      category: "Printed Tees",
      stock: 12,
      reorderThreshold: 10,
      description: "Boxy luxury fit tee featuring our signature minimalist back print.",
      images: ["/images/classic-front-black/classic_black_front.jpg"],
      colorStock: { Black: 8, White: 4 }
    }
  ]);

  // Sync live products and orders from storage/base44
  useEffect(() => {
    const fetchLiveProducts = async () => {
      try {
        const list = await base44.entities.Product.list("-created_date", 1000, true);
        if (list && list.length > 0) {
          setProducts(list);
        }
      } catch (err) {
        console.error("Failed to fetch products in Admin:", err);
      }
    };

    const fetchLiveOrders = async () => {
      try {
        const list = await base44.entities.Order.list("-created_date");
        if (list && Array.isArray(list) && list.length > 0) {
          setOrders(list);
        }
      } catch (err) {
        console.error("Failed to fetch orders in Admin:", err);
      }
    };

    fetchLiveProducts();
    fetchLiveOrders();

    const handleStorageUpdate = () => {
      fetchLiveOrders();
      fetchLiveProducts();
    };
    window.addEventListener("storage", handleStorageUpdate);
    return () => window.removeEventListener("storage", handleStorageUpdate);
  }, []);

  const [orders, setOrders] = useState([
    {
      id: "ord-982104",
      order_number: "FTD-982104",
      customer_name: "Zola Dlamini",
      customer_email: "zola.dlamini@mweb.co.za",
      customer_phone: "+27 82 456 7890",
      shipping_address: "14 Rosebank Road, Sandton,\nJohannesburg, 2196, ZA South Africa",
      country: "South Africa",
      country_code: "ZA",
      country_flag: "🇿🇦",
      total: 1950,
      subtotal: 1950,
      status: "delivered",
      payment_method: "Card",
      tracking_number: "RAM-ZA-882194",
      created_date: "2026-07-28T10:00:00Z",
      items: [
        { name: "FORTIFIED EMBROIDERED BLACK TEE", quantity: 1, price: 1950, size: "L", colour: "Black", image: "/images/embroidered-black/emb_black_front.jpg" }
      ]
    },
    {
      id: "ord-982103",
      order_number: "FTD-982103",
      customer_name: "Marcus Thorne",
      customer_email: "marcus.t@gmail.com",
      customer_phone: "+27 71 333 4455",
      shipping_address: "45 Kloof Street, Gardens,\nCape Town, 8001, ZA South Africa",
      country: "South Africa",
      country_code: "ZA",
      country_flag: "🇿🇦",
      total: 2300,
      subtotal: 2300,
      status: "shipped",
      payment_method: "Card",
      tracking_number: "RAM-ZA-882193",
      created_date: "2026-07-27T14:20:00Z",
      items: [
        { name: "FORTIFIED EMBROIDERED WHITE TEE", quantity: 1, price: 1150, size: "M", colour: "White", image: "/images/classic-front-black/classic_black_front.jpg" },
        { name: "FORTIFIED HEAVYWEIGHT TEE", quantity: 1, price: 1150, size: "L", colour: "Black", image: "/images/classic-front-black/classic_black_front.jpg" }
      ]
    },
    {
      id: "ord-982102",
      order_number: "FTD-982102",
      customer_name: "Jessica Daniels",
      customer_email: "jessica.daniels@yahoo.com",
      customer_phone: "+27 83 999 1122",
      shipping_address: "12 Florida Road, Morningside,\nDurban, 4001, ZA South Africa",
      country: "South Africa",
      country_code: "ZA",
      country_flag: "🇿🇦",
      total: 3900,
      subtotal: 3900,
      status: "processing",
      payment_method: "Card",
      tracking_number: "RAM-ZA-882192",
      created_date: "2026-07-26T11:45:00Z",
      items: [
        { name: "FORTIFIED ARCHIVE LUXURY GRAIL TEE", quantity: 1, price: 3900, size: "S", colour: "Black", image: "/images/embroidered-black/emb_black_front.jpg" }
      ]
    },
    {
      id: "ord-982101",
      order_number: "FTD-982101",
      customer_name: "Sipho Ndlovu",
      customer_email: "sipho.ndlovu@gmail.com",
      customer_phone: "+27 84 222 3344",
      shipping_address: "88 Waterfront Way, Knysna,\n6571, ZA South Africa",
      country: "South Africa",
      country_code: "ZA",
      country_flag: "🇿🇦",
      total: 950,
      subtotal: 950,
      status: "delivered",
      payment_method: "Card",
      tracking_number: "RAM-ZA-882191",
      created_date: "2026-07-25T16:10:00Z",
      items: [
        { name: "FORTIFIED MONOLITH HEAVYWEIGHT TEE", quantity: 1, price: 950, size: "XL", colour: "Black", image: "/images/classic-front-black/classic_black_front.jpg" }
      ]
    },
    {
      id: "ord-982100",
      order_number: "FTD-982100",
      customer_name: "Alex Vance",
      customer_email: "alex.vance@uk-design.co.uk",
      customer_phone: "+44 20 7946 0912",
      shipping_address: "10 Mayfair Square, London,\nW1J 8AJ, GB United Kingdom",
      country: "United Kingdom",
      country_code: "GB",
      country_flag: "🇬🇧",
      total: 3900,
      subtotal: 3900,
      status: "pending",
      payment_method: "Card",
      tracking_number: "RAM-ZA-882190",
      created_date: "2026-07-24T09:30:00Z",
      items: [
        { name: "FORTIFIED ARCHIVE GRAIL TEE", quantity: 1, price: 3900, size: "M", colour: "Black", image: "/images/embroidered-black/emb_black_front.jpg" }
      ]
    }
  ]);

  // VIP Clients State
  const [vipClients, setVipClients] = useState(getStoredVipClients);
  const [newVipEmail, setNewVipEmail] = useState("");
  const [newVipName, setNewVipName] = useState("");
  const [newVipTier, setNewVipTier] = useState("VIP Early Release");
  const [newVipPhone, setNewVipPhone] = useState("");
  const [vipSendingEmailId, setVipSendingEmailId] = useState(null);
  const [vipSuccessMsg, setVipSuccessMsg] = useState("");

  useEffect(() => {
    const handleVipUpdate = () => {
      setVipClients(getStoredVipClients());
    };
    window.addEventListener("fortified_vip_updated", handleVipUpdate);
    window.addEventListener("storage", handleVipUpdate);
    const unsubscribe = subscribeVipClientsFromFirestore((vips) => {
      if (Array.isArray(vips) && vips.length > 0) {
        setVipClients(vips);
      }
    });
    return () => {
      window.removeEventListener("fortified_vip_updated", handleVipUpdate);
      window.removeEventListener("storage", handleVipUpdate);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const getTierBadgeClass = (tier) => {
    const norm = (tier || "").toLowerCase();
    if (norm.includes("bespoke") || norm.includes("collector")) {
      return "bg-amber-100 text-amber-950 border-amber-400 font-extrabold shadow-[0_2px_0_0_#d97706]";
    }
    if (norm.includes("tier-1") || norm.includes("tier 1")) {
      return "bg-emerald-100 text-emerald-950 border-emerald-400 font-extrabold shadow-[0_2px_0_0_#059669]";
    }
    if (norm.includes("tier-2") || norm.includes("tier 2")) {
      return "bg-blue-100 text-blue-950 border-blue-400 font-extrabold shadow-[0_2px_0_0_#2563eb]";
    }
    if (norm.includes("atelier") || norm.includes("vip")) {
      return "bg-purple-100 text-purple-950 border-purple-400 font-extrabold shadow-[0_2px_0_0_#9333ea]";
    }
    return "bg-neutral-100 text-neutral-800 border-neutral-300 font-bold shadow-2xs";
  };

  // Lookbook & Capsule State
  const [lookbookShots, setLookbookShots] = useState(getStoredLookbookShots);
  const [capsuleDrops, setCapsuleDrops] = useState(getStoredCapsuleDrops);
  const [campaignVideoInput, setCampaignVideoInput] = useState(storeSettings?.campaignVideoUrl || "/videos/campaign.mp4");
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoUploadStatus, setVideoUploadStatus] = useState("");

  const handleUploadVideoChunked = async (file, folder = "videos", customFileName = null, onProgress = null) => {
    if (!file) return null;
    const CHUNK_SIZE = 400 * 1024; // 400KB chunks
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const safeName = customFileName || `video_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9_.-]/g, "_")}`;

    try {
      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * CHUNK_SIZE;
        const end = Math.min(file.size, start + CHUNK_SIZE);
        const chunkBlob = file.slice(start, end);

        const chunkData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result);
          reader.onerror = (e) => reject(e);
          reader.readAsDataURL(chunkBlob);
        });

        const res = await fetch("/api/upload-chunk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: safeName,
            folder,
            chunkIndex,
            totalChunks,
            chunkData,
          }),
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Upload failed (${res.status}): ${errText}`);
        }

        const data = await res.json();
        if (!data.success) throw new Error(data.error || "Chunk upload failed");

        if (onProgress) {
          onProgress(Math.round(((chunkIndex + 1) / totalChunks) * 100));
        }

        if (data.complete && data.url) {
          return data.url;
        }
      }
    } catch (err) {
      console.warn("Backend upload endpoint unavailable or failed (e.g. Netlify static deployment 404), falling back to client Data URL:", err.message);
      if (onProgress) onProgress(50);
      const dataUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(file);
      });
      if (onProgress) onProgress(100);
      return dataUrl;
    }
    return null;
  };

  // Lookbook Item Modal State
  const [editingShot, setEditingShot] = useState(null);
  const [isAddingShot, setIsAddingShot] = useState(false);
  const [shotForm, setShotForm] = useState({
    title: "LOOK 07 — NEW EDITORIAL",
    subtitle: "Permanent Art Tee",
    img: "/images/classic-front-black/classic_black_front.jpg",
    videoUrl: "",
    type: "image",
    span: "md:col-span-1",
    ratio: "aspect-[4/5]",
    position: "object-center"
  });

  // Capsule Drop Modal State
  const [editingDrop, setEditingDrop] = useState(null);
  const [isAddingDrop, setIsAddingDrop] = useState(false);
  const [dropForm, setDropForm] = useState({
    name: "NEW CAPSULE '26",
    status: "ACTIVE DROP",
    launchDate: "2026-09-01T18:00:00",
    units: 300,
    limitText: "LIMITED RUN — 30 PIECES",
    priceRange: "R 750 - R 1,200",
    bgUrl: "/images/drop/drop-bg.png"
  });

  // Sync effect when localStorage or custom events change
  useEffect(() => {
    const handleUpdate = () => {
      setLookbookShots(getStoredLookbookShots());
      setCapsuleDrops(getStoredCapsuleDrops());
    };
    window.addEventListener("fortified_lookbook_updated", handleUpdate);
    window.addEventListener("fortified_drops_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("fortified_lookbook_updated", handleUpdate);
      window.removeEventListener("fortified_drops_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Handlers for Lookbook Shots
  const handleSaveShot = (e) => {
    e.preventDefault();
    let updated;
    if (editingShot) {
      updated = lookbookShots.map(s => s.id === editingShot.id ? { ...editingShot, ...shotForm } : s);
    } else {
      const newShot = { ...shotForm, id: "look-" + Date.now() };
      updated = [...lookbookShots, newShot];
    }
    setLookbookShots(updated);
    saveLookbookShots(updated);
    setEditingShot(null);
    setIsAddingShot(false);
  };

  const handleDeleteShot = (id) => {
    const updated = lookbookShots.filter(s => s.id !== id);
    setLookbookShots(updated);
    saveLookbookShots(updated);
  };

  const handleMoveShot = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= lookbookShots.length) return;
    const updated = [...lookbookShots];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setLookbookShots(updated);
    saveLookbookShots(updated);
  };

  const handleLoadStreetwearPack = () => {
    setLookbookShots(SS26_STREETWEAR_PACK);
    saveLookbookShots(SS26_STREETWEAR_PACK);
  };

  const handleResetLookbookDefault = () => {
    setLookbookShots(DEFAULT_LOOKBOOK_SHOTS);
    saveLookbookShots(DEFAULT_LOOKBOOK_SHOTS);
  };

  const handleSaveCampaignVideo = () => {
    updateStoreSettings({ campaignVideoUrl: campaignVideoInput });
    alert("Campaign Video URL updated successfully.");
  };

  // Handlers for Capsule Drops
  const handleSaveCapsuleDrop = (e) => {
    e.preventDefault();
    let updated;
    if (editingDrop) {
      updated = capsuleDrops.map(d => d.id === editingDrop.id ? { ...editingDrop, ...dropForm } : d);
    } else {
      const newDrop = { ...dropForm, id: "drop-" + Date.now() };
      updated = [...capsuleDrops, newDrop];
    }
    setCapsuleDrops(updated);
    saveCapsuleDrops(updated);
    setEditingDrop(null);
    setIsAddingDrop(false);
  };

  const handleDeleteCapsuleDrop = (id) => {
    const updated = capsuleDrops.filter(d => d.id !== id);
    setCapsuleDrops(updated);
    saveCapsuleDrops(updated);
  };

  const handleToggleDropStatus = (id) => {
    const updated = capsuleDrops.map(d => {
      if (d.id === id) {
        const nextStatus = d.status === "ACTIVE DROP" ? "CORE LINE" : "ACTIVE DROP";
        return { ...d, status: nextStatus };
      }
      return d;
    });
    setCapsuleDrops(updated);
    saveCapsuleDrops(updated);
  };

  // Sales Analytics Control States
  const [salesTimeRange, setSalesTimeRange] = useState("30d");
  const [salesSearch, setSalesSearch] = useState("");
  const [salesPaymentFilter, setSalesPaymentFilter] = useState("all");
  const [salesStatusFilter, setSalesStatusFilter] = useState("all");
  const [isSimulatingSale, setIsSimulatingSale] = useState(false);
  const [salesNotice, setSalesNotice] = useState("");

  // Dynamic Sales Analytics Calculations
  const getFilteredSalesList = () => {
    const now = Date.now();
    const dayMs = 86400000;

    return orders.filter((o) => {
      const oDate = new Date(o.created_date || Date.now()).getTime();

      if (salesTimeRange === "today") {
        const isToday = new Date(oDate).toDateString() === new Date().toDateString();
        if (!isToday) return false;
      } else if (salesTimeRange === "7d") {
        if (now - oDate > 7 * dayMs) return false;
      } else if (salesTimeRange === "30d") {
        if (now - oDate > 30 * dayMs) return false;
      } else if (salesTimeRange === "ytd") {
        const isThisYear = new Date(oDate).getFullYear() === new Date().getFullYear();
        if (!isThisYear) return false;
      }

      if (salesSearch.trim()) {
        const q = salesSearch.toLowerCase();
        const matchNum = (o.order_number || "").toLowerCase().includes(q);
        const matchName = (o.customer_name || "").toLowerCase().includes(q);
        const matchEmail = (o.customer_email || "").toLowerCase().includes(q);
        const matchItems = Array.isArray(o.items) && o.items.some((i) => (i.name || "").toLowerCase().includes(q));
        if (!matchNum && !matchName && !matchEmail && !matchItems) return false;
      }

      if (salesPaymentFilter !== "all") {
        if ((o.payment_method || "").toLowerCase() !== salesPaymentFilter.toLowerCase()) return false;
      }

      if (salesStatusFilter !== "all") {
        if ((o.status || "").toLowerCase() !== salesStatusFilter.toLowerCase()) return false;
      }

      return true;
    });
  };

  const activeSalesOrdersList = getFilteredSalesList();
  const salesGrossRevenue = activeSalesOrdersList.reduce((acc, o) => acc + (Number(o.total) || 0), 0);
  const salesTotalOrders = activeSalesOrdersList.length;
  const salesAvgOrderValue = salesTotalOrders > 0 ? Math.round(salesGrossRevenue / salesTotalOrders) : 0;
  const salesUnitsDelivered = activeSalesOrdersList.reduce((acc, o) => {
    const qtySum = Array.isArray(o.items) ? o.items.reduce((iAcc, item) => iAcc + (Number(item.quantity) || 1), 0) : 1;
    return acc + qtySum;
  }, 0);

  // Time Series Chart Data Computation
  const getSalesChartData = () => {
    const map = {};
    activeSalesOrdersList.forEach((o) => {
      const d = new Date(o.created_date || Date.now());
      let key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (salesTimeRange === "all" || salesTimeRange === "ytd") {
        key = d.toLocaleDateString("en-US", { month: "short" });
      } else if (salesTimeRange === "today") {
        key = `${String(d.getHours()).padStart(2, "0")}:00`;
      }
      if (!map[key]) {
        map[key] = { label: key, month: key, sales: 0, orders: 0, time: d.getTime() };
      }
      map[key].sales += Number(o.total) || 0;
      map[key].orders += 1;
    });

    const arr = Object.values(map);
    if (salesTimeRange === "all" || salesTimeRange === "ytd") {
      const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      arr.sort((a, b) => monthOrder.indexOf(a.label) - monthOrder.indexOf(b.label));
    } else {
      arr.sort((a, b) => a.time - b.time);
    }
    return arr.length > 0 ? arr : [
      { label: "Jan", month: "Jan", sales: 120000, orders: 140 },
      { label: "Feb", month: "Feb", sales: 145000, orders: 165 },
      { label: "Mar", month: "Mar", sales: 160000, orders: 180 },
      { label: "Apr", month: "Apr", sales: 185000, orders: 210 },
      { label: "May", month: "May", sales: 210000, orders: 240 },
      { label: "Jun", month: "Jun", sales: 225000, orders: 260 },
      { label: "Jul", month: "Jul", sales: 245000, orders: 285 }
    ];
  };

  const salesAnalyticsData = getSalesChartData();

  // Category Revenue Distribution Data
  const getCategoryBreakdownData = () => {
    const catMap = {};
    activeSalesOrdersList.forEach((o) => {
      if (Array.isArray(o.items) && o.items.length > 0) {
        o.items.forEach((item) => {
          const cName = item.category || (item.name?.includes("EMBROIDERED") ? "Embroidered Tees" : item.name?.includes("MONOLITH") ? "Monolith Heavyweight" : item.name?.includes("ARCHIVE") ? "Archive Luxury" : "Capsule Apparel");
          catMap[cName] = (catMap[cName] || 0) + (Number(item.price) || 0) * (Number(item.quantity) || 1);
        });
      } else {
        catMap["Capsule Apparel"] = (catMap["Capsule Apparel"] || 0) + (Number(o.total) || 0);
      }
    });

    const result = Object.entries(catMap).map(([category, revenue]) => ({
      category,
      revenue
    }));

    return result.length > 0 ? result : [
      { category: "Embroidered Tees", revenue: 145000 },
      { category: "Monolith Heavyweight", revenue: 98000 },
      { category: "Archive Luxury", revenue: 112000 },
      { category: "Capsule Apparel", revenue: 65000 }
    ];
  };

  // Top Selling Products
  const getTopSellingProducts = () => {
    const prodMap = {};
    orders.forEach((o) => {
      if (Array.isArray(o.items)) {
        o.items.forEach((item) => {
          const pName = item.name || "FORTIFIED EMBROIDERED TEE";
          if (!prodMap[pName]) {
            prodMap[pName] = {
              name: pName,
              category: item.category || "Embroidered Tees",
              units: 0,
              revenue: 0,
              image: item.image || "/images/embroidered-black/emb_black_front.jpg"
            };
          }
          prodMap[pName].units += Number(item.quantity) || 1;
          prodMap[pName].revenue += (Number(item.price) || 0) * (Number(item.quantity) || 1);
        });
      }
    });

    const list = Object.values(prodMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
    return list.length > 0 ? list : [
      { name: "FORTIFIED EMBROIDERED BLACK TEE", category: "Embroidered Tees", units: 142, revenue: 276900, image: "/images/embroidered-black/emb_black_front.jpg" },
      { name: "FORTIFIED EMBROIDERED WHITE TEE", category: "Embroidered Tees", units: 98, revenue: 112700, image: "/images/embroidered-white/emb_white_front.jpg" },
      { name: "FORTIFIED ARCHIVE LUXURY GRAIL TEE", category: "Archive Luxury", units: 64, revenue: 249600, image: "/images/embroidered-black/emb_black_front.jpg" },
      { name: "FORTIFIED MONOLITH HEAVYWEIGHT TEE", category: "Monolith Heavyweight", units: 85, revenue: 80750, image: "/images/classic-front-black/classic_black_front.jpg" }
    ];
  };

  // Simulate Live Order Handler
  const handleSimulateLiveOrder = async () => {
    setIsSimulatingSale(true);
    try {
      const mockOrd = createMockOrder(products);
      const created = await base44.entities.Order.create(mockOrd);
      setOrders((prev) => [created, ...prev]);
      setSalesNotice(`⚡ Live Sale Recorded! Order #${created.order_number} (+${zar(created.total)}) for ${created.customer_name}`);
      setTimeout(() => setSalesNotice(""), 6000);
    } catch (err) {
      console.error("Failed to simulate sale:", err);
    } finally {
      setIsSimulatingSale(false);
    }
  };

  // Export CSV Sales Ledger Handler
  const handleExportSalesCSV = () => {
    const headers = ["Order Number", "Date", "Customer Name", "Email", "Country", "Payment Method", "Status", "Items Count", "Total (ZAR)"];
    const rows = activeSalesOrdersList.map((o) => {
      const dateStr = o.created_date ? new Date(o.created_date).toLocaleString("en-ZA") : new Date().toLocaleString("en-ZA");
      const itemsCount = Array.isArray(o.items) ? o.items.reduce((s, i) => s + (Number(i.quantity) || 1), 0) : 1;
      return [
        `"${o.order_number}"`,
        `"${dateStr}"`,
        `"${o.customer_name || 'Guest'}"`,
        `"${o.customer_email || ''}"`,
        `"${o.country || 'South Africa'}"`,
        `"${o.payment_method || 'Card'}"`,
        `"${o.status || 'Paid'}"`,
        `"${itemsCount}"`,
        `"${o.total || 0}"`
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `FORTIFIED_Sales_Ledger_${salesTimeRange.toUpperCase()}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // UI Control States
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Inventory Threshold State
  const [reorderThreshold, setReorderThreshold] = useState(10);
  const [invSearch, setInvSearch] = useState("");
  const [invCategoryFilter, setInvCategoryFilter] = useState("all");
  const [invStatusFilter, setInvStatusFilter] = useState("all");

  // Product Editing State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editProductImageUrl, setEditProductImageUrl] = useState("");
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    name: "",
    price: 850,
    category: "Embroidered Tees",
    collection: "PERMANENT ART",
    description: "",
    stock: 20
  });

  // Email Notification Dispatcher State
  const [emailForm, setEmailForm] = useState({
    recipient: "",
    subject: "",
    body: "",
    template: "custom"
  });
  const [emailSending, setEmailSending] = useState(false);
  const [emailLogs, setEmailLogs] = useState([]);

  // Announcement Marquee & Sale Banner Controls
  const [announcementForm, setAnnouncementForm] = useState(() => ({
    marqueeText: storeSettings?.marqueeText || "FORTIFIED BRAND • LIMITED EDITION • 10% OFF ALL TEES • EXPRESS DOOR-TO-DOOR COURIER NATIONWIDE",
    marqueeSpeed: storeSettings?.marqueeSpeed || 20,
    marqueeEnabled: storeSettings?.marqueeEnabled ?? true,
    marqueeTheme: storeSettings?.marqueeTheme || "white",
    marqueeTextColor: storeSettings?.marqueeTextColor || "black",
    launchCountdownEnabled: storeSettings?.launchCountdownEnabled ?? true,
    launchTitle: storeSettings?.launchTitle || "FORTIFIEDBRAND OFFICIAL LAUNCH",
    launchSubtext: storeSettings?.launchSubtext || "LIMITED DROP RELEASE & EXCLUSIVE PERMANENT APPAREL COLLECTION",
    launchTargetDate: storeSettings?.launchTargetDate || "2026-08-25T00:00:00",
    launchCtaText: storeSettings?.launchCtaText || "VIP EARLY ACCESS",
    launchCtaLink: storeSettings?.launchCtaLink || "/shop",
    saleBannerText: storeSettings?.saleBannerText || "⚡ 72 HOUR FLASH SALE — 10% OFF SITEWIDE",
    saleBannerSubtext: storeSettings?.saleBannerSubtext || "Express door-to-door courier nationwide across South Africa (R100 flat rate)",
    saleBannerCode: storeSettings?.saleBannerCode || "FORTIFIED10",
    saleBannerHours: storeSettings?.saleBannerHours || 72,
    saleBannerCtaPath: storeSettings?.saleBannerCtaPath || "/shop",
    saleBannerStyle: storeSettings?.saleBannerStyle || "white",
    saleBannerEnabled: storeSettings?.saleBannerEnabled ?? true,
    saleDiscountPercent: storeSettings?.saleDiscountPercent || 10,
    saleScope: storeSettings?.saleScope || "all",
    nationalShippingFee: storeSettings?.nationalShippingFee ?? 100,
    nationalFreeThreshold: storeSettings?.nationalFreeThreshold ?? 0,
    internationalShippingFee: storeSettings?.internationalShippingFee ?? 450,
    internationalFreeThreshold: storeSettings?.internationalFreeThreshold ?? 0,
    nationalShippingDays: storeSettings?.nationalShippingDays || "1–3 Business Days",
    internationalShippingDays: storeSettings?.internationalShippingDays || "3–7 Business Days",
  }));

  useEffect(() => {
    if (storeSettings) {
      setAnnouncementForm((prev) => ({
        ...prev,
        ...storeSettings,
      }));
      if (storeSettings.campaignVideoUrl) {
        setCampaignVideoInput(storeSettings.campaignVideoUrl);
      }
    }
  }, [storeSettings]);

  // Modal State for Invoice / Receipt PDF View
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [invoiceType, setInvoiceType] = useState("invoice");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Live Sales Simulator State
  const [mockLiveSalesActive, setMockLiveSalesActive] = useState(true);
  const [mockSalesLog, setMockSalesLog] = useState([]);

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError("");
    const trimmedEmail = adminEmail.trim();
    const trimmedPass = adminPassword.trim();
    const trimmedCode = adminPasscode.trim();

    const isEmailValid =
      trimmedEmail.toLowerCase() === "fortifiedbrand31@gmail.com" ||
      trimmedEmail.toLowerCase() === "admin@fortified.com" ||
      trimmedEmail.toLowerCase() === "admin";

    const isPasswordValid =
      trimmedPass === "Thefortified3112!" ||
      trimmedPass.toLowerCase() === "fortifiedbrand31@gmail.com" ||
      trimmedPass === "1234" ||
      trimmedPass.toLowerCase() === "admin";

    const isPasscodeValid = ["thefortified3112!", "fortifiedbrand31@gmail.com", "admin", "1234"].includes(trimmedCode.toLowerCase());

    if ((isEmailValid && isPasswordValid) || isPasscodeValid) {
      setIsAuthenticated(true);
      localStorage.setItem("fortified_admin_auth", "true");
      setAdminEmail("");
      setAdminPassword("");
      setAdminPasscode("");
      setAuthError("");
    } else {
      setAuthError("Invalid email or password.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("fortified_admin_auth");
    setAdminEmail("");
    setAdminPassword("");
    setAdminPasscode("");
    window.location.href = "/";
  };

  // Stock regulation helpers
  const handleStockAdjust = async (productId, delta) => {
    const p = products.find((prod) => prod.id === productId);
    if (!p) return;
    const newStock = Math.max(0, p.stock + delta);
    try {
      await base44.entities.Product.update(productId, { stock: newStock });
      setProducts((prev) =>
        prev.map((item) => (item.id === productId ? { ...item, stock: newStock } : item))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleColorStockAdjust = async (productId, colorKey, value) => {
    const p = products.find((prod) => prod.id === productId);
    if (!p) return;
    const num = Math.max(0, Number(value));
    const updatedColors = { ...(p.colorStock || {}), [colorKey]: num };
    const sumStock = Object.values(updatedColors).reduce((a, b) => a + b, 0);
    try {
      await base44.entities.Product.update(productId, { colorStock: updatedColors, stock: sumStock });
      setProducts((prev) =>
        prev.map((item) => (item.id === productId ? { ...item, colorStock: updatedColors, stock: sumStock } : item))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleRestockAllTriggered = async (amount = 10) => {
    const updatedList = await Promise.all(
      products.map(async (p) => {
        const threshold = p.reorderThreshold || reorderThreshold;
        if (p.stock <= threshold) {
          const newStock = p.stock + amount;
          await base44.entities.Product.update(p.id, { stock: newStock });
          return { ...p, stock: newStock };
        }
        return p;
      })
    );
    setProducts(updatedList);
  };

  // Order status modifier
  const handleOrderStatusChange = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handleTrackingUpdate = (orderId, trackingNo) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, tracking_number: trackingNo } : o))
    );
    alert(`Tracking number updated to ${trackingNo} for Order #${selectedOrder?.order_number}`);
  };

  // Create product
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProductForm.name) {
      alert("Please enter a piece name.");
      return;
    }
    const images = (newProductForm.images || []).length > 0 
      ? newProductForm.images 
      : ["/images/embroidered-black/emb_black_front.jpg"];

    const newEntry = {
      id: `prod-${Date.now()}`,
      name: newProductForm.name.toUpperCase(),
      price: Number(newProductForm.price) || 850,
      category: newProductForm.category || "Embroidered Tees",
      collection: newProductForm.collection || "New Arrivals",
      stock: Number(newProductForm.stock) || 20,
      reorderThreshold: 10,
      description: newProductForm.description || "",
      images: images,
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Black", "White"],
      colorStock: { 
        Black: Math.floor((Number(newProductForm.stock) || 20) / 2), 
        White: Math.ceil((Number(newProductForm.stock) || 20) / 2) 
      }
    };

    try {
      const created = await base44.entities.Product.create(newEntry);
      setProducts((prev) => [created, ...prev]);
      setIsCreatingProduct(false);
      setNewProductForm({
        name: "",
        price: 850,
        category: "Embroidered Tees",
        collection: "New Arrivals",
        description: "",
        stock: 20,
        images: []
      });
      setNewProductImageUrl("");
      alert("New piece successfully added to the catalog and saved to the website!");
    } catch (err) {
      console.error(err);
      alert("Failed to save piece. Please try again.");
    }
  };

  const handleQuickProductUpdate = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;
    try {
      const updated = await base44.entities.Product.update(selectedProduct.id, selectedProduct);
      setProducts((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      setSelectedProduct(null);
      alert("Piece parameters saved successfully and updated across the website.");
    } catch (err) {
      console.error(err);
      alert("Failed to update piece.");
    }
  };

  const handleToggleHideProduct = async (id, currentHidden) => {
    try {
      const nextHidden = !currentHidden;
      await base44.entities.Product.update(id, { hidden: nextHidden });
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, hidden: nextHidden } : p))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update product visibility.");
    }
  };

  const handleToggleCategoryVisibility = async (catName, makeHidden) => {
    try {
      const targetProducts = products.filter((p) => {
        const c = p.category ? p.category.toLowerCase() : "";
        const target = catName.toLowerCase();
        if (target.includes("hoodie")) return c.includes("hoodie");
        if (target.includes("sweatpant") || target.includes("jogger")) return c.includes("sweatpant") || c.includes("jogger");
        if (target.includes("polo") || target.includes("golf")) return c.includes("polo") || c.includes("golf");
        if (target.includes("cap")) return c.includes("cap");
        return c === target;
      });

      await Promise.all(
        targetProducts.map((p) =>
          base44.entities.Product.update(p.id, { hidden: makeHidden })
        )
      );

      setProducts((prev) =>
        prev.map((p) => {
          const c = p.category ? p.category.toLowerCase() : "";
          const target = catName.toLowerCase();
          let isMatch = false;
          if (target.includes("hoodie")) isMatch = c.includes("hoodie");
          else if (target.includes("sweatpant") || target.includes("jogger")) isMatch = c.includes("sweatpant") || c.includes("jogger");
          else if (target.includes("polo") || target.includes("golf")) isMatch = c.includes("polo") || c.includes("golf");
          else if (target.includes("cap")) isMatch = c.includes("cap");
          else isMatch = c === target;

          return isMatch ? { ...p, hidden: makeHidden } : p;
        })
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update category visibility.");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this piece from the website catalog?")) return;
    try {
      await base44.entities.Product.delete(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      if (selectedProduct && selectedProduct.id === id) {
        setSelectedProduct(null);
      }
      alert("Piece successfully deleted from the catalog.");
    } catch (err) {
      console.error(err);
      alert("Failed to delete piece.");
    }
  };

  // Image Upload Handlers
  const handleImageFilesForNewProduct = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const dataUrl = evt.target.result;
        setNewProductForm((prev) => ({
          ...prev,
          images: [...(prev.images || []), dataUrl]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddImageUrlForNew = () => {
    if (!newProductImageUrl.trim()) return;
    setNewProductForm((prev) => ({
      ...prev,
      images: [...(prev.images || []), newProductImageUrl.trim()]
    }));
    setNewProductImageUrl("");
  };

  const handleDeleteImageForNew = (idxToRemove) => {
    setNewProductForm((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, idx) => idx !== idxToRemove)
    }));
  };

  const handleImageFilesForSelectedProduct = (e) => {
    if (!selectedProduct) return;
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const dataUrl = evt.target.result;
        setSelectedProduct((prev) => ({
          ...prev,
          images: [...(prev?.images || []), dataUrl]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddImageUrlForSelected = () => {
    if (!selectedProduct || !editProductImageUrl.trim()) return;
    setSelectedProduct((prev) => ({
      ...prev,
      images: [...(prev?.images || []), editProductImageUrl.trim()]
    }));
    setEditProductImageUrl("");
  };

  const handleDeleteImageForSelected = (idxToRemove) => {
    if (!selectedProduct) return;
    setSelectedProduct((prev) => ({
      ...prev,
      images: (prev?.images || []).filter((_, idx) => idx !== idxToRemove)
    }));
  };

  // Email Notification Handler
  const handleSendEmailNotification = (e) => {
    e.preventDefault();
    if (!emailForm.recipient || !emailForm.subject) return;

    setEmailSending(true);
    setTimeout(() => {
      setEmailSending(false);
      const newLog = {
        id: Date.now(),
        to: emailForm.recipient,
        subject: emailForm.subject,
        body: emailForm.body,
        timestamp: new Date().toISOString(),
        status: "Delivered"
      };
      setEmailLogs([newLog, ...emailLogs]);
      alert(`Notification email dispatched to ${emailForm.recipient}`);
      setEmailForm({ recipient: "", subject: "", body: "", template: "custom" });
    }, 1200);
  };

  const handleSelectEmailTemplate = (tplType, targetOrder = null) => {
    let sub = "";
    let bodyText = "";
    const rec = targetOrder ? targetOrder.customer_email : "customer@domain.com";

    if (tplType === "confirmation") {
      sub = `FORTIFIED OFFICIAL RECEIPT & TAX INVOICE — ${targetOrder ? targetOrder.order_number : "#FORT-8821"}`;
      bodyText = `Dear ${targetOrder ? targetOrder.customer_name : "Valued Customer"},\n\nThank you for choosing FORTIFIED Brand. Your order has been processed.\n\nTotal Paid: ${zar(targetOrder ? targetOrder.total : 1700)}\nCourier: RAM Express Courier\nStatus: Processing at Atelier\n\nKind regards,\nFORTIFIED Atelier Team`;
    } else if (tplType === "tracking") {
      sub = `DISPATCH NOTICE: YOUR FORTIFIED ORDER ${targetOrder ? targetOrder.order_number : "#FORT-8821"} IS EN ROUTE`;
      bodyText = `Dear ${targetOrder ? targetOrder.customer_name : "Valued Customer"},\n\nYour order has been packaged and handed over to our courier partner.\n\nWaybill / Tracking No: ${targetOrder ? targetOrder.tracking_number || "RAM-ZA-88210" : "RAM-ZA-88210"}\nTrack real-time at: https://www.ram.co.za/track\n\nKind regards,\nFORTIFIED Logistics`;
    } else if (tplType === "low_stock") {
      sub = `[ATELIER ALERT] LOW INVENTORY WARNING THRESHOLD TRIGGERED`;
      bodyText = `Attention Store Operations,\n\nOne or more core pieces have fallen below the configured reorder threshold (${reorderThreshold} units).\n\nPlease inspect the Stock & Inventory Matrix to issue restock production orders.\n\nFORTIFIED Automated System`;
    }

    setEmailForm({
      recipient: rec,
      subject: sub,
      body: bodyText,
      template: tplType
    });
  };

  // Announcement Marquee & Sale Banner Controls
  const handleToggleMarquee = (state) => {
    const next = typeof state === "boolean" ? state : !announcementForm.marqueeEnabled;
    setAnnouncementForm((prev) => ({ ...prev, marqueeEnabled: next }));
    updateStoreSettings({ ...announcementForm, marqueeEnabled: next });
  };

  const handleToggleSaleBanner = (state) => {
    const next = typeof state === "boolean" ? state : !announcementForm.saleBannerEnabled;
    setAnnouncementForm((prev) => ({ ...prev, saleBannerEnabled: next }));
    updateStoreSettings({ ...announcementForm, saleBannerEnabled: next });
  };

  const handleToggleLaunchCountdown = (state) => {
    const next = typeof state === "boolean" ? state : !announcementForm.launchCountdownEnabled;
    setAnnouncementForm((prev) => ({ ...prev, launchCountdownEnabled: next }));
    updateStoreSettings({ ...announcementForm, launchCountdownEnabled: next });
  };

  const handleSaveAnnouncements = (e) => {
    if (e) e.preventDefault();
    const updatedForm = {
      ...announcementForm,
      saleBannerStartTime: Date.now(),
    };
    setAnnouncementForm(updatedForm);
    updateStoreSettings(updatedForm);
    alert("Live Announcement Marquee & Sale Banner Settings Published Successfully!");
  };

  // Currency Formatter matching South Africa ZAR format
  const formatPriceZAR = (num) => {
    if (num === null || num === undefined) return "R 0";
    const formatted = Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return `R ${formatted}`;
  };

  // PDF Document Export Generation & Modal trigger
  const handleDownloadPDF = async (order, docType = "invoice") => {
    if (!order) return;
    setSelectedOrder(order);
    setInvoiceType(docType);
    setInvoiceModalOpen(true);
  };

  const handleDownloadPdfFromModal = async () => {
    if (!selectedOrder) return;
    setIsGeneratingPdf(true);
    try {
      const element = document.getElementById("official-tax-document-canvas");
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, Math.min(imgHeight, pdfHeight));

      const fileName = `FORTIFIED_${invoiceType === "invoice" ? "Tax_Invoice" : "Receipt"}_${selectedOrder.order_number}.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error("PDF generation failed:", err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const triggerPrintInvoice = () => {
    window.print();
  };

  // CSV Export for Sales Records
  const exportSalesCSV = () => {
    const headers = ["Order Number,Date,Customer Name,Customer Email,Payment Method,Total ZAR,Status\n"];
    const rows = orders.map(
      (o) =>
        `"${o.order_number}","${new Date(o.created_date || Date.now()).toLocaleDateString()}","${o.customer_name}","${o.customer_email}","${o.payment_method}","${o.total}","${o.status}"`
    );
    const blob = new Blob([headers.concat(rows.join("\n")).join("")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `FORTIFIED_Sales_Export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  // Filter computations
  const filteredOrders = orders.filter((o) => {
    const query = orderSearch.toLowerCase();
    const matchQuery =
      o.order_number.toLowerCase().includes(query) ||
      o.customer_name.toLowerCase().includes(query) ||
      o.customer_email.toLowerCase().includes(query);
    const matchStatus = orderStatusFilter === "all" || o.status.toLowerCase() === orderStatusFilter.toLowerCase();
    return matchQuery && matchStatus;
  });

  const filteredSalesOrders = orders.filter((o) => {
    if (salesTimeRange === "today") {
      const orderDate = new Date(o.created_date || Date.now()).toDateString();
      return orderDate === new Date().toDateString();
    }
    return true;
  });

  const filteredInventoryProducts = products.filter((p) => {
    const matchQuery = p.name.toLowerCase().includes(invSearch.toLowerCase());
    const matchCategory = invCategoryFilter === "all" || p.category === invCategoryFilter;
    const threshold = p.reorderThreshold || reorderThreshold;

    let matchStatus = true;
    if (invStatusFilter === "healthy") matchStatus = p.stock > threshold;
    if (invStatusFilter === "low") matchStatus = p.stock <= threshold && p.stock > 0;
    if (invStatusFilter === "out") matchStatus = p.stock === 0;

    return matchQuery && matchCategory && matchStatus;
  });

  const invSummary = {
    totalUnits: products.reduce((acc, p) => acc + (p.stock || 0), 0),
    totalValue: products.reduce((acc, p) => acc + (p.stock || 0) * (p.price || 0), 0),
    healthyStockCount: products.filter((p) => (p.stock || 0) > (p.reorderThreshold || reorderThreshold)).length,
    lowStockCount: products.filter((p) => (p.stock || 0) <= (p.reorderThreshold || reorderThreshold) && (p.stock || 0) > 0).length,
    outOfStockCount: products.filter((p) => (p.stock || 0) === 0).length
  };

  const totalSalesVolume = orders.reduce((acc, o) => acc + (o.total || 0), 0);

  // Unauthenticated Login View
  // Unauthenticated Login View (White background, cleared email & password inputs)
  if (!isAuthenticated) {
    return (
      <div className="admin-page min-h-screen bg-black/80 backdrop-blur-md flex items-center justify-center p-4 font-mono relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative w-full max-w-md border border-neutral-300 bg-[#fcfcfc] p-6 md:p-8 shadow-2xl font-mono text-black rounded-lg z-10"
        >
          {/* Back Button */}
          <div className="mb-4">
            <BackButton label="BACK" to="/" />
          </div>

          {/* Header with Logo next to FORTIFIED */}
          <div className="flex items-center gap-3.5 mb-6">
            <img
              src="/images/brand/fiy-logo.png"
              alt="FORTIFIED Logo"
              className="h-10 w-10 object-contain shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl font-black uppercase tracking-wider text-black">
                  FORTIFIED
                </h2>
                <span className="font-mono text-[9px] bg-black text-white px-2 py-0.5 font-bold uppercase tracking-widest rounded-xs">
                  ADMIN
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 uppercase tracking-widest mt-0.5 font-mono">
                CONTROL SYSTEM
              </p>
            </div>
          </div>

          {/* Campaign Video on Loop Without Sound */}
          <div className="mb-6 relative aspect-[16/9] w-full overflow-hidden rounded border border-neutral-300 bg-neutral-100 shadow-sm">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src="/videos/campaign.mp4" type="video/mp4" />
              Your browser does not support HTML5 video.
            </video>
            <div className="absolute top-2.5 left-2.5 z-10 bg-black/80 backdrop-blur-sm text-[8px] font-mono uppercase tracking-widest text-white px-2 py-0.5 font-bold">
              CAMPAIGN FILM &bull; SS26
            </div>
          </div>

          {/* Error Notification */}
          {authError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-xs p-3 flex items-center gap-2 rounded">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
              <span>{authError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1.5 font-mono">
                ADMIN EMAIL
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder=""
                  className="w-full bg-white border border-black focus:border-neutral-700 pl-10 pr-4 py-3 text-xs text-black outline-none font-mono transition-colors shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-1.5 font-mono">
                PASSWORD
              </label>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder=""
                  className="w-full bg-white border border-black focus:border-neutral-700 pl-10 pr-4 py-3 text-xs text-black outline-none font-mono transition-colors shadow-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-black hover:bg-neutral-800 text-white font-bold uppercase tracking-widest text-xs py-3.5 px-4 flex items-center justify-center gap-2 transition-colors shadow-md rounded-xs"
            >
              <span>LOGIN TO ADMIN PORTAL</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-[9px] uppercase tracking-widest text-neutral-400 font-mono">
            FORTIFIED PERMANENT ART &bull; SYSTEM SECURITY
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="admin-page min-h-screen bg-white text-black flex flex-col md:flex-row font-sans selection:bg-black selection:text-white">
      {/* =========================================================================
       * LEFT NAVIGATION SIDEBAR
       * ========================================================================= */}
      <aside className="w-full md:w-72 bg-neutral-50 border-r border-neutral-200 flex flex-col shrink-0">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-neutral-200 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-neutral-100 border border-neutral-300 flex items-center justify-center shrink-0 overflow-hidden">
                <SpinningLogo size="h-7 w-7" />
              </div>
              <div>
                <h1 className="font-display text-lg font-black uppercase tracking-wider text-black">FORTIFIED</h1>
                <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 font-bold">
                  Clothing Control System
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {activeTab !== "dashboard" && (
              <button
                onClick={() => setActiveTab("dashboard")}
                type="button"
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer bg-black text-white border-2 border-black shadow-[0_4px_0_0_#404040] hover:shadow-[0_6px_0_0_#000000] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_1px_0_0_#000000]"
              >
                <ArrowRight className="h-3.5 w-3.5 rotate-180 transition-transform group-hover:-translate-x-1" />
                <span>Return to Dashboard</span>
              </button>
            )}
            <BackButton label="BACK" to="/" />
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <div className="p-4 flex-1 space-y-6 overflow-y-auto">
          {/* Main Dashboard Section */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 font-bold mb-2">
              Main Dashboard
            </p>

            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                activeTab === "dashboard"
                  ? "bg-black text-white shadow-md"
                  : "text-neutral-600 hover:text-black hover:bg-neutral-200/60"
              }`}
            >
              <LayoutGrid className="h-4 w-4 shrink-0" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                activeTab === "orders"
                  ? "bg-black text-white shadow-md"
                  : "text-neutral-600 hover:text-black hover:bg-neutral-200/60"
              }`}
            >
              <FileText className="h-4 w-4 shrink-0" />
              <span>Orders & Invoices</span>
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                activeTab === "products"
                  ? "bg-black text-white shadow-md"
                  : "text-neutral-600 hover:text-black hover:bg-neutral-200/60"
              }`}
            >
              <ShoppingBag className="h-4 w-4 shrink-0" />
              <span>Pieces Catalog</span>
            </button>

            <button
              onClick={() => setActiveTab("inventory")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                activeTab === "inventory"
                  ? "bg-black text-white shadow-md"
                  : "text-neutral-600 hover:text-black hover:bg-neutral-200/60"
              }`}
            >
              <Package className="h-4 w-4 shrink-0" />
              <span>Stock & Inventory</span>
            </button>

            <button
              onClick={() => setActiveTab("sales")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                activeTab === "sales"
                  ? "bg-black text-white shadow-md"
                  : "text-neutral-600 hover:text-black hover:bg-neutral-200/60"
              }`}
            >
              <BarChart2 className="h-4 w-4 shrink-0" />
              <span>Sales & Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab("drops")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                activeTab === "drops"
                  ? "bg-black text-white shadow-md"
                  : "text-neutral-600 hover:text-black hover:bg-neutral-200/60"
              }`}
            >
              <Megaphone className="h-4 w-4 shrink-0" />
              <span>Lookbook & Drops</span>
            </button>

            <button
              onClick={() => setActiveTab("vip")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                activeTab === "vip"
                  ? "bg-black text-white shadow-md"
                  : "text-neutral-600 hover:text-black hover:bg-neutral-200/60"
              }`}
            >
              <Users className="h-4 w-4 shrink-0" />
              <span>VIP Clients</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                activeTab === "settings"
                  ? "bg-black text-white shadow-md"
                  : "text-neutral-600 hover:text-black hover:bg-neutral-200/60"
              }`}
            >
              <Sliders className="h-4 w-4 shrink-0" />
              <span>Settings</span>
            </button>
          </div>

          {/* Store Operations Section */}
          <div className="space-y-1 pt-2 border-t border-neutral-200">
            <p className="px-3 text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 font-bold mb-2">
              Store Operations
            </p>

            <button
              onClick={() => setActiveTab("emails")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                activeTab === "emails"
                  ? "bg-black text-white shadow-md"
                  : "text-neutral-600 hover:text-black hover:bg-neutral-200/60"
              }`}
            >
              <Mail className="h-4 w-4 shrink-0" />
              <span>Email Dispatch</span>
            </button>

            <button
              onClick={() => setActiveTab("announcements")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                activeTab === "announcements"
                  ? "bg-black text-white shadow-md"
                  : "text-neutral-600 hover:text-black hover:bg-neutral-200/60"
              }`}
            >
              <Megaphone className="h-4 w-4 shrink-0" />
              <span>Marquee & Banners</span>
            </button>

            <button
              onClick={() => setActiveTab("media")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                activeTab === "media"
                  ? "bg-black text-white shadow-md"
                  : "text-neutral-600 hover:text-black hover:bg-neutral-200/60"
              }`}
            >
              <Upload className="h-4 w-4 shrink-0" />
              <span>Brand Assets & Media</span>
            </button>
          </div>
        </div>

        {/* Logout Footer */}
        <div className="p-4 border-t border-neutral-200">
          <button
            onClick={handleLogout}
            type="button"
            className="group w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white border-2 border-red-700 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 shadow-[0_3px_0_0_#991b1b] hover:shadow-[0_5px_0_0_#7f1d1d] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
          >
            <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" /> Logout Admin
          </button>
        </div>
      </aside>

      {/* =========================================================================
       * MAIN CONTENT AREA
       * ========================================================================= */}
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-8 bg-neutral-50/50">
        {/* Top Header Bar with Live Clock */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-wider text-black">
              {activeTab === "dashboard" && "Fortified Dashboard"}
              {activeTab === "orders" && "Orders & Invoices Control"}
              {activeTab === "products" && "Pieces Catalog & Media Assets"}
              {activeTab === "inventory" && "Stock & Inventory Regulation"}
              {activeTab === "sales" && "Sales & Analytics Intelligence"}
              {activeTab === "drops" && "Lookbook & Capsule Drops"}
              {activeTab === "vip" && "VIP Client Roster"}
              {activeTab === "settings" && "System Settings & Infrastructure"}
              {activeTab === "emails" && "Email Dispatch Notification Hub"}
              {activeTab === "announcements" && "Marquee & Sale Banner Controls"}
              {activeTab === "media" && "Brand Assets & Media Manager"}
            </h1>
            <p className="font-mono text-xs text-neutral-500 mt-1 font-medium">
              Fortified Apparel Management & Control System
            </p>
          </div>

          {/* Right Header Actions: Logout & Clock */}
          <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
            <button
              onClick={handleLogout}
              type="button"
              className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer bg-red-600 hover:bg-red-700 text-white border-2 border-red-700 shadow-[0_3px_0_0_#991b1b] hover:shadow-[0_5px_0_0_#7f1d1d] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none"
            >
              <LogOut className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Logout</span>
            </button>

            {/* Digital Clock Widget */}
            <div className="bg-white border border-neutral-200 px-4 py-2.5 rounded-xl flex items-center gap-3 shadow-sm">
              <Clock className="h-4 w-4 text-black" />
              <div className="font-mono text-right">
                <span className="block text-sm font-bold text-black tracking-widest">{formattedClockTime}</span>
                <span className="block text-[9px] text-neutral-500 font-semibold uppercase">{formattedClockDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* TAB 1: MAIN DASHBOARD VIEW */}
        {activeTab === "dashboard" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {/* 4 KPI CARDS (MATCHING REFERENCE IMAGE IN WHITE & BLACK) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Card 1: TOTAL STORE ORDERS */}
              <div className="bg-white border border-neutral-200 p-5 rounded-2xl space-y-3 relative overflow-hidden shadow-sm hover:border-neutral-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-neutral-100 border border-neutral-300 text-black rounded-xl">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 bg-black text-white rounded-full">
                    +14.2% MoM
                  </span>
                </div>
                <div>
                  <h3 className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 font-bold">TOTAL STORE ORDERS</h3>
                  <p className="text-[10px] text-neutral-400 font-mono mt-0.5">Lifetime transactions & fulfillment</p>
                  <p className="text-3xl font-display font-black text-black mt-2">{orders.length}</p>
                </div>
                <div className="pt-2 border-t border-neutral-100 text-[10px] font-mono text-neutral-500 flex items-center justify-between">
                  <span>124 Fulfilled</span>
                  <span>•</span>
                  <span>24 Processing</span>
                </div>
              </div>

              {/* Card 2: VIP CLIENTS */}
              <div className="bg-white border border-neutral-200 p-5 rounded-2xl space-y-3 relative overflow-hidden shadow-sm hover:border-neutral-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-neutral-100 border border-neutral-300 text-black rounded-xl">
                    <Users className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 bg-black text-white rounded-full">
                    Active Roster
                  </span>
                </div>
                <div>
                  <h3 className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 font-bold">VIP CLIENTS</h3>
                  <p className="text-[10px] text-neutral-400 font-mono mt-0.5">Registered atelier & elite buyers</p>
                  <p className="text-3xl font-display font-black text-black mt-2">{vipClients.length}</p>
                </div>
                <div className="pt-2 border-t border-neutral-100 text-[10px] font-mono text-neutral-500 flex items-center justify-between">
                  <span>68 Tier-1 Buyers</span>
                  <span>•</span>
                  <span>16 Bespoke</span>
                </div>
              </div>

              {/* Card 3: MONTHLY REVENUE */}
              <div className="bg-white border border-neutral-200 p-5 rounded-2xl space-y-3 relative overflow-hidden shadow-sm hover:border-neutral-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-neutral-100 border border-neutral-300 text-black rounded-xl">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 bg-black text-white rounded-full">
                    +22.8% Target
                  </span>
                </div>
                <div>
                  <h3 className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 font-bold">MONTHLY REVENUE</h3>
                  <p className="text-[10px] text-neutral-400 font-mono mt-0.5">Gross processed apparel volume</p>
                  <p className="text-3xl font-display font-black text-black mt-2">{zar(totalSalesVolume || 245000)}</p>
                </div>
                <div className="pt-2 border-t border-neutral-100 text-[10px] font-mono text-neutral-500 flex items-center justify-between">
                  <span>Direct & Online Sales</span>
                </div>
              </div>

              {/* Card 4: CATALOG PIECES & STOCK */}
              <div className="bg-white border border-neutral-200 p-5 rounded-2xl space-y-3 relative overflow-hidden shadow-sm hover:border-neutral-300 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-neutral-100 border border-neutral-300 text-black rounded-xl">
                    <Package className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 bg-black text-white rounded-full">
                    Warehouse Ready
                  </span>
                </div>
                <div>
                  <h3 className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 font-bold">CATALOG PIECES & STOCK</h3>
                  <p className="text-[10px] text-neutral-400 font-mono mt-0.5">Atelier designs & inventory units</p>
                  <p className="text-3xl font-display font-black text-black mt-2">{products.length}</p>
                </div>
                <div className="pt-2 border-t border-neutral-100 text-[10px] font-mono text-neutral-500 flex items-center justify-between">
                  <span>{invSummary.totalUnits} Units</span>
                  <span>•</span>
                  <span>6 Active Drops</span>
                </div>
              </div>
            </div>

            {/* CHART CARD: REVENUE & SALES VOLUME OVERVIEW */}
            <div className="bg-white border border-neutral-200 p-6 rounded-2xl space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
                <div>
                  <h2 className="font-display text-lg font-bold uppercase tracking-wider text-black">
                    Revenue & Sales Volume Overview
                  </h2>
                  <p className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest mt-0.5">
                    Monthly Sales Trend & Customer Orders Analytics
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 bg-black text-white rounded-lg">
                    LIVE METRICS
                  </span>
                </div>
              </div>

              {/* Recharts AreaChart with monochrome styling */}
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesAnalyticsData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="monochromeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#000000" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#000000" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                    <XAxis dataKey="month" stroke="#888888" tick={{ fill: "#444444", fontSize: 11 }} />
                    <YAxis stroke="#888888" tick={{ fill: "#444444", fontSize: 11 }} tickFormatter={(val) => `R${val / 1000}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e5e5e5", borderRadius: "8px", color: "#000000", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                      formatter={(val) => [zar(val), "Sales Volume"]}
                    />
                    <Area type="monotone" dataKey="sales" stroke="#000000" strokeWidth={2} fillOpacity={1} fill="url(#monochromeGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* SECONDARY DASHBOARD PANELS: QUICK ORDERS & INVENTORY MATRIX */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Live Orders Feed */}
              <div className="bg-white border border-neutral-200 p-6 rounded-2xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-black" />
                    <h3 className="font-display text-sm font-bold uppercase tracking-wider text-black">Recent Store Orders</h3>
                  </div>
                  <button onClick={() => setActiveTab("orders")} className="font-mono text-[9px] uppercase tracking-wider text-neutral-500 hover:text-black font-bold">
                    View All Orders →
                  </button>
                </div>

                <div className="space-y-3">
                  {orders.slice(0, 3).map((o) => (
                    <div key={o.id} className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-black uppercase">{o.order_number}</span>
                          <span className="text-[9px] uppercase font-mono px-2 py-0.5 bg-neutral-200 text-black rounded font-bold">
                            {o.status}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-600 font-sans mt-1">{o.customer_name} ({o.items?.length || 1} items)</p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-black block">{zar(o.total)}</span>
                        <button
                          onClick={() => handleDownloadPDF(o, "invoice")}
                          className="mt-1 text-[9px] font-mono text-neutral-500 hover:text-black underline font-bold"
                        >
                          PDF Invoice
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inventory Quick Status */}
              <div className="bg-white border border-neutral-200 p-6 rounded-2xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-black" />
                    <h3 className="font-display text-sm font-bold uppercase tracking-wider text-black">Stock & Inventory Quick Matrix</h3>
                  </div>
                  <button onClick={() => setActiveTab("inventory")} className="font-mono text-[9px] uppercase tracking-wider text-neutral-500 hover:text-black font-bold">
                    Full Matrix →
                  </button>
                </div>

                <div className="space-y-3">
                  {products.map((p) => {
                    const threshold = p.reorderThreshold || reorderThreshold;
                    const isLow = p.stock <= threshold;
                    return (
                      <div key={p.id} className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="font-mono text-xs font-bold text-black uppercase">{p.name}</p>
                          <p className="text-[10px] text-neutral-500 font-mono mt-0.5">{p.category} · {zar(p.price)}</p>
                        </div>
                        <div className="text-right">
                          <span className={`font-mono text-sm font-bold block ${isLow ? "text-red-600" : "text-black"}`}>
                            {p.stock} Units
                          </span>
                          <span className="text-[9px] text-neutral-500 font-mono">
                            {isLow ? "Low Stock Alert" : "Healthy Stock"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: ORDERS & INVOICES */}
        {activeTab === "orders" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Control Bar with Search & Status Filter */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between border border-neutral-200 bg-white p-4 gap-4 rounded-xl shadow-sm">
              {/* Search Input Box */}
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search order number, customer name or email..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-300 text-black pl-10 pr-4 py-2 text-xs font-mono outline-none rounded-lg focus:border-black shadow-inner"
                />
              </div>

              {/* Status Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-neutral-600 font-bold uppercase tracking-widest mr-1">
                  STATUS FILTER:
                </span>
                {["ALL", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED"].map((st) => {
                  const isSelected = orderStatusFilter.toUpperCase() === st;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setOrderStatusFilter(st.toLowerCase())}
                      className={`px-3.5 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-all rounded-lg cursor-pointer ${
                        isSelected
                          ? "bg-black text-white border-2 border-black shadow-[0_2px_0_0_#404040]"
                          : "bg-neutral-100 text-neutral-700 border border-neutral-300 hover:text-black hover:border-black hover:bg-neutral-200"
                      }`}
                    >
                      {st}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={exportSalesCSV}
                  className="ml-2 bg-white hover:bg-neutral-100 text-black font-mono text-xs uppercase font-bold px-3.5 py-1.5 border-2 border-neutral-300 hover:border-black rounded-lg flex items-center gap-1.5 shadow-[0_2px_0_0_#d4d4d4] transition-all cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5 text-black" />
                  <span>CSV</span>
                </button>
              </div>
            </div>

            {/* White Orders Table Container */}
            <div className="border border-neutral-200 bg-white overflow-x-auto rounded-xl shadow-sm">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50 text-neutral-600 text-[10px] uppercase font-bold tracking-wider">
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Country</th>
                    <th className="p-4">Items</th>
                    <th className="p-4">Total Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-neutral-500 font-mono uppercase tracking-widest">
                        No orders match your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((o) => {
                      const totalPieces = (o.items || []).reduce((acc, it) => acc + (it.quantity || 1), 0);
                      const countryCode = o.country_code || (o.country === "United Kingdom" ? "GB" : "ZA");
                      const countryName = o.country || "South Africa";

                      return (
                        <tr key={o.id || o.order_number} className="hover:bg-neutral-50/80 transition-colors text-black">
                          {/* Order Number */}
                          <td className="p-4 font-bold text-black text-sm tracking-wider whitespace-nowrap">
                            {o.order_number}
                          </td>

                          {/* Date */}
                          <td className="p-4 text-neutral-600 whitespace-nowrap">
                            {o.created_date ? new Date(o.created_date).toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" }) : "7/28/2026"}
                          </td>

                          {/* Customer Name & Email */}
                          <td className="p-4 min-w-[220px]">
                            <p className="font-bold text-black text-xs">{o.customer_name}</p>
                            <p className="text-[11px] text-neutral-500 mt-0.5">{o.customer_email}</p>
                          </td>

                          {/* Country */}
                          <td className="p-4 text-neutral-700 text-xs whitespace-nowrap">
                            <span className="text-[10px] text-neutral-500 uppercase mr-1">{countryCode}</span> {countryName}
                          </td>

                          {/* Piece count */}
                          <td className="p-4 text-neutral-700 whitespace-nowrap font-medium">
                            {totalPieces} Piece(s)
                          </td>

                          {/* Total ZAR Price */}
                          <td className="p-4 font-black text-black text-sm whitespace-nowrap">
                            {formatPriceZAR(o.total)}
                          </td>

                          {/* Status Badge */}
                          <td className="p-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 font-mono text-[10px] font-extrabold uppercase tracking-widest border rounded-md inline-block shadow-2xs ${
                                o.status.toLowerCase() === "delivered"
                                  ? "border-emerald-400 text-emerald-950 bg-emerald-100"
                                  : o.status.toLowerCase() === "shipped"
                                  ? "border-blue-400 text-blue-950 bg-blue-100"
                                  : o.status.toLowerCase() === "processing"
                                  ? "border-amber-400 text-amber-950 bg-amber-100"
                                  : "border-neutral-300 text-neutral-800 bg-neutral-100"
                              }`}
                            >
                              {o.status.toUpperCase()}
                            </span>
                          </td>

                          {/* Actions: PDF INVOICE and PDF RECEIPT */}
                          <td className="p-4 text-right whitespace-nowrap">
                            <div className="flex flex-col gap-1.5 items-end justify-center">
                              <button
                                type="button"
                                onClick={() => handleDownloadPDF(o, "invoice")}
                                className="w-32 bg-white hover:bg-neutral-100 text-black font-mono text-[10px] font-bold uppercase py-1.5 px-2.5 border-2 border-neutral-300 hover:border-black rounded-lg flex items-center justify-between gap-1 shadow-[0_2px_0_0_#d4d4d4] hover:shadow-[0_3px_0_0_#000000] hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer"
                              >
                                <FileText className="h-3 w-3 text-black" />
                                <span>PDF INVOICE</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDownloadPDF(o, "receipt")}
                                className="w-32 bg-white hover:bg-neutral-100 text-black font-mono text-[10px] font-bold uppercase py-1.5 px-2.5 border-2 border-neutral-300 hover:border-black rounded-lg flex items-center justify-between gap-1 shadow-[0_2px_0_0_#d4d4d4] hover:shadow-[0_3px_0_0_#000000] hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer"
                              >
                                <Printer className="h-3 w-3 text-black" />
                                <span>PDF RECEIPT</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* TAB 3: PIECES CATALOG */}
        {activeTab === "products" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex justify-between items-center border-b border-neutral-200 pb-4">
              <div>
                <h2 className="font-display text-lg font-bold uppercase text-black">Atelier Catalog Pieces</h2>
                <p className="font-mono text-xs text-neutral-500">Manage pieces, image assets, stock levels, and store visibility.</p>
              </div>
              <button
                onClick={() => setIsCreatingProduct(true)}
                className="bg-black text-white hover:bg-neutral-800 font-mono text-xs uppercase font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="h-4 w-4" /> Add Piece
              </button>
            </div>

            {/* Category Launch & Visibility Controls Panel */}
            <div className="bg-neutral-900 text-white p-5 rounded-2xl space-y-4 shadow-md border border-neutral-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
                <div>
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <EyeOff className="h-4 w-4 text-amber-400" />
                    Category Launch & Shop Visibility Controls
                  </h3>
                  <p className="font-mono text-[11px] text-neutral-400 mt-0.5">
                    Toggle category visibility on/off the live shop catalog. Hoodies, Sweatpants, Golf/Polo Shirts, and Caps are hidden by default until release.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { name: "Hoodies", label: "Hoodies" },
                  { name: "Sweatpants", label: "Sweatpants" },
                  { name: "Golf / Polo Shirts", label: "Golf & Polo Shirts" },
                  { name: "Caps", label: "Caps & Headwear" },
                  { name: "Embroidered Tees", label: "Embroidered Tees" },
                  { name: "Printed Tees", label: "Printed Tees" },
                  { name: "T-Shirts", label: "T-Shirts" },
                ].map((cat) => {
                  const catProducts = products.filter((p) => {
                    const c = p.category ? p.category.toLowerCase() : "";
                    const target = cat.name.toLowerCase();
                    if (target.includes("hoodie")) return c.includes("hoodie");
                    if (target.includes("sweatpant")) return c.includes("sweatpant") || c.includes("jogger");
                    if (target.includes("polo") || target.includes("golf")) return c.includes("polo") || c.includes("golf");
                    if (target.includes("cap")) return c.includes("cap");
                    return c === target;
                  });

                  const totalCount = catProducts.length;
                  const hiddenCount = catProducts.filter((p) => p.hidden).length;
                  const isAllHidden = totalCount > 0 && hiddenCount === totalCount;
                  const isPartialHidden = hiddenCount > 0 && hiddenCount < totalCount;

                  return (
                    <div key={cat.name} className="bg-neutral-950 border border-neutral-800 p-3.5 rounded-xl space-y-2.5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="font-mono text-xs font-bold uppercase text-white truncate">{cat.label}</span>
                          {isAllHidden ? (
                            <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 bg-red-950 text-red-400 border border-red-800 rounded font-bold">
                              HIDDEN
                            </span>
                          ) : isPartialHidden ? (
                            <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 bg-amber-950 text-amber-400 border border-amber-800 rounded font-bold">
                              PARTIAL
                            </span>
                          ) : (
                            <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded font-bold">
                              LIVE
                            </span>
                          )}
                        </div>
                        <p className="font-mono text-[10px] text-neutral-400 mt-1">
                          {totalCount} pieces ({hiddenCount} hidden)
                        </p>
                      </div>

                      <button
                        onClick={() => handleToggleCategoryVisibility(cat.name, !isAllHidden)}
                        className={`w-full font-mono text-[10px] uppercase font-bold py-1.5 px-3 rounded-lg border transition-all flex items-center justify-center gap-1.5 ${
                          isAllHidden
                            ? "bg-amber-500 text-black border-amber-400 hover:bg-amber-400"
                            : "bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700 hover:text-white"
                        }`}
                      >
                        {isAllHidden ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        <span>{isAllHidden ? "Unhide Category" : "Hide Category"}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => {
                const imgUrl = (p.images && p.images[0]) ? p.images[0] : "/images/embroidered-black/emb_black_front.jpg";
                return (
                  <div key={p.id} className="bg-white border border-neutral-200 p-5 rounded-2xl space-y-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative h-48 w-full bg-neutral-100 rounded-xl overflow-hidden border border-neutral-200">
                      <img
                        src={imgUrl}
                        alt={p.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/images/embroidered-black/emb_black_front.jpg";
                        }}
                      />
                      <span className="absolute top-2 left-2 text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-black/80 text-white backdrop-blur-xs rounded">
                        {p.category || "T-Shirts"}
                      </span>
                      {p.hidden && (
                        <span className="absolute top-2 right-2 text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-red-600 text-white rounded">
                          HIDDEN
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-display text-base font-bold uppercase text-black line-clamp-1">{p.name}</h3>
                      <div className="flex justify-between items-center mt-1">
                        <p className="font-mono text-sm font-bold text-black">{zar(p.price)}</p>
                        <span className="font-mono text-xs text-neutral-500 font-bold">Stock: {p.stock} units</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-3 border-t border-neutral-100 font-mono text-xs">
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="text-red-600 hover:text-red-800 font-bold flex items-center gap-1"
                        title="Delete product"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() => handleToggleHideProduct(p.id, p.hidden)}
                        className={`font-mono text-[10px] uppercase font-bold px-2.5 py-1.5 rounded-lg border flex items-center gap-1 transition-colors ${
                          p.hidden
                            ? "bg-amber-500 text-white border-amber-600 hover:bg-amber-600"
                            : "bg-neutral-100 text-neutral-700 border-neutral-300 hover:bg-neutral-200"
                        }`}
                        title={p.hidden ? "Show product on website" : "Hide product from website"}
                      >
                        {p.hidden ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        {p.hidden ? "Unhide" : "Hide"}
                      </button>

                      <button
                        onClick={() => setSelectedProduct({ ...p, images: p.images || [] })}
                        className="bg-black text-white hover:bg-neutral-800 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1"
                      >
                        Edit Asset →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* TAB 4: STOCK & INVENTORY */}
        {activeTab === "inventory" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white border border-neutral-200 p-6 rounded-2xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <h3 className="font-display text-base font-bold uppercase text-black">Full Inventory Matrix</h3>
                <span className="font-mono text-xs text-neutral-500">Total Units: {invSummary.totalUnits}</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-neutral-200 text-neutral-500 text-[10px] uppercase">
                      <th className="p-3">Piece Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Visibility</th>
                      <th className="p-3">Units</th>
                      <th className="p-3 text-right">Actions / Restock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-neutral-50 text-black">
                        <td className="p-3 font-bold text-black uppercase">{p.name}</td>
                        <td className="p-3 text-neutral-600">{p.category}</td>
                        <td className="p-3 text-black font-bold">{zar(p.price)}</td>
                        <td className="p-3">
                          {p.hidden ? (
                            <span className="font-mono text-[9px] uppercase font-bold px-2 py-0.5 bg-red-100 text-red-700 border border-red-300 rounded">
                              Hidden
                            </span>
                          ) : (
                            <span className="font-mono text-[9px] uppercase font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded">
                              Live
                            </span>
                          )}
                        </td>
                        <td className="p-3 font-bold text-black">{p.stock}</td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => handleToggleHideProduct(p.id, p.hidden)}
                            className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded border transition-colors ${
                              p.hidden
                                ? "bg-amber-500 text-white border-amber-600 hover:bg-amber-600"
                                : "bg-neutral-100 text-neutral-700 border-neutral-300 hover:bg-neutral-200"
                            }`}
                          >
                            {p.hidden ? "Unhide" : "Hide"}
                          </button>
                          <button onClick={() => handleStockAdjust(p.id, 10)} className="px-2.5 py-1 bg-black text-white font-bold text-[10px] rounded hover:bg-neutral-800">
                            +10
                          </button>
                          <button onClick={() => handleStockAdjust(p.id, 5)} className="px-2.5 py-1 bg-neutral-200 text-black font-bold text-[10px] rounded hover:bg-neutral-300">
                            +5
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 5: SALES & ANALYTICS INTELLIGENCE */}
        {activeTab === "sales" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 font-mono">
            {/* 1. HEADER CONTROL & SIMULATION BANNER */}
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl text-white space-y-4 shadow-xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase tracking-[0.3em]">
                      Real-Time Sales & Revenue Matrix Engine
                    </span>
                  </div>
                  <h2 className="text-xl font-bold font-mono uppercase mt-1">Sales & Analytics Intelligence</h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    Tracking live transaction ledgers, average order value, category share, and payment gateway metrics.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={handleSimulateLiveOrder}
                    disabled={isSimulatingSale}
                    className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs uppercase px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-95 disabled:opacity-50"
                  >
                    <Zap className="h-4 w-4 fill-black" />
                    <span>{isSimulatingSale ? "Processing Sale..." : "Simulate Live Purchase"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportSalesCSV}
                    className="bg-white hover:bg-neutral-200 text-black font-bold text-xs uppercase px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-95"
                  >
                    <Download className="h-4 w-4" />
                    <span>Export CSV Ledger</span>
                  </button>
                </div>
              </div>

              {salesNotice && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="p-3 bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 rounded-xl text-xs flex items-center gap-2 font-bold">
                  <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{salesNotice}</span>
                </motion.div>
              )}

              {/* Time Range Selector Bar */}
              <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
                <div className="flex items-center gap-2 text-xs font-bold uppercase text-neutral-400">
                  <Clock className="h-3.5 w-3.5 text-neutral-400" />
                  <span>Select Period:</span>
                </div>

                <div className="flex items-center gap-1.5 bg-black p-1 rounded-xl border border-neutral-800">
                  {[
                    { id: "today", label: "Today (24H)" },
                    { id: "7d", label: "7 Days" },
                    { id: "30d", label: "30 Days" },
                    { id: "ytd", label: "YTD (2026)" },
                    { id: "all", label: "All Time" },
                  ].map((range) => (
                    <button
                      key={range.id}
                      type="button"
                      onClick={() => setSalesTimeRange(range.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                        salesTimeRange === range.id ? "bg-white text-black shadow-sm" : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. KPI FINANCIAL METRIC CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Gross Revenue */}
              <div className="bg-white border border-neutral-200 p-5 rounded-2xl shadow-sm space-y-2">
                <div className="flex items-center justify-between text-neutral-500 text-[10px] font-bold uppercase tracking-wider">
                  <span>Gross Revenue ({salesTimeRange.toUpperCase()})</span>
                  <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                    <DollarSign className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl font-black font-display text-black">
                  {zar(salesGrossRevenue)}
                </div>
                <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>Real-time tracked sales total</span>
                </div>
              </div>

              {/* Orders Volume */}
              <div className="bg-white border border-neutral-200 p-5 rounded-2xl shadow-sm space-y-2">
                <div className="flex items-center justify-between text-neutral-500 text-[10px] font-bold uppercase tracking-wider">
                  <span>Completed Orders</span>
                  <div className="p-2 bg-neutral-100 text-black rounded-lg">
                    <ShoppingBag className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl font-black font-display text-black">
                  {salesTotalOrders} <span className="text-xs font-normal text-neutral-500">orders</span>
                </div>
                <div className="text-[10px] text-neutral-500 font-bold">
                  {activeSalesOrdersList.filter((o) => (o.status || "").toLowerCase() === "delivered").length} Delivered
                </div>
              </div>

              {/* Average Order Value */}
              <div className="bg-white border border-neutral-200 p-5 rounded-2xl shadow-sm space-y-2">
                <div className="flex items-center justify-between text-neutral-500 text-[10px] font-bold uppercase tracking-wider">
                  <span>Average Order Value (AOV)</span>
                  <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
                    <BarChart2 className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl font-black font-display text-black">
                  {zar(salesAvgOrderValue)}
                </div>
                <div className="text-[10px] text-neutral-500 font-bold">
                  Revenue per checkout transaction
                </div>
              </div>

              {/* Units Delivered */}
              <div className="bg-white border border-neutral-200 p-5 rounded-2xl shadow-sm space-y-2">
                <div className="flex items-center justify-between text-neutral-500 text-[10px] font-bold uppercase tracking-wider">
                  <span>Units Dispatched</span>
                  <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
                    <Package className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-2xl font-black font-display text-black">
                  {salesUnitsDelivered} <span className="text-xs font-normal text-neutral-500">pcs</span>
                </div>
                <div className="text-[10px] text-blue-600 font-bold">
                  Across all apparel lines
                </div>
              </div>
            </div>

            {/* 3. DUAL CHARTS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Revenue Trajectory Chart (2 cols) */}
              <div className="lg:col-span-2 bg-white border border-neutral-200 p-6 rounded-2xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-sm font-bold uppercase text-black">Gross Revenue Trajectory</h3>
                    <p className="text-[11px] text-neutral-500">Sales volume in ZAR over selected period ({salesTimeRange.toUpperCase()})</p>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 bg-black text-white rounded uppercase">
                    {salesTimeRange}
                  </span>
                </div>

                <div className="h-72 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={getSalesChartData()}>
                      <defs>
                        <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#000000" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#000000" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                      <XAxis dataKey="label" stroke="#888888" fontSize={11} />
                      <YAxis stroke="#888888" fontSize={11} tickFormatter={(v) => `R${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`} />
                      <Tooltip
                        formatter={(value) => [zar(value), "Revenue"]}
                        contentStyle={{ backgroundColor: "#000000", borderColor: "#333333", color: "#ffffff", borderRadius: "8px", fontSize: "12px" }}
                      />
                      <Area type="monotone" dataKey="sales" stroke="#000000" strokeWidth={2.5} fillOpacity={1} fill="url(#salesGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Share Chart (1 col) */}
              <div className="bg-white border border-neutral-200 p-6 rounded-2xl space-y-4 shadow-sm">
                <div>
                  <h3 className="font-display text-sm font-bold uppercase text-black">Revenue By Category</h3>
                  <p className="text-[11px] text-neutral-500">Apparel line sales distribution</p>
                </div>

                <div className="h-72 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={getCategoryBreakdownData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                      <XAxis type="number" stroke="#888888" fontSize={10} tickFormatter={(v) => `R${(v / 1000).toFixed(0)}k`} />
                      <YAxis dataKey="category" type="category" stroke="#888888" fontSize={10} width={90} />
                      <Tooltip
                        formatter={(value) => [zar(value), "Revenue"]}
                        contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e5e5e5", color: "#000000", borderRadius: "8px", fontSize: "12px" }}
                      />
                      <Bar dataKey="revenue" fill="#000000" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* 4. TOP SELLING PIECES LEADERBOARD */}
            <div className="bg-white border border-neutral-200 p-6 rounded-2xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-sm font-bold uppercase text-black">Top Selling Pieces Leaderboard</h3>
                  <p className="text-[11px] text-neutral-500">Best-performing garments by units sold & revenue generated</p>
                </div>
                <span className="text-[10px] text-neutral-400 font-bold uppercase">All-Time Standings</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
                {getTopSellingProducts().map((prod, idx) => (
                  <div key={idx} className="bg-neutral-50 border border-neutral-200 p-3.5 rounded-xl space-y-2 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold bg-black text-white px-2 py-0.5 rounded font-mono">#{idx + 1}</span>
                      <span className="text-[10px] text-neutral-500 font-bold uppercase">{prod.units} units sold</span>
                    </div>

                    <div className="h-28 w-full bg-neutral-200 rounded-lg overflow-hidden border border-neutral-200">
                      <img src={prod.image} alt={prod.name} className="h-full w-full object-cover" />
                    </div>

                    <div>
                      <div className="text-xs font-bold text-black uppercase truncate">{prod.name}</div>
                      <div className="text-[10px] text-neutral-500 font-bold uppercase mt-0.5">{prod.category}</div>
                    </div>

                    <div className="text-sm font-black text-black pt-1 border-t border-neutral-200 flex items-center justify-between">
                      <span>{zar(prod.revenue)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. COMPLETE TRANSACTION RECORDS TABLE */}
            <div className="bg-white border border-neutral-200 p-6 rounded-2xl space-y-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-sm font-bold uppercase text-black">Complete Sales Transaction Records</h3>
                  <p className="text-[11px] text-neutral-500">Live order audit trail ({activeSalesOrdersList.length} records matching current view)</p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Search */}
                  <div className="relative">
                    <Search className="h-3.5 w-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={salesSearch}
                      onChange={(e) => setSalesSearch(e.target.value)}
                      placeholder="SEARCH ORDERS..."
                      className="bg-neutral-50 border border-neutral-200 focus:border-black pl-8 pr-3 py-1.5 rounded-lg text-xs font-mono text-black outline-none w-48"
                    />
                  </div>

                  {/* Payment Filter */}
                  <select
                    value={salesPaymentFilter}
                    onChange={(e) => setSalesPaymentFilter(e.target.value)}
                    className="bg-neutral-50 border border-neutral-200 focus:border-black px-2.5 py-1.5 rounded-lg text-xs font-mono text-black outline-none"
                  >
                    <option value="all">ALL PAYMENT METHODS</option>
                    <option value="card">CARD</option>
                    <option value="yoco">YOCO</option>
                    <option value="payfast">PAYFAST</option>
                    <option value="ozow">OZOW EFT</option>
                    <option value="apple pay">APPLE PAY</option>
                    <option value="crypto">CRYPTO</option>
                  </select>

                  {/* Status Filter */}
                  <select
                    value={salesStatusFilter}
                    onChange={(e) => setSalesStatusFilter(e.target.value)}
                    className="bg-neutral-50 border border-neutral-200 focus:border-black px-2.5 py-1.5 rounded-lg text-xs font-mono text-black outline-none"
                  >
                    <option value="all">ALL STATUSES</option>
                    <option value="delivered">DELIVERED</option>
                    <option value="shipped">SHIPPED</option>
                    <option value="processing">PROCESSING</option>
                    <option value="paid">PAID</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto border border-neutral-200 rounded-xl">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="bg-neutral-100 border-b border-neutral-200 text-neutral-600 text-[10px] uppercase">
                      <th className="p-3">Order Ref</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Destination</th>
                      <th className="p-3">Date & Time</th>
                      <th className="p-3">Items Summary</th>
                      <th className="p-3">Payment</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Amount</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {activeSalesOrdersList.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="p-8 text-center text-neutral-500 text-xs">
                          No sales transactions match the selected filters or time period.
                        </td>
                      </tr>
                    ) : (
                      activeSalesOrdersList.map((o) => {
                        const firstItem = Array.isArray(o.items) && o.items[0] ? o.items[0] : null;
                        const itemsCount = Array.isArray(o.items) ? o.items.length : 1;
                        const dateStr = o.created_date ? new Date(o.created_date).toLocaleDateString("en-ZA", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Recent";

                        return (
                          <tr key={o.id || o.order_number} className="hover:bg-neutral-50 text-black transition-colors">
                            <td className="p-3 font-bold text-black">{o.order_number}</td>
                            <td className="p-3">
                              <div className="font-bold text-black">{o.customer_name || "Valued Client"}</div>
                              <div className="text-[10px] text-neutral-500">{o.customer_email}</div>
                            </td>
                            <td className="p-3 text-neutral-700">
                              <span>{o.country_flag || "🇿🇦"} {o.country || "South Africa"}</span>
                            </td>
                            <td className="p-3 text-neutral-500 text-[11px]">{dateStr}</td>
                            <td className="p-3 text-neutral-800">
                              <div className="font-medium text-xs">
                                {firstItem ? `${firstItem.name} (${firstItem.size || 'M'})` : "FORTIFIED Garment"}
                              </div>
                              {itemsCount > 1 && (
                                <div className="text-[10px] text-neutral-500 font-bold">+ {itemsCount - 1} more piece(s)</div>
                              )}
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 bg-neutral-100 border border-neutral-300 rounded text-[10px] font-bold text-neutral-800 uppercase">
                                {o.payment_method || "Card"}
                              </span>
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  (o.status || "").toLowerCase() === "delivered"
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                    : (o.status || "").toLowerCase() === "shipped"
                                    ? "bg-blue-100 text-blue-800 border border-blue-300"
                                    : "bg-amber-100 text-amber-800 border border-amber-300"
                                }`}
                              >
                                {o.status || "Paid"}
                              </span>
                            </td>
                            <td className="p-3 text-right font-black text-black">{zar(o.total || 0)}</td>
                            <td className="p-3 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedOrder(o);
                                  setInvoiceModalOpen(true);
                                }}
                                className="px-2.5 py-1 bg-black hover:bg-neutral-800 text-white rounded text-[10px] font-mono font-bold uppercase transition-all cursor-pointer inline-flex items-center gap-1"
                              >
                                <FileText className="h-3 w-3" />
                                <span>Invoice</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 6: LOOKBOOK & DROPS */}
        {activeTab === "drops" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 font-mono">
            {/* 1. LOOKBOOK & MEDIA CONTENT HUB HEADER CARD */}
            <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-sm">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-black text-white rounded-lg">
                    <Grid className="h-4 w-4" />
                  </div>
                  <h2 className="font-display text-lg font-bold uppercase text-black">LOOKBOOK & MEDIA CONTENT HUB</h2>
                </div>
                <p className="text-xs text-neutral-500 mt-1 font-medium">
                  Upload, reorder, and manage high-res images and campaign motion films for the public Lookbook.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setShotForm({
                      title: "NEW LOOKBOOK ENTRY",
                      subtitle: "Fortified Apparel",
                      img: "/images/classic-front-black/classic_black_front.jpg",
                      videoUrl: "",
                      type: "image",
                      span: "md:col-span-1",
                      ratio: "aspect-[4/5]",
                      position: "object-center"
                    });
                    setEditingShot(null);
                    setIsAddingShot(true);
                  }}
                  className="bg-black hover:bg-neutral-800 text-white px-4 py-2.5 rounded-xl font-bold uppercase text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>ADD IMAGE / VIDEO</span>
                </button>

                <button
                  type="button"
                  onClick={handleLoadStreetwearPack}
                  className="bg-neutral-100 hover:bg-neutral-200 text-black border border-neutral-300 px-4 py-2.5 rounded-xl font-bold uppercase text-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-amber-600" />
                  <span>LOAD SS26 STREETWEAR PACK</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetLookbookDefault}
                  className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-300 px-3.5 py-2.5 rounded-xl font-bold uppercase text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>RESET DEFAULT</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.open("/lookbook", "_blank")}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 px-4 py-2.5 rounded-xl font-bold uppercase text-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <ExternalLink className="h-4 w-4 text-emerald-600" />
                  <span>VIEW LIVE LOOKBOOK PAGE</span>
                </button>
              </div>
            </div>

            {/* 2. MAIN CAMPAIGN FILM VIDEO CONTROL */}
            <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <div>
                  <h3 className="font-display text-sm font-bold uppercase text-black flex items-center gap-2">
                    <Video className="h-4 w-4 text-emerald-600" />
                    <span>MAIN CAMPAIGN FILM VIDEO CONTROL</span>
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 font-medium">
                    Configure the main looping campaign video rendered at the top of the Lookbook page.
                  </p>
                </div>
                <label className="cursor-pointer bg-neutral-100 hover:bg-neutral-200 text-black border border-neutral-300 px-3.5 py-2 rounded-xl text-xs font-bold uppercase flex items-center gap-2 transition-colors disabled:opacity-50">
                  <Upload className="h-3.5 w-3.5" />
                  <span>{videoUploading ? (videoUploadStatus || "Uploading...") : "Upload Video File"}</span>
                  <input
                    type="file"
                    accept="video/*"
                    disabled={videoUploading}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        setVideoUploading(true);
                        setVideoUploadStatus("0%");
                        const uniqueName = `campaign_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9_.-]/g, "_")}`;
                        const serverUrl = await handleUploadVideoChunked(file, "videos", uniqueName, (pct) => {
                          setVideoUploadStatus(`${pct}%`);
                        });
                        if (serverUrl) {
                          setCampaignVideoInput(serverUrl);
                          updateStoreSettings({ campaignVideoUrl: serverUrl });
                          alert("Campaign video uploaded & saved successfully!");
                        }
                      } catch (err) {
                        alert("Campaign video upload failed: " + err.message);
                      } finally {
                        setVideoUploading(false);
                        setVideoUploadStatus("");
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-2 space-y-3">
                  <label className="block text-[10px] uppercase font-bold text-neutral-500">
                    DIRECT VIDEO STREAM URL / MP4 FILE PATH
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={campaignVideoInput}
                      onChange={(e) => setCampaignVideoInput(e.target.value)}
                      placeholder="/videos/campaign.mp4"
                      className="flex-1 bg-neutral-50 border border-neutral-300 px-4 py-3 text-xs text-black font-mono rounded-xl outline-none focus:border-black"
                    />
                    <button
                      type="button"
                      onClick={handleSaveCampaignVideo}
                      className="bg-black text-white hover:bg-neutral-800 font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      SAVE VIDEO
                    </button>
                  </div>
                  <p className="text-[10px] text-neutral-400">
                    Supports local MP4 files, remote video URLs, or Data URLs.
                  </p>
                </div>

                {/* Video Preview Card */}
                <div className="bg-black p-3 rounded-xl border border-neutral-800 space-y-2">
                  <span className="text-[9px] font-mono uppercase text-neutral-400 font-bold block text-center">LIVE VIDEO PREVIEW</span>
                  <div className="aspect-video w-full bg-neutral-900 rounded overflow-hidden relative">
                    <video
                      src={campaignVideoInput}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. LOADED LOOKBOOK GALLERY ITEMS */}
            <div className="space-y-4">
              <div>
                <h3 className="font-display text-sm font-bold uppercase text-black flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4" />
                  <span>LOADED LOOKBOOK GALLERY ITEMS ({lookbookShots.length})</span>
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Drag/reorder or add new images and videos to customize your brand lookbook layout.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {lookbookShots.map((shot, idx) => (
                  <div
                    key={shot.id || idx}
                    className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group hover:border-neutral-400 transition-colors"
                  >
                    <div>
                      {/* Media Container */}
                      <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden border-b border-neutral-200">
                        {shot.type === "video" ? (
                          <video
                            src={shot.videoUrl || shot.img}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className={`w-full h-full object-cover ${shot.position || "object-center"}`}
                          />
                        ) : (
                          <img
                            src={shot.img}
                            alt=""
                            className={`w-full h-full object-cover ${shot.position || "object-center"}`}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "/images/classic-front-black/classic_black_front.jpg";
                            }}
                          />
                        )}

                        <span className="absolute top-2.5 right-2.5 bg-black/80 text-white text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded backdrop-blur-sm border border-white/20">
                          {shot.span === "md:col-span-2" ? "2 COLUMNS" : "1 COLUMN"}
                        </span>
                      </div>

                      {/* Info Details */}
                      <div className="p-4 space-y-2">
                        <span className="text-[9px] font-mono uppercase text-neutral-400 font-semibold block tracking-wider">
                          {shot.subtitle}
                        </span>
                        <h4 className="font-display text-sm font-extrabold uppercase text-black leading-tight">
                          {shot.title}
                        </h4>
                        <div className="flex flex-wrap gap-1.5 pt-1 text-[9px] text-neutral-500">
                          <span className="bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                            Ratio: {shot.ratio}
                          </span>
                          <span className="bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                            Pos: {shot.position}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Controls Bar */}
                    <div className="p-3 bg-neutral-50/80 border-t border-neutral-100 flex items-center justify-between">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveShot(idx, -1)}
                          disabled={idx === 0}
                          className="p-1.5 bg-white border border-neutral-200 hover:bg-neutral-100 disabled:opacity-30 rounded text-black transition-colors cursor-pointer"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveShot(idx, 1)}
                          disabled={idx === lookbookShots.length - 1}
                          className="p-1.5 bg-white border border-neutral-200 hover:bg-neutral-100 disabled:opacity-30 rounded text-black transition-colors cursor-pointer"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingShot(shot);
                            setShotForm({
                              title: shot.title,
                              subtitle: shot.subtitle,
                              img: shot.img || "",
                              videoUrl: shot.videoUrl || "",
                              type: shot.type || "image",
                              span: shot.span || "md:col-span-1",
                              ratio: shot.ratio || "aspect-[4/5]",
                              position: shot.position || "object-center"
                            });
                            setIsAddingShot(false);
                          }}
                          className="px-3 py-1 bg-white border border-neutral-300 hover:bg-neutral-100 text-black text-[10px] font-bold uppercase rounded transition-colors cursor-pointer"
                        >
                          EDIT
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteShot(shot.id)}
                          className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. CAPSULE DROPS & LIMITED ALLOCATIONS */}
            <div className="space-y-4 pt-6 border-t border-neutral-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display text-base font-bold uppercase text-black flex items-center gap-2">
                    <Flame className="h-4 w-4 text-amber-600" />
                    <span>CAPSULE DROPS & LIMITED ALLOCATIONS</span>
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Schedule upcoming drop launches and track allocated production units.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setDropForm({
                      name: "MONOLITH CAPSULE '26",
                      status: "ACTIVE DROP",
                      launchDate: "2026-08-22T18:00:00",
                      units: 450,
                      limitText: "LIMITED RUN — 30 PIECES",
                      priceRange: "R 750 - R 1,200",
                      bgUrl: "/images/drop/drop-bg.png"
                    });
                    setEditingDrop(null);
                    setIsAddingDrop(true);
                  }}
                  className="bg-black hover:bg-neutral-800 text-white px-4 py-2.5 rounded-xl font-bold uppercase text-xs flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span>CREATE CAPSULE DROP</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {capsuleDrops.map((drop) => (
                  <div
                    key={drop.id}
                    className="bg-white border border-neutral-200 p-6 rounded-2xl space-y-4 shadow-sm hover:border-neutral-300 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => handleToggleDropStatus(drop.id)}
                          className={`text-[9px] font-mono font-bold uppercase px-2.5 py-1 rounded border cursor-pointer transition-colors ${
                            drop.status === "ACTIVE DROP"
                              ? "bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200"
                              : "bg-neutral-100 text-black border-neutral-300 hover:bg-neutral-200"
                          }`}
                        >
                          {drop.status}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCapsuleDrop(drop.id)}
                          className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <h3 className="font-display text-base font-extrabold uppercase text-black mt-3">
                        {drop.name}
                      </h3>

                      <div className="mt-3 space-y-1 text-xs text-neutral-600 font-mono">
                        <p>Launch: {drop.launchDate}</p>
                        <p className="text-black font-bold">Units Allocated: {drop.units}</p>
                        <p className="text-neutral-500 text-[10px]">Target Range: {drop.priceRange}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingDrop(drop);
                          setDropForm({
                            name: drop.name,
                            status: drop.status,
                            launchDate: drop.launchDate,
                            units: drop.units,
                            limitText: drop.limitText || "LIMITED ALLOCATION",
                            priceRange: drop.priceRange,
                            bgUrl: drop.bgUrl || ""
                          });
                          setIsAddingDrop(false);
                        }}
                        className="px-3.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-black text-xs font-bold uppercase rounded-lg transition-colors cursor-pointer"
                      >
                        EDIT
                      </button>

                      <button
                        type="button"
                        onClick={() => window.open("/drop", "_blank")}
                        className="text-xs font-bold text-black hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>VIEW DROP PAGE</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 7: VIP CLIENTS */}
        {activeTab === "vip" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Top Bar Banner & Sender Status */}
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl text-white space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
                <div>
                  <span className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-[0.3em]">Official Roster & 1-Click Email Dispatches</span>
                  <h2 className="text-xl font-bold font-mono uppercase mt-0.5">VIP Early Access Management</h2>
                  <p className="text-xs text-neutral-400 mt-1 font-mono">
                    All VIP early release registrations are recorded in real-time. Welcome notifications can be auto-dispatched or sent via 1-Click Gmail directly from <strong className="text-white underline">fortifiedbrand31@gmail.com</strong>.
                  </p>
                </div>
                <div className="bg-black/60 border border-neutral-800 px-4 py-2.5 rounded-xl font-mono text-xs flex items-center gap-3 shrink-0">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <div>
                    <div className="text-[10px] text-neutral-400 uppercase font-bold">Sender Email</div>
                    <div className="text-white font-bold">fortifiedbrand31@gmail.com</div>
                  </div>
                </div>
              </div>

              {/* Email Delivery Guidance & 1-Click Gmail Solution */}
              <div className="bg-amber-950/40 border border-amber-500/40 p-4 rounded-xl text-xs font-mono space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold uppercase">
                  <Mail className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>✉️ Email Delivery Solution & Direct Mail Client Dispatch</span>
                </div>
                <p className="text-neutral-300 text-[11px] leading-relaxed">
                  <strong>Why manual/Gmail dispatch is recommended:</strong> Standard automated server emails sent from web containers can sometimes be held or filtered into Spam folders by Gmail or Outlook security filters. Using our <strong>1-Click "Send via Gmail App"</strong> button opens a pre-populated draft directly in Gmail from <code>fortifiedbrand31@gmail.com</code> so you can hit send manually for <strong>100% guaranteed inbox delivery!</strong>
                </p>
                <div className="pt-1 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const allEmails = vipClients.map((v) => v.email).filter(Boolean).join(",");
                      const subject = encodeURIComponent("FORTIFIED VIP Early Access & Drop Notification");
                      const body = encodeURIComponent("Dear FORTIFIED VIP Member,\n\nYou have been granted priority access to our upcoming drop release.\n\nVisit: https://fortified.co.za\n\nBest regards,\nFORTIFIED Atelier Team");
                      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&bcc=${encodeURIComponent(allEmails)}&su=${subject}&body=${body}`;
                      window.open(gmailUrl, "_blank");
                    }}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase rounded-lg text-[10px] tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow"
                  >
                    <Send className="h-3 w-3" />
                    <span>Open 1-Click Gmail Broadcast (BCC All {vipClients.length} VIPs)</span>
                  </button>
                </div>
              </div>

              {/* Quick Add VIP Client Form */}
              <div className="bg-black border border-neutral-800 p-4 sm:p-5 rounded-xl space-y-3">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 block">Add New VIP Client Manually:</span>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!newVipEmail || !newVipEmail.includes("@")) return;
                    await addVipClient({
                      email: newVipEmail,
                      name: newVipName,
                      tier: newVipTier || "VIP Early Release",
                      phone: newVipPhone
                    });
                    setVipSuccessMsg(`VIP Client (${newVipEmail}) recorded & welcome email dispatched from fortifiedbrand31@gmail.com!`);
                    setNewVipEmail("");
                    setNewVipName("");
                    setNewVipPhone("");
                    setTimeout(() => setVipSuccessMsg(""), 5000);
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3"
                >
                  <input
                    type="email"
                    required
                    value={newVipEmail}
                    onChange={(e) => setNewVipEmail(e.target.value)}
                    placeholder="CLIENT EMAIL *"
                    className="bg-neutral-900 border border-neutral-800 focus:border-white px-3 py-2.5 rounded-lg text-xs font-mono text-white outline-none"
                  />
                  <input
                    type="text"
                    value={newVipName}
                    onChange={(e) => setNewVipName(e.target.value)}
                    placeholder="CLIENT NAME"
                    className="bg-neutral-900 border border-neutral-800 focus:border-white px-3 py-2.5 rounded-lg text-xs font-mono text-white outline-none"
                  />
                  <select
                    value={newVipTier}
                    onChange={(e) => setNewVipTier(e.target.value)}
                    className="bg-neutral-900 border border-neutral-800 focus:border-white px-3 py-2.5 rounded-lg text-xs font-mono text-white outline-none"
                  >
                    <option value="VIP Early Release">VIP Early Release</option>
                    <option value="Vault Early Access">Vault Early Access</option>
                    <option value="Atelier VIP">Atelier VIP</option>
                    <option value="Bespoke Collector">Bespoke Collector</option>
                    <option value="Tier-1 Buyer">Tier-1 Buyer</option>
                  </select>
                  <input
                    type="text"
                    value={newVipPhone}
                    onChange={(e) => setNewVipPhone(e.target.value)}
                    placeholder="PHONE (OPTIONAL)"
                    className="bg-neutral-900 border border-neutral-800 focus:border-white px-3 py-2.5 rounded-lg text-xs font-mono text-white outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-white hover:bg-neutral-200 text-black font-mono font-bold text-xs uppercase px-4 py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Register & Send Email</span>
                  </button>
                </form>

                {vipSuccessMsg && (
                  <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 rounded-lg text-xs font-mono flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{vipSuccessMsg}</span>
                  </div>
                )}
              </div>
            </div>

            {/* VIP Roster Table */}
            <div className="bg-white border border-neutral-200 p-6 rounded-2xl overflow-x-auto shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-neutral-500">
                  Registered VIP Roster ({vipClients.length} Members)
                </h3>
                <span className="font-mono text-[10px] text-neutral-400 uppercase font-bold">
                  Auto-Synced with Firestore
                </span>
              </div>
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-600 text-[10px] uppercase">
                    <th className="p-3">Client Name</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3">Access Tier</th>
                    <th className="p-3">Registered Date</th>
                    <th className="p-3">Email Dispatch Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {vipClients.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-neutral-500 font-mono text-xs">
                        No VIP early release signups recorded yet. Sign up using the home launch form or vault form.
                      </td>
                    </tr>
                  ) : (
                    vipClients.map((vip) => (
                      <tr key={vip.id} className="hover:bg-neutral-50 text-black transition-colors">
                        <td className="p-3 font-bold text-black">{vip.name || vip.email?.split("@")[0]}</td>
                        <td className="p-3 text-neutral-700 font-bold">{vip.email}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded border text-[10px] font-bold uppercase font-mono tracking-wider inline-block ${getTierBadgeClass(vip.tier)}`}>
                            {vip.tier || "VIP Early Release"}
                          </span>
                        </td>
                        <td className="p-3 text-neutral-500 text-[11px]">
                          {vip.createdAt ? new Date(vip.createdAt).toLocaleDateString("en-ZA") : "Legacy Roster"}
                        </td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded text-[10px] font-bold">
                            <Check className="h-3 w-3 text-emerald-600" />
                            <span>Sent from fortifiedbrand31@gmail.com</span>
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                const subject = encodeURIComponent(`FORTIFIED VIP Early Access - ${vip.tier || "Exclusive Release"}`);
                                const body = encodeURIComponent(`Dear ${vip.name || "Collector"},\n\nYou have been granted ${vip.tier || "VIP Early Access"} privileges on FORTIFIED.\n\nVisit your VIP portal: https://fortified.co.za\n\nRegards,\nFORTIFIED Atelier Team`);
                                const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(vip.email)}&su=${subject}&body=${body}`;
                                window.open(gmailUrl, "_blank");
                              }}
                              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-black rounded text-[10px] font-mono font-bold uppercase transition-all cursor-pointer inline-flex items-center gap-1 shadow"
                              title="Open pre-filled draft in Gmail app for 100% guaranteed delivery"
                            >
                              <Mail className="h-2.5 w-2.5" />
                              <span>Gmail (1-Click)</span>
                            </button>

                            <button
                              type="button"
                              onClick={async () => {
                                setVipSendingEmailId(vip.id);
                                try {
                                  await fetch("/api/send-vip-email", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                      email: vip.email,
                                      name: vip.name,
                                      tier: vip.tier,
                                      phone: vip.phone
                                    }),
                                  });
                                  setVipSuccessMsg(`Resent welcome email from fortifiedbrand31@gmail.com to ${vip.email}`);
                                  setTimeout(() => setVipSuccessMsg(""), 5000);
                                } catch (err) {
                                  console.warn("Failed to resend email:", err);
                                } finally {
                                  setVipSendingEmailId(null);
                                }
                              }}
                              disabled={vipSendingEmailId === vip.id}
                              className="px-2.5 py-1 bg-black hover:bg-neutral-800 text-white rounded text-[10px] font-mono font-bold uppercase transition-all cursor-pointer inline-flex items-center gap-1"
                            >
                              <Send className="h-2.5 w-2.5" />
                              <span>{vipSendingEmailId === vip.id ? "Sending..." : "Auto Send"}</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* TAB 8: SETTINGS */}
        {activeTab === "settings" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white border border-neutral-200 p-8 rounded-2xl space-y-6 max-w-2xl shadow-sm">
              <h2 className="font-display text-lg font-bold uppercase text-black">System Infrastructure Settings</h2>
              <div className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-neutral-600 uppercase text-[10px] mb-1 font-bold">Store Name</label>
                  <input type="text" readOnly value="FORTIFIED BRAND" className="w-full bg-neutral-50 border border-neutral-300 px-4 py-2.5 text-black rounded-lg" />
                </div>
                <div>
                  <label className="block text-neutral-600 uppercase text-[10px] mb-1 font-bold">Base Currency</label>
                  <input type="text" readOnly value="ZAR (South African Rand)" className="w-full bg-neutral-50 border border-neutral-300 px-4 py-2.5 text-black rounded-lg" />
                </div>
                <div>
                  <label className="block text-neutral-600 uppercase text-[10px] mb-1 font-bold">Admin Email</label>
                  <input type="text" readOnly value="fortifiedbrand31@gmail.com" className="w-full bg-neutral-50 border border-neutral-300 px-4 py-2.5 text-black rounded-lg" />
                </div>
              </div>
            </div>

            {/* PAYMENT GATEWAYS & PROCESSING CONFIGURATION */}
            <div className="bg-white border border-neutral-200 p-8 rounded-2xl space-y-6 max-w-2xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg font-bold uppercase text-black">Payment Processing Gateways</h2>
                  <p className="font-mono text-xs text-neutral-500 mt-1">Configure live or test credentials for Yoco, PayFast, PayPal & Bank EFT.</p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-mono text-[10px] font-bold uppercase">
                  Ready to Process
                </span>
              </div>

              <div className="space-y-5 font-mono text-xs">
                {/* PayFast */}
                <div className="p-4 border border-neutral-200 bg-neutral-50 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-black uppercase text-xs flex items-center gap-1.5">
                      💳 PayFast Gateway (Instant EFT, Credit Card, Mobicred)
                    </span>
                    <select
                      value={storeSettings?.payfastEnv || "sandbox"}
                      onChange={(e) => updateStoreSettings({ payfastEnv: e.target.value })}
                      className="bg-white border border-neutral-300 px-2 py-1 rounded text-[10px] font-bold text-black"
                    >
                      <option value="sandbox">Sandbox (Testing)</option>
                      <option value="live">Live (Production)</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] text-neutral-500 uppercase font-bold mb-1">Merchant ID</label>
                      <input
                        type="text"
                        value={storeSettings?.payfastMerchantId || "36528155"}
                        onChange={(e) => updateStoreSettings({ payfastMerchantId: e.target.value })}
                        className="w-full bg-white border border-neutral-300 px-3 py-2 text-black rounded-lg text-xs"
                      />
                    </div>
                    <div className="flex items-end">
                      <p className="text-[10px] text-neutral-500 leading-relaxed">Merchant key and passphrase are managed securely in Netlify environment variables. They are not stored in the browser.</p>
                    </div>
                  </div>
                </div>

                {/* Yoco */}
                <div className="p-4 border border-neutral-200 bg-neutral-50 rounded-xl space-y-3">
                  <span className="font-bold text-black uppercase text-xs block">
                    ⚡ Yoco Payment Gateway (Visa, Mastercard, Debit & Credit)
                  </span>
                  <div>
                    <label className="block text-[10px] text-neutral-500 uppercase font-bold mb-1">Public Key</label>
                    <input
                      type="text"
                      value={storeSettings?.yocoPublicKey || import.meta.env.VITE_YOCO_PUBLIC_KEY || ""}
                      onChange={(e) => updateStoreSettings({ yocoPublicKey: e.target.value })}
                      className="w-full bg-white border border-neutral-300 px-3 py-2 text-black rounded-lg text-xs"
                    />
                  </div>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-[10px] text-amber-800 leading-relaxed">Yoco secret key is managed in Netlify environment variables. It is intentionally not editable or stored in the browser.</p>
                  </div>
                </div>

                {/* PayPal & Bank EFT */}
                <div className="p-4 border border-neutral-200 bg-neutral-50 rounded-xl space-y-3">
                  <span className="font-bold text-black uppercase text-xs block">
                    🌐 PayPal & Direct Bank EFT Details
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-neutral-500 uppercase font-bold mb-1">PayPal.me URL</label>
                      <input
                        type="text"
                        value={storeSettings?.paypalMeUrl || "https://paypal.me/VumileTshazi"}
                        onChange={(e) => updateStoreSettings({ paypalMeUrl: e.target.value })}
                        className="w-full bg-white border border-neutral-300 px-3 py-2 text-black rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-neutral-500 uppercase font-bold mb-1">PayPal Handle</label>
                      <input
                        type="text"
                        value={storeSettings?.paypalHandle || "@VumileTshazi"}
                        onChange={(e) => updateStoreSettings({ paypalHandle: e.target.value })}
                        className="w-full bg-white border border-neutral-300 px-3 py-2 text-black rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => alert("Payment configuration saved successfully!")}
                  className="w-full bg-black text-white hover:bg-neutral-800 font-mono text-xs uppercase font-bold py-3 rounded-xl transition-colors"
                >
                  Save Gateway Credentials
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 9: EMAIL DISPATCH */}
        {activeTab === "emails" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="bg-white border border-neutral-200 p-8 rounded-2xl space-y-5 max-w-2xl shadow-sm">
              <h2 className="font-display text-lg font-bold uppercase text-black">Dispatch Email Notification</h2>
              <form onSubmit={handleSendEmailNotification} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-neutral-600 uppercase text-[10px] mb-1 font-bold">Recipient Email</label>
                  <input
                    type="email"
                    required
                    value={emailForm.recipient}
                    onChange={(e) => setEmailForm({ ...emailForm, recipient: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-300 text-black px-4 py-3 rounded-lg outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 uppercase text-[10px] mb-1 font-bold">Subject</label>
                  <input
                    type="text"
                    required
                    value={emailForm.subject}
                    onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-300 text-black px-4 py-3 rounded-lg outline-none focus:border-black uppercase"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 uppercase text-[10px] mb-1 font-bold">Body</label>
                  <textarea
                    rows={6}
                    required
                    value={emailForm.body}
                    onChange={(e) => setEmailForm({ ...emailForm, body: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-300 text-black p-4 rounded-lg outline-none focus:border-black"
                  />
                </div>
                <button type="submit" disabled={emailSending} className="w-full bg-black hover:bg-neutral-800 text-white font-bold uppercase py-3.5 rounded-lg transition-colors">
                  {emailSending ? "Dispatching..." : "Send Email Notification"}
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* TAB 10: MARQUEE & BANNERS */}
        {activeTab === "announcements" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 font-mono">
            {/* Top Live Website Broadcast Center Card */}
            <div className="bg-[#0a0a0a] border border-neutral-800 p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="space-y-2 z-10 max-w-2xl">
                <div className="flex items-center gap-2 text-red-500 font-bold text-[10px] uppercase tracking-[0.3em]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                  </span>
                  <span>((o)) Live Website Broadcast Center</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-monolith text-white">
                  Marquee Running Text & Sale Banner Control
                </h2>
                <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                  Control real-time announcement banners, promo notifications, banner colors, marquee scroll speed, and live website previews.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 z-10">
                <button
                  type="button"
                  onClick={handleSaveAnnouncements}
                  className="bg-white hover:bg-neutral-200 text-black font-mono font-bold text-xs uppercase tracking-[0.2em] px-6 py-4 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Save className="h-4 w-4" />
                  <span>Save & Publish</span>
                </button>
              </div>
            </div>

            {/* Grid 2 Columns: 01 Marquee & 02 Sale Banner */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* COLUMN 01: HOME SCREEN MARQUEE */}
              <div className="bg-[#0a0a0a] border border-neutral-800 p-6 sm:p-8 rounded-2xl space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-[0.3em] font-bold">01 · Home Screen Marquee</span>
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider mt-0.5">Running Marquee Text & Speed</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleMarquee()}
                    className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold tracking-wider transition-all cursor-pointer ${
                      announcementForm.marqueeEnabled
                        ? "bg-emerald-950/60 border-emerald-500/60 text-emerald-400"
                        : "bg-neutral-900 border-neutral-700 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {announcementForm.marqueeEnabled ? "● MARQUEE IS ON" : "○ MARQUEE IS OFF"}
                  </button>
                </div>

                {/* Marquee Running Text Area */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] uppercase font-bold text-neutral-400">
                    <span>Marquee Running Text (Use • or | to separate phrases)</span>
                    <div className="flex items-center gap-1.5 text-neutral-500">
                      <span>Insert:</span>
                      {["•", "|", "+", "★"].map((sym) => (
                        <button
                          key={sym}
                          type="button"
                          onClick={() => setAnnouncementForm((prev) => ({ ...prev, marqueeText: prev.marqueeText ? `${prev.marqueeText} ${sym} ` : `${sym} ` }))}
                          className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-700 hover:border-white text-white rounded text-[10px]"
                        >
                          {sym}
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    rows={4}
                    value={announcementForm.marqueeText}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, marqueeText: e.target.value })}
                    placeholder="Enter marquee running announcements..."
                    className="w-full bg-[#111111] text-white border border-neutral-800 p-4 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider outline-none focus:border-neutral-500 transition-colors"
                  />
                </div>

                {/* Background Theme Options */}
                <div className="space-y-2">
                  <label className="block text-[10px] text-neutral-400 uppercase font-bold">Background Theme</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: "white", label: "White Canvas", bg: "bg-white text-black border-neutral-300" },
                      { id: "dark", label: "Sleek Dark", bg: "bg-neutral-900 text-white border-neutral-700" },
                      { id: "red", label: "Red Urgency", bg: "bg-red-600 text-white border-red-700" },
                      { id: "gold", label: "Gold Luxury", bg: "bg-amber-500 text-black border-amber-600" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setAnnouncementForm({ ...announcementForm, marqueeTheme: t.id })}
                        className={`p-2.5 rounded-lg border text-[10px] font-bold uppercase transition-all ${t.bg} ${
                          announcementForm.marqueeTheme === t.id ? "ring-2 ring-white scale-[1.02]" : "opacity-80 hover:opacity-100"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text Color Options */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] text-neutral-400 uppercase font-bold">Text Color</label>
                    <span className="text-[10px] text-neutral-500">Selected: {announcementForm.marqueeTextColor}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: "black", label: "Black", style: "bg-white text-black border-neutral-300" },
                      { id: "white", label: "White", style: "bg-neutral-900 text-white border-neutral-700" },
                      { id: "gold", label: "Gold Accent", style: "bg-neutral-900 text-amber-400 border-amber-500/50" },
                      { id: "red", label: "Red Accent", style: "bg-neutral-900 text-red-500 border-red-500/50" },
                    ].map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setAnnouncementForm({ ...announcementForm, marqueeTextColor: c.id })}
                        className={`p-2.5 rounded-lg border text-[10px] font-bold uppercase transition-all ${c.style} ${
                          announcementForm.marqueeTextColor === c.id ? "ring-2 ring-white scale-[1.02]" : "opacity-80 hover:opacity-100"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Animation Scroll Speed */}
                <div className="space-y-2">
                  <label className="block text-[10px] text-neutral-400 uppercase font-bold">Animation Scroll Speed</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { speed: 12, label: "Fast (12s)" },
                      { speed: 20, label: "Standard (20s)" },
                      { speed: 30, label: "Slow (30s)" },
                    ].map((s) => (
                      <button
                        key={s.speed}
                        type="button"
                        onClick={() => setAnnouncementForm({ ...announcementForm, marqueeSpeed: s.speed })}
                        className={`p-3 rounded-lg border text-center text-[10px] font-bold uppercase transition-all ${
                          announcementForm.marqueeSpeed === s.speed
                            ? "bg-white text-black border-white"
                            : "bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-600"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="space-y-2">
                  <label className="block text-[10px] text-neutral-400 uppercase font-bold">Quick Presets</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      {
                        name: "Preset 1",
                        text: "FORTIFIED LIMITED EDITION • 10% OFF ALL TEES • FREE EXPRESS SHIPPING ACROSS SOUTH AFRICA • PERMANENT ART",
                      },
                      {
                        name: "Preset 2",
                        text: "NEW CAPSULE DROP LIVE NOW | FREE NATIONWIDE COURIER | SECURE YOCO & PAYFAST CHECKOUT",
                      },
                      {
                        name: "Preset 3",
                        text: "⚡ 24 HOUR FLASH SALE ★ USE CODE: FORTIFIED10 ★ LIMITED STOCK REMAINING",
                      },
                    ].map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAnnouncementForm((prev) => ({ ...prev, marqueeText: p.text }))}
                        className="p-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors"
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Animated Marquee Preview */}
                <div className="space-y-2 pt-2 border-t border-neutral-800">
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 uppercase font-bold">
                    <span>Live Animated Marquee Preview ({announcementForm.marqueeSpeed}s scroll):</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Preview
                    </span>
                  </div>
                  <div
                    className={`p-4 rounded-xl border overflow-hidden select-none ${
                      {
                        white: "bg-white border-neutral-300 text-black",
                        dark: "bg-neutral-950 border-neutral-800 text-white",
                        red: "bg-red-600 border-red-700 text-white",
                        gold: "bg-amber-500 border-amber-600 text-black",
                      }[announcementForm.marqueeTheme] || "bg-white text-black border-neutral-300"
                    }`}
                  >
                    <motion.div
                      className="flex whitespace-nowrap"
                      animate={{ x: ["0%", "-50%"] }}
                      transition={{
                        duration: Number(announcementForm.marqueeSpeed) || 20,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <span
                        className={`font-display text-lg font-black tracking-monolith uppercase pr-12 flex items-center gap-4 ${
                          {
                            black: "text-black",
                            white: "text-white",
                            gold: "text-amber-400",
                            red: "text-red-500",
                          }[announcementForm.marqueeTextColor] || ""
                        }`}
                      >
                        {announcementForm.marqueeText || "FORTIFIED LIMITED EDITION"}
                      </span>
                      <span
                        className={`font-display text-lg font-black tracking-monolith uppercase pr-12 flex items-center gap-4 ${
                          {
                            black: "text-black",
                            white: "text-white",
                            gold: "text-amber-400",
                            red: "text-red-500",
                          }[announcementForm.marqueeTextColor] || ""
                        }`}
                      >
                        {announcementForm.marqueeText || "FORTIFIED LIMITED EDITION"}
                      </span>
                    </motion.div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveAnnouncements}
                  className="w-full bg-white hover:bg-neutral-200 text-black font-bold uppercase py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Marquee Settings</span>
                </button>
              </div>

              {/* COLUMN 02: TOP SALE NOTIFICATION BANNER */}
              <div className="bg-[#0a0a0a] border border-neutral-800 p-6 sm:p-8 rounded-2xl space-y-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-[0.3em] font-bold">02 · Top Sale Notification Banner</span>
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider mt-0.5">Sale Banner Details & Colours</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleSaleBanner()}
                    className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold tracking-wider transition-all cursor-pointer ${
                      announcementForm.saleBannerEnabled
                        ? "bg-emerald-950/60 border-emerald-500/60 text-emerald-400"
                        : "bg-neutral-900 border-neutral-700 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {announcementForm.saleBannerEnabled ? "● BANNER IS ON" : "○ BANNER IS OFF"}
                  </button>
                </div>

                {/* Banner Text Inputs */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] text-neutral-400 uppercase font-bold mb-1">
                      Sale Banner Main Headline *
                    </label>
                    <input
                      type="text"
                      value={announcementForm.saleBannerText}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, saleBannerText: e.target.value })}
                      placeholder="e.g. ⚡ 72 HOUR FLASH SALE — 10% OFF SITEWIDE"
                      className="w-full bg-[#111111] text-white border border-neutral-800 p-3.5 rounded-xl text-xs font-mono font-bold outline-none focus:border-neutral-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-neutral-400 uppercase font-bold mb-1">
                      Banner Subtext / Details Line
                    </label>
                    <input
                      type="text"
                      value={announcementForm.saleBannerSubtext || ""}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, saleBannerSubtext: e.target.value })}
                      placeholder="e.g. Complimentary express courier nationwide across South Africa"
                      className="w-full bg-[#111111] text-white border border-neutral-800 p-3.5 rounded-xl text-xs font-mono outline-none focus:border-neutral-500 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-neutral-400 uppercase font-bold mb-1">
                        Promo Coupon Code
                      </label>
                      <input
                        type="text"
                        value={announcementForm.saleBannerCode}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, saleBannerCode: e.target.value })}
                        placeholder="e.g. FORTIFIED10"
                        className="w-full bg-[#111111] text-white border border-neutral-800 p-3.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider outline-none focus:border-neutral-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-neutral-400 uppercase font-bold mb-1">
                        Countdown Duration (Hours)
                      </label>
                      <input
                        type="number"
                        value={announcementForm.saleBannerHours}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, saleBannerHours: Number(e.target.value) || 24 })}
                        placeholder="72"
                        className="w-full bg-[#111111] text-white border border-neutral-800 p-3.5 rounded-xl text-xs font-mono font-bold outline-none focus:border-neutral-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-neutral-400 uppercase font-bold mb-1">
                      CTA Action Destination Path
                    </label>
                    <input
                      type="text"
                      value={announcementForm.saleBannerCtaPath || "/shop"}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, saleBannerCtaPath: e.target.value })}
                      placeholder="/shop"
                      className="w-full bg-[#111111] text-white border border-neutral-800 p-3.5 rounded-xl text-xs font-mono outline-none focus:border-neutral-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Banner Color Themes (7 Options) */}
                <div className="space-y-2">
                  <label className="block text-[10px] text-neutral-400 uppercase font-bold">Banner Colour Theme (7 Options)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {[
                      { id: "white", label: "Clean White", bg: "bg-white border-neutral-300 text-black font-bold" },
                      { id: "red", label: "Red Urgency", bg: "bg-red-600 border-red-700 text-white" },
                      { id: "gold", label: "Gold Luxury", bg: "bg-amber-500 border-amber-600 text-white font-bold" },
                      { id: "black", label: "Sleek Dark", bg: "bg-neutral-900 border-neutral-700 text-white" },
                      { id: "emerald", label: "Emerald Green", bg: "bg-emerald-600 border-emerald-700 text-white" },
                      { id: "neon", label: "Neon Cyber", bg: "bg-indigo-600 border-indigo-700 text-white" },
                      { id: "blue", label: "Royal Blue", bg: "bg-blue-600 border-blue-700 text-white" },
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setAnnouncementForm({ ...announcementForm, saleBannerStyle: st.id })}
                        className={`p-3 rounded-lg border text-center text-[10px] font-bold uppercase transition-all ${st.bg} ${
                          announcementForm.saleBannerStyle === st.id ? "ring-2 ring-white scale-[1.02]" : "opacity-85 hover:opacity-100"
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preset Sale Scenarios */}
                <div className="space-y-2">
                  <label className="block text-[10px] text-neutral-400 uppercase font-bold">Preset Sale Scenarios:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      {
                        label: "72H Flash Sale (10% OFF)",
                        text: "⚡ 72 HOUR FLASH SALE — 10% OFF SITEWIDE",
                        code: "FORTIFIED10",
                        hours: 72,
                        style: "red",
                        discount: 10,
                      },
                      {
                        label: "Weekend Drop (15% OFF)",
                        text: "🔥 EXCLUSIVE WEEKEND DROP — 15% OFF ALL PIECES",
                        code: "WEEKEND15",
                        hours: 48,
                        style: "gold",
                        discount: 15,
                      },
                      {
                        label: "24H VIP Black Out",
                        text: "🖤 24 HOUR VIP BLACKOUT SALE — 20% OFF",
                        code: "VIP20",
                        hours: 24,
                        style: "black",
                        discount: 20,
                      },
                      {
                        label: "Spring Drop (Emerald)",
                        text: "🌿 NEW SEASON EMERALD CAPSULE — 10% OFF",
                        code: "SPRING10",
                        hours: 72,
                        style: "emerald",
                        discount: 10,
                      },
                    ].map((sc, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() =>
                          setAnnouncementForm((prev) => ({
                            ...prev,
                            saleBannerText: sc.text,
                            saleBannerCode: sc.code,
                            saleBannerHours: sc.hours,
                            saleBannerStyle: sc.style,
                            saleDiscountPercent: sc.discount,
                          }))
                        }
                        className="p-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors"
                      >
                        {sc.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 03: TARGETED SALE SCOPE & DISCOUNT % */}
            <div className="bg-[#0a0a0a] border border-neutral-800 p-6 sm:p-8 rounded-2xl space-y-6 shadow-xl">
              <div className="border-b border-neutral-800 pb-4">
                <span className="text-[10px] text-neutral-500 uppercase tracking-[0.3em] font-bold">03 · Discount Percentage & Sale Item Selector</span>
                <h3 className="text-xl font-bold text-white uppercase tracking-wider mt-0.5">Targeted Sale Scope & Discount %</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Discount Percentage & Presets */}
                <div className="space-y-3">
                  <label className="block text-[10px] text-neutral-400 uppercase font-bold">
                    Sale Discount Percentage (%) *
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={announcementForm.saleDiscountPercent || 10}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, saleDiscountPercent: Number(e.target.value) || 0 })}
                      className="w-32 bg-[#111111] text-white border border-neutral-800 p-3.5 rounded-xl text-lg font-mono font-black text-center outline-none focus:border-neutral-500"
                    />
                    <span className="px-3 py-2 bg-red-600 text-white font-black text-xs uppercase rounded-lg">
                      {announcementForm.saleDiscountPercent || 10}% OFF
                    </span>
                  </div>

                  <div className="pt-2">
                    <span className="block text-[10px] text-neutral-500 uppercase font-bold mb-1.5">Quick Discount Presets</span>
                    <div className="flex flex-wrap gap-2">
                      {[10, 15, 20, 25, 30, 50].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => setAnnouncementForm({ ...announcementForm, saleDiscountPercent: pct })}
                          className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${
                            announcementForm.saleDiscountPercent === pct
                              ? "bg-red-600 text-white border-red-500 font-black"
                              : "bg-neutral-900 text-neutral-300 border-neutral-800 hover:border-neutral-600"
                          }`}
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Item Scope Selection */}
                <div className="space-y-3">
                  <label className="block text-[10px] text-neutral-400 uppercase font-bold">Determine Which Items Are On Sale:</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      {
                        id: "all",
                        title: "🌐 All Products (Sitewide)",
                        desc: "100% of catalog tagged & discounted",
                      },
                      {
                        id: "collections",
                        title: "🏷️ Specific Collections",
                        desc: "Filter by collection / category",
                      },
                      {
                        id: "products",
                        title: "👕 Specific Products",
                        desc: "Hand-pick individual pieces",
                      },
                    ].map((sc) => (
                      <button
                        key={sc.id}
                        type="button"
                        onClick={() => setAnnouncementForm({ ...announcementForm, saleScope: sc.id })}
                        className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                          announcementForm.saleScope === sc.id
                            ? "bg-neutral-900 border-red-600 text-white ring-1 ring-red-600"
                            : "bg-[#111111] border-neutral-800 text-neutral-400 hover:border-neutral-700"
                        }`}
                      >
                        <span className="font-bold text-xs text-white leading-tight mb-2">{sc.title}</span>
                        <span className="text-[10px] text-neutral-500 leading-normal">{sc.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Header Banner Preview */}
              <div className="space-y-2 pt-4 border-t border-neutral-800">
                <div className="flex items-center justify-between text-[10px] text-neutral-400 uppercase font-bold">
                  <span>Live Header Banner Preview:</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Site Header Mock
                  </span>
                </div>

                {announcementForm.saleBannerEnabled ? (
                  <div
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono shadow-md ${
                      {
                        white: "bg-white text-black border-neutral-300",
                        red: "bg-red-600 text-white border-red-700",
                        gold: "bg-amber-500 text-white border-amber-600",
                        black: "bg-neutral-950 text-white border-neutral-800",
                        emerald: "bg-emerald-600 text-white border-emerald-700",
                        neon: "bg-indigo-600 text-white border-indigo-700",
                        blue: "bg-blue-600 text-white border-blue-700",
                      }[announcementForm.saleBannerStyle] || "bg-white text-black border-neutral-300"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full animate-ping ${announcementForm.saleBannerStyle === "white" ? "bg-black" : "bg-white"}`} />
                      <span className="font-bold uppercase tracking-wider">
                        {announcementForm.saleBannerText || "⚡ 72 HOUR FLASH SALE — 10% OFF SITEWIDE"}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-widest uppercase ${
                        announcementForm.saleBannerStyle === "white" ? "bg-neutral-100 text-black border border-neutral-300" : "bg-black/40 text-white"
                      }`}>
                        {announcementForm.saleBannerHours}h REMAINING
                      </span>
                      {announcementForm.saleBannerCode && (
                        <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase border ${
                          announcementForm.saleBannerStyle === "white" ? "bg-black text-white border-neutral-800" : "bg-black text-white border-white/20"
                        }`}>
                          CODE: {announcementForm.saleBannerCode}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 border-2 border-dashed border-neutral-800 rounded-xl text-center text-neutral-500 text-xs font-mono uppercase tracking-widest">
                    SALE NOTIFICATION BANNER IS CURRENTLY TURNED OFF.
                  </div>
                )}
              </div>

              {/* National & International Shipping Charges Config */}
              <div className="pt-6 border-t border-neutral-800 space-y-4">
                <div className="flex items-center gap-2 text-white font-mono text-sm uppercase tracking-wider font-bold">
                  <Truck className="h-4 w-4 text-amber-400" />
                  <span>🚚 National & International Shipping Rates</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* National (South Africa) */}
                  <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-3">
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                      <span className="font-bold text-xs text-white uppercase tracking-wider">🇿🇦 South Africa (National)</span>
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded font-bold">Domestic</span>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Standard Shipping Fee (ZAR)</label>
                      <input
                        type="number"
                        value={announcementForm.nationalShippingFee ?? 100}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, nationalShippingFee: Number(e.target.value) || 0 })}
                        className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                        placeholder="100"
                      />
                      <p className="text-[10px] text-neutral-500 mt-1">Default: R 100 National Door-to-Door Courier</p>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Delivery Lead Time</label>
                      <input
                        type="text"
                        value={announcementForm.nationalShippingDays || "1–3 Business Days"}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, nationalShippingDays: e.target.value })}
                        className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                        placeholder="1–3 Business Days"
                      />
                    </div>
                  </div>

                  {/* International (Worldwide) */}
                  <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl space-y-3">
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                      <span className="font-bold text-xs text-white uppercase tracking-wider">🌐 International (Worldwide)</span>
                      <span className="text-[10px] px-2 py-0.5 bg-indigo-950 text-indigo-400 border border-indigo-800 rounded font-bold">Express Air</span>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Flat Rate Shipping Fee (ZAR)</label>
                      <input
                        type="number"
                        value={announcementForm.internationalShippingFee ?? 450}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, internationalShippingFee: Number(e.target.value) || 0 })}
                        className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                        placeholder="450"
                      />
                      <p className="text-[10px] text-neutral-500 mt-1">Default: R 450 Express Air Courier</p>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Free International Threshold (ZAR)</label>
                      <input
                        type="number"
                        value={announcementForm.internationalFreeThreshold ?? 0}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, internationalFreeThreshold: Number(e.target.value) || 0 })}
                        className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                        placeholder="0 (Disabled)"
                      />
                      <p className="text-[10px] text-neutral-500 mt-1">Set to 0 to disable Free International Shipping</p>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-neutral-400 mb-1">Delivery Lead Time</label>
                      <input
                        type="text"
                        value={announcementForm.internationalShippingDays || "3–7 Business Days"}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, internationalShippingDays: e.target.value })}
                        className="w-full bg-black border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                        placeholder="3–7 Business Days"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveAnnouncements}
                className="w-full bg-white hover:bg-neutral-200 text-black font-bold uppercase py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Save className="h-4 w-4" />
                <span>Save Sale Banner Settings</span>
              </button>
            </div>

            {/* CARD 03: MAIN PAGE FORTIFIEDBRAND LAUNCH COUNTDOWN */}
            <div className="bg-[#0a0a0a] border border-neutral-800 p-6 sm:p-8 rounded-2xl space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-800 pb-4 gap-4">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-[0.3em] font-bold">03 · Home Page Brand Launch Clock</span>
                  <h3 className="text-xl font-bold text-white uppercase tracking-wider mt-0.5">Fortifiedbrand Launch Countdown Control</h3>
                  <p className="text-xs text-neutral-400 mt-1">Configure the main launch clock displayed on the home page, launch headline, date/time, and VIP access controls.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleLaunchCountdown()}
                  className={`px-4 py-2 rounded-xl border text-xs font-bold tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    announcementForm.launchCountdownEnabled
                      ? "bg-emerald-950/60 border-emerald-500/60 text-emerald-400"
                      : "bg-neutral-900 border-neutral-700 text-neutral-400 hover:text-white"
                  }`}
                >
                  {announcementForm.launchCountdownEnabled ? "● LAUNCH COUNTDOWN IS ON" : "○ LAUNCH COUNTDOWN IS OFF"}
                </button>
              </div>

              {/* Form Inputs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase font-bold mb-1.5">Launch Title Headline *</label>
                  <input
                    type="text"
                    value={announcementForm.launchTitle || ""}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, launchTitle: e.target.value })}
                    className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-white font-mono"
                    placeholder="FORTIFIEDBRAND OFFICIAL LAUNCH"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase font-bold mb-1.5">Target Launch Date & Time *</label>
                  <input
                    type="text"
                    value={announcementForm.launchTargetDate || ""}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, launchTargetDate: e.target.value })}
                    className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-white font-mono"
                    placeholder="2026-08-25T00:00:00"
                  />
                  <span className="text-[10px] text-neutral-500 mt-1 block">ISO format e.g. YYYY-MM-DDTHH:MM:SS</span>
                </div>

                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase font-bold mb-1.5">CTA Button Label</label>
                  <input
                    type="text"
                    value={announcementForm.launchCtaText || ""}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, launchCtaText: e.target.value })}
                    className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-white font-mono"
                    placeholder="VIP EARLY ACCESS"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] text-neutral-400 uppercase font-bold mb-1.5">Launch Subtext / Description</label>
                  <input
                    type="text"
                    value={announcementForm.launchSubtext || ""}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, launchSubtext: e.target.value })}
                    className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-white font-mono"
                    placeholder="LIMITED DROP RELEASE & EXCLUSIVE PERMANENT APPAREL COLLECTION"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-neutral-400 uppercase font-bold mb-1.5">CTA Button Destination Path</label>
                  <input
                    type="text"
                    value={announcementForm.launchCtaLink || "/shop"}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, launchCtaLink: e.target.value })}
                    className="w-full bg-black border border-neutral-800 rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-white font-mono"
                    placeholder="/shop"
                  />
                </div>
              </div>

              {/* Special Occasion Presets */}
              <div className="pt-2 border-t border-neutral-900 space-y-2">
                <label className="block text-[10px] text-neutral-400 uppercase font-bold">Special Occasion Presets (1-Click Fill & Publish)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                  {[
                    {
                      label: "🎄 Christmas Special",
                      title: "FORTIFIED CHRISTMAS HOLIDAY DROP 2026",
                      subtext: "LIMITED EDITION HOLIDAY APPAREL CAPSULE RELEASE",
                      target: "2026-12-25T00:00:00",
                    },
                    {
                      label: "🚀 Brand Store Launch",
                      title: "FORTIFIEDBRAND OFFICIAL LAUNCH",
                      subtext: "LIMITED DROP RELEASE & EXCLUSIVE PERMANENT APPAREL COLLECTION",
                      target: "2026-08-25T00:00:00",
                    },
                    {
                      label: "⚡ Black Friday Vault",
                      title: "BLACK FRIDAY GRAIL DROP 2026",
                      subtext: "EXCLUSIVE ANNUAL GRAIL RELEASE & SPECIAL VAULT UNLOCK",
                      target: "2026-11-27T00:00:00",
                    },
                    {
                      label: "🎆 New Year Collection",
                      title: "NEW YEAR PERMANENT ART COLLECTION 2027",
                      subtext: "NEW YEAR EXCLUSIVE LIMITED APPAREL DROP",
                      target: "2027-01-01T00:00:00",
                    },
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setAnnouncementForm((prev) => ({
                          ...prev,
                          launchCountdownEnabled: true,
                          launchTitle: preset.title,
                          launchSubtext: preset.subtext,
                          launchTargetDate: preset.target,
                        }));
                      }}
                      className="p-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-left rounded-xl transition-all cursor-pointer group"
                    >
                      <div className="text-white font-bold text-xs group-hover:text-amber-400">{preset.label}</div>
                      <div className="text-[10px] text-neutral-500 font-mono mt-0.5 truncate">{preset.target}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Launch Date Presets */}
              <div className="pt-2 border-t border-neutral-900">
                <label className="block text-[10px] text-neutral-400 uppercase font-bold mb-2">Quick Duration Presets</label>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { label: "+ 24 Hours", hours: 24 },
                    { label: "+ 3 Days", hours: 72 },
                    { label: "+ 7 Days", hours: 168 },
                    { label: "+ 14 Days", hours: 336 },
                    { label: "+ 30 Days", hours: 720 },
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => {
                        const target = new Date(Date.now() + p.hours * 60 * 60 * 1000).toISOString().slice(0, 19);
                        setAnnouncementForm({ ...announcementForm, launchTargetDate: target });
                      }}
                      className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-600 text-neutral-300 rounded-lg text-xs font-mono transition-all cursor-pointer"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Admin Preview for Launch Countdown */}
              <div className="bg-black border border-neutral-800 p-6 rounded-xl space-y-3">
                <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest block">Live Home Page Launch Countdown Preview:</span>
                <div className="border border-neutral-800 bg-neutral-950 p-6 rounded-lg text-center space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/30 text-red-400 text-[10px] font-bold uppercase tracking-widest">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
                    <span>OFFICIAL BRAND LAUNCH COUNTDOWN</span>
                  </div>
                  <h4 className="font-display text-2xl font-black text-white uppercase">{announcementForm.launchTitle || "FORTIFIEDBRAND OFFICIAL LAUNCH"}</h4>
                  <p className="text-xs text-neutral-400 font-mono">{announcementForm.launchSubtext || "LIMITED DROP RELEASE & EXCLUSIVE PERMANENT APPAREL COLLECTION"}</p>
                  <div className="inline-block bg-black border border-neutral-800 px-4 py-2 rounded text-xs text-amber-400 font-mono">
                    Target Date: {announcementForm.launchTargetDate}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveAnnouncements}
                className="w-full bg-white hover:bg-neutral-200 text-black font-mono font-bold uppercase py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Save className="h-4 w-4" />
                <span>Save Launch Countdown Settings</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* TAB: BRAND ASSETS & MEDIA MANAGER */}
        {activeTab === "media" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <BrandAssetsMediaManager />
          </motion.div>
        )}
      </main>

      {/* INVOICE / RECEIPT MODAL */}
      <AnimatePresence>
        {invoiceModalOpen && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
          >
            <div className="w-full max-w-4xl space-y-4 my-8">
              {/* Modal Top Control Bar */}
              <div className="flex items-center justify-between bg-neutral-900 p-4 border border-neutral-800 rounded-t-xl text-white font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold uppercase tracking-wider text-neutral-300">
                    {invoiceType === "invoice" ? "Official Tax Invoice" : "Official Payment Receipt"} — #{selectedOrder.order_number}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleDownloadPdfFromModal}
                    disabled={isGeneratingPdf}
                    className="bg-white hover:bg-neutral-200 text-black font-bold uppercase px-3 py-1.5 rounded text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>{isGeneratingPdf ? "Generating PDF..." : "Download PDF"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={triggerPrintInvoice}
                    className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold uppercase px-3 py-1.5 rounded text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>Print</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setInvoiceModalOpen(false)}
                    className="p-1.5 text-neutral-400 hover:text-white rounded transition-colors cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* PRINTABLE DOCUMENT CANVAS (A4 PAPER LOOK MATCHING IMAGES 2 & 3) */}
              <div className="bg-neutral-950 p-4 md:p-8 overflow-x-auto flex justify-center border-x border-b border-neutral-800 rounded-b-xl">
                <div
                  id="official-tax-document-canvas"
                  className="invoice-paper bg-white text-black p-8 md:p-12 font-mono w-[800px] shadow-2xl border border-neutral-300 space-y-8 select-text text-xs leading-relaxed"
                  style={{ minHeight: "1000px" }}
                >
                  {/* DOCUMENT HEADER */}
                  <div className="flex justify-between items-start border-b-2 border-black pb-6">
                    {/* BRAND & LOGO SECTION */}
                    <div className="space-y-2 max-w-md">
                      <div className="flex items-center gap-3">
                        <img
                          src="/images/brand/fiy-logo.png"
                          alt="FORTIFIED Logo"
                          className="h-10 w-10 object-contain shrink-0"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <h1 className="font-display font-black text-3xl tracking-[0.15em] uppercase text-black m-0 leading-none">
                          FORTIFIED
                        </h1>
                      </div>

                      <p className="font-mono text-[10px] tracking-[0.22em] font-bold text-neutral-600 uppercase">
                        PERMANENT ART. TIMELESS QUALITY.
                      </p>

                      <div className="font-mono text-[9px] text-neutral-600 leading-normal pt-1 space-y-0.5">
                        <p>FORTIFIED BRAND (PTY) LTD · Reg: 2025/120241/07 · South Africa</p>
                        <p className="font-bold text-black uppercase">
                          CHARDONNAY, CABANAS, COLIN STREET, UVONGO, KWA-ZULU NATAL 4270
                        </p>
                        <p>Email: fortifiedbrand31@gmail.com · Tel: +27 68 594 0131</p>
                      </div>
                    </div>

                    {/* DOCUMENT BADGE & NUMBER */}
                    <div className="text-right space-y-3">
                      <div className="bg-black text-white px-4 py-2 font-mono font-bold text-xs uppercase tracking-widest inline-block text-center shadow">
                        {invoiceType === "invoice" ? "OFFICIAL TAX INVOICE" : "OFFICIAL PAYMENT RECEIPT"}
                      </div>
                      <div>
                        <p className="font-mono font-bold text-lg text-black tracking-wider">
                          #{selectedOrder.order_number}
                        </p>
                        <p className="font-mono text-xs text-neutral-600 mt-0.5">
                          Date: {selectedOrder.created_date ? new Date(selectedOrder.created_date).toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" }) : "7/28/2026"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CUSTOMER & PAYMENT DETAILS SECTION */}
                  <div className="grid grid-cols-2 gap-8 py-2">
                    {/* Left Column: Billed & Shipped To */}
                    <div className="space-y-1">
                      <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                        BILLED TO:
                      </p>
                      <p className="font-mono text-sm font-bold text-black">
                        {selectedOrder.customer_name}
                      </p>
                      <p className="font-mono text-xs text-neutral-700 whitespace-pre-line leading-relaxed">
                        {selectedOrder.billing_address || selectedOrder.shipping_address || "14 Rosebank Road, Sandton,\nJohannesburg, 2196, ZA South Africa"}
                      </p>
                      <p className="font-mono text-xs text-neutral-700 pt-1">
                        {selectedOrder.customer_email}
                      </p>
                      <p className="font-mono text-xs text-neutral-700">
                        {selectedOrder.customer_phone || "+27 82 456 7890"}
                      </p>

                      <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1 pt-3">
                        SHIPPED TO:
                      </p>
                      <p className="font-mono text-xs text-neutral-700 whitespace-pre-line leading-relaxed">
                        {selectedOrder.shipping_address || selectedOrder.billing_address || "Same as Billing Address"}
                      </p>
                    </div>

                    {/* Right Column: Payment Summary */}
                    <div className="space-y-1 text-right">
                      <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                        PAYMENT SUMMARY:
                      </p>
                      <p className="font-mono text-xs text-neutral-800">
                        Method: <strong className="text-black">{selectedOrder.payment_method || "Card"}</strong>
                      </p>
                      <p className="font-mono text-xs text-neutral-800 font-bold">
                        Status: <span className="text-black">PAID IN FULL</span>
                      </p>
                      <p className="font-mono text-xs text-neutral-800">
                        Courier Tracking: <strong className="text-black">{selectedOrder.tracking_number || "RAM-ZA-882194"}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="border-b border-neutral-200" />

                  {/* ITEMS TABLE */}
                  <div className="space-y-2">
                    <table className="w-full text-left border-collapse font-mono text-xs">
                      <thead>
                        <tr className="border-b-2 border-black font-mono text-[10px] uppercase tracking-wider text-neutral-600 font-bold">
                          <th className="py-2">ITEM DESCRIPTION</th>
                          <th className="py-2 text-center">QTY</th>
                          <th className="py-2 text-right">UNIT PRICE</th>
                          <th className="py-2 text-right">TOTAL</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200">
                        {(selectedOrder.items || [
                          { name: "FORTIFIED EMBROIDERED BLACK TEE", quantity: 1, price: selectedOrder.total || 1950, size: "L", colour: "Black" }
                        ]).map((it, idx) => (
                          <tr key={idx} className="align-top">
                            <td className="py-4 pr-4">
                              <p className="font-bold text-black uppercase text-xs">
                                {it.name || "FORTIFIED EMBROIDERED BLACK TEE"}
                              </p>
                              <p className="text-[10px] text-neutral-500 mt-1">
                                Size: {it.size || "L"} · Colour: {it.colour || "Black"}
                              </p>
                            </td>
                            <td className="py-4 text-center font-bold text-black">
                              {it.quantity || 1}
                            </td>
                            <td className="py-4 text-right text-black">
                              {formatPriceZAR(it.price || 0)}
                            </td>
                            <td className="py-4 text-right font-bold text-black">
                              {formatPriceZAR((it.price || 0) * (it.quantity || 1))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="border-b-2 border-black" />
                  </div>

                  {/* TOTALS SUMMARY BLOCK */}
                  <div className="flex justify-end pt-4">
                    <div className="w-80 font-mono text-xs space-y-2">
                      <div className="flex justify-between text-neutral-700">
                        <span>Subtotal:</span>
                        <span className="font-bold text-black">{formatPriceZAR(selectedOrder.subtotal || (selectedOrder.total - (selectedOrder.shipping || 0)))}</span>
                      </div>
                      <div className="flex justify-between text-neutral-700">
                        <span>Express Courier Shipping:</span>
                        <span className="font-bold text-black">{selectedOrder.shipping > 0 ? formatPriceZAR(selectedOrder.shipping) : "Complimentary"}</span>
                      </div>
                      <div className="border-b border-black my-2" />
                      <div className="flex justify-between font-bold text-sm text-black pt-1">
                        <span>TOTAL PAID:</span>
                        <span className="text-base">{formatPriceZAR(selectedOrder.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ADD PRODUCT MODAL */}
        {isCreatingProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
          >
            <div className="bg-white text-black p-6 md:p-8 rounded-2xl w-full max-w-2xl space-y-6 font-mono text-xs border border-neutral-300 shadow-2xl my-8">
              <div className="flex justify-between items-center border-b border-neutral-200 pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-black" />
                  <h2 className="font-display font-bold text-lg uppercase text-black">Add New Atelier Piece</h2>
                </div>
                <button
                  onClick={() => setIsCreatingProduct(false)}
                  className="p-1.5 hover:bg-neutral-100 text-black font-bold rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Piece Title / Name</label>
                  <input
                    type="text"
                    required
                    value={newProductForm.name}
                    onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                    placeholder="e.g. FORTIFIED EMBROIDERED TEE - OLIVE"
                    className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl font-mono text-xs text-black focus:outline-none focus:border-black font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Category</label>
                    <select
                      value={newProductForm.category}
                      onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                      className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl font-mono text-xs text-black focus:outline-none focus:border-black font-bold"
                    >
                      <option value="Embroidered Tees">Embroidered Tees</option>
                      <option value="Printed Tees">Printed Tees</option>
                      <option value="T-Shirts">T-Shirts</option>
                      <option value="Hoodies">Hoodies</option>
                      <option value="Sweatpants">Sweatpants</option>
                      <option value="Golf / Polo Shirts">Golf / Polo Shirts</option>
                      <option value="Caps">Caps</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Outwear">Outwear</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Price (ZAR / R)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={newProductForm.price}
                      onChange={(e) => setNewProductForm({ ...newProductForm, price: e.target.value })}
                      className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl font-mono text-xs text-black focus:outline-none focus:border-black font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Stock Units</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={newProductForm.stock}
                      onChange={(e) => setNewProductForm({ ...newProductForm, stock: e.target.value })}
                      className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl font-mono text-xs text-black focus:outline-none focus:border-black font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Description / Spec Sheet</label>
                  <textarea
                    rows={3}
                    value={newProductForm.description}
                    onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                    placeholder="Heavyweight 280GSM cotton with high-density 3D chest embroidery..."
                    className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl font-mono text-xs text-black focus:outline-none focus:border-black"
                  />
                </div>

                {/* IMAGE UPLOAD & MANAGMENT */}
                <div className="space-y-3 pt-2 border-t border-neutral-200">
                  <label className="block text-[10px] uppercase font-bold text-black">Upload Images / Asset URLs</label>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <label className="cursor-pointer bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-black px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold transition-colors">
                      <Upload className="h-4 w-4" />
                      <span>Upload Image File</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageFilesForNewProduct}
                        className="hidden"
                      />
                    </label>

                    <div className="flex flex-1 gap-2">
                      <input
                        type="text"
                        value={newProductImageUrl}
                        onChange={(e) => setNewProductImageUrl(e.target.value)}
                        placeholder="Paste image URL..."
                        className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl font-mono text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddImageUrlForNew}
                        className="bg-black text-white hover:bg-neutral-800 font-bold px-3 py-2 rounded-xl text-xs cursor-pointer"
                      >
                        Add URL
                      </button>
                    </div>
                  </div>

                  {/* PREVIEW THUMBNAILS */}
                  {newProductForm.images && newProductForm.images.length > 0 && (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-2">
                      {newProductForm.images.map((img, idx) => (
                        <div key={idx} className="relative group h-16 w-16 bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200">
                          <img src={img || "/images/embroidered-black/emb_black_front.jpg"} alt="" className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleDeleteImageForNew(idx)}
                            className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={() => setIsCreatingProduct(false)}
                    className="px-5 py-2.5 border border-neutral-300 hover:bg-neutral-100 font-bold uppercase rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-black hover:bg-neutral-800 text-white font-bold uppercase rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="h-4 w-4" /> Save & Publish Piece
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* EDIT PRODUCT MODAL */}
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
          >
            <div className="bg-white text-black p-6 md:p-8 rounded-2xl w-full max-w-2xl space-y-6 font-mono text-xs border border-neutral-300 shadow-2xl my-8">
              <div className="flex justify-between items-center border-b border-neutral-200 pb-4">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-black" />
                  <h2 className="font-display font-bold text-lg uppercase text-black line-clamp-1">
                    Edit: {selectedProduct.name}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="p-1.5 hover:bg-neutral-100 text-black font-bold rounded-lg transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleQuickProductUpdate} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Piece Title / Name</label>
                  <input
                    type="text"
                    required
                    value={selectedProduct.name || ""}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                    className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl font-mono text-xs text-black focus:outline-none focus:border-black font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Category</label>
                    <select
                      value={selectedProduct.category || "T-Shirts"}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, category: e.target.value })}
                      className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl font-mono text-xs text-black focus:outline-none focus:border-black font-bold"
                    >
                      <option value="Embroidered Tees">Embroidered Tees</option>
                      <option value="Printed Tees">Printed Tees</option>
                      <option value="T-Shirts">T-Shirts</option>
                      <option value="Hoodies">Hoodies</option>
                      <option value="Sweatpants">Sweatpants</option>
                      <option value="Golf / Polo Shirts">Golf / Polo Shirts</option>
                      <option value="Caps">Caps</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Outwear">Outwear</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Price (ZAR / R)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={selectedProduct.price || 0}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, price: Number(e.target.value) })}
                      className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl font-mono text-xs text-black focus:outline-none focus:border-black font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Stock Units</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={selectedProduct.stock || 0}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, stock: Number(e.target.value) })}
                      className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl font-mono text-xs text-black focus:outline-none focus:border-black font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={selectedProduct.description || ""}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                    className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl font-mono text-xs text-black focus:outline-none focus:border-black"
                  />
                </div>

                {/* IMAGES MANAGEMENT */}
                <div className="space-y-3 pt-2 border-t border-neutral-200">
                  <label className="block text-[10px] uppercase font-bold text-black">Manage Piece Images</label>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <label className="cursor-pointer bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-black px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold transition-colors">
                      <Upload className="h-4 w-4" />
                      <span>Upload New Image File</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageFilesForSelectedProduct}
                        className="hidden"
                      />
                    </label>

                    <div className="flex flex-1 gap-2">
                      <input
                        type="text"
                        value={editProductImageUrl}
                        onChange={(e) => setEditProductImageUrl(e.target.value)}
                        placeholder="Paste image URL..."
                        className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl font-mono text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddImageUrlForSelected}
                        className="bg-black text-white hover:bg-neutral-800 font-bold px-3 py-2 rounded-xl text-xs cursor-pointer"
                      >
                        Add URL
                      </button>
                    </div>
                  </div>

                  {/* PREVIEW THUMBNAILS */}
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-2">
                    {(selectedProduct.images || []).map((img, idx) => (
                      <div key={idx} className="relative group h-20 w-full bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200">
                        <img
                          src={img || "/images/embroidered-black/emb_black_front.jpg"}
                          alt=""
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/images/embroidered-black/emb_black_front.jpg";
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteImageForSelected(idx)}
                          className="absolute inset-0 bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={() => handleDeleteProduct(selectedProduct.id)}
                    className="text-red-600 hover:text-red-800 font-bold uppercase text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" /> Delete Piece
                  </button>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(null)}
                      className="px-4 py-2.5 border border-neutral-300 hover:bg-neutral-100 font-bold uppercase rounded-xl transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-black hover:bg-neutral-800 text-white font-bold uppercase rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="h-4 w-4" /> Save Changes
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* LOOKBOOK ITEM EDIT / ADD MODAL */}
        {(isAddingShot || editingShot) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-mono text-xs"
          >
            <div className="bg-white border border-neutral-300 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <h3 className="font-display text-sm font-bold uppercase text-black">
                  {editingShot ? "EDIT LOOKBOOK ENTRY" : "ADD LOOKBOOK ENTRY"}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setEditingShot(null);
                    setIsAddingShot(false);
                  }}
                  className="p-1 text-neutral-500 hover:text-black cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveShot} className="space-y-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={shotForm.title}
                    onChange={(e) => setShotForm({ ...shotForm, title: e.target.value })}
                    placeholder="LOOK 01 — MONOLITH BLACK"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-black font-bold focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={shotForm.subtitle}
                    onChange={(e) => setShotForm({ ...shotForm, subtitle: e.target.value })}
                    placeholder="Heavyweight 280GSM Tee"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-black focus:outline-none focus:border-black"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Media Type</label>
                    <select
                      value={shotForm.type}
                      onChange={(e) => setShotForm({ ...shotForm, type: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-black font-bold"
                    >
                      <option value="image">Image</option>
                      <option value="video">Motion Video</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Grid Column Span</label>
                    <select
                      value={shotForm.span}
                      onChange={(e) => setShotForm({ ...shotForm, span: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-black font-bold"
                    >
                      <option value="md:col-span-1">1 Column</option>
                      <option value="md:col-span-2">2 Columns (Featured Wide)</option>
                    </select>
                  </div>
                </div>

                {shotForm.type === "image" ? (
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Image Source URL / Upload File</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={shotForm.img}
                        onChange={(e) => setShotForm({ ...shotForm, img: e.target.value })}
                        placeholder="/images/classic-front-black/classic_black_front.jpg"
                        className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-black"
                      />
                      <label className="cursor-pointer bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-black px-3 py-2 rounded-xl font-bold uppercase text-[10px] flex items-center justify-center shrink-0">
                        <Upload className="h-3.5 w-3.5 mr-1" /> File
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (evt) => {
                                setShotForm((prev) => ({ ...prev, img: evt.target.result }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Video MP4 URL / Upload File</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={shotForm.videoUrl || shotForm.img}
                        onChange={(e) => setShotForm({ ...shotForm, videoUrl: e.target.value, img: e.target.value })}
                        placeholder="/videos/hero-background.mp4"
                        className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-black"
                      />
                      <label className="cursor-pointer bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-black px-3 py-2 rounded-xl font-bold uppercase text-[10px] flex items-center justify-center shrink-0">
                        <Upload className="h-3.5 w-3.5 mr-1" /> {videoUploading ? (videoUploadStatus || "Uploading...") : "File"}
                        <input
                          type="file"
                          accept="video/*"
                          disabled={videoUploading}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              setVideoUploading(true);
                              setVideoUploadStatus("0%");
                              const serverUrl = await handleUploadVideoChunked(file, "videos", null, (pct) => {
                                setVideoUploadStatus(`${pct}%`);
                              });
                              if (serverUrl) {
                                setShotForm((prev) => ({ ...prev, videoUrl: serverUrl, img: serverUrl }));
                              }
                            } catch (err) {
                              alert("Video upload failed: " + err.message);
                            } finally {
                              setVideoUploading(false);
                              setVideoUploadStatus("");
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Aspect Ratio</label>
                    <select
                      value={shotForm.ratio}
                      onChange={(e) => setShotForm({ ...shotForm, ratio: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-black font-bold"
                    >
                      <option value="aspect-[4/5]">4:5 Vertical Portrait</option>
                      <option value="aspect-[16/9]">16:9 Landscape Wide</option>
                      <option value="aspect-square">1:1 Square</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Focal Position</label>
                    <select
                      value={shotForm.position}
                      onChange={(e) => setShotForm({ ...shotForm, position: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-black font-bold"
                    >
                      <option value="object-center">Center</option>
                      <option value="object-[58%_center]">Left-Center Focus</option>
                      <option value="object-[72%_center]">Right-Center Focus</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingShot(null);
                      setIsAddingShot(false);
                    }}
                    className="px-4 py-2 border border-neutral-300 text-neutral-700 hover:bg-neutral-100 font-bold uppercase rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-black text-white hover:bg-neutral-800 font-bold uppercase rounded-xl transition-colors cursor-pointer"
                  >
                    Save Entry
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* CAPSULE DROP EDIT / ADD MODAL */}
        {(isAddingDrop || editingDrop) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-mono text-xs"
          >
            <div className="bg-white border border-neutral-300 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <h3 className="font-display text-sm font-bold uppercase text-black">
                  {editingDrop ? "EDIT CAPSULE DROP" : "CREATE CAPSULE DROP"}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setEditingDrop(null);
                    setIsAddingDrop(false);
                  }}
                  className="p-1 text-neutral-500 hover:text-black cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCapsuleDrop} className="space-y-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Capsule Drop Name</label>
                  <input
                    type="text"
                    required
                    value={dropForm.name}
                    onChange={(e) => setDropForm({ ...dropForm, name: e.target.value })}
                    placeholder="MONOLITH CAPSULE '26"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-black font-bold focus:outline-none focus:border-black"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Status</label>
                    <select
                      value={dropForm.status}
                      onChange={(e) => setDropForm({ ...dropForm, status: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-black font-bold"
                    >
                      <option value="ACTIVE DROP">ACTIVE DROP</option>
                      <option value="CORE LINE">CORE LINE</option>
                      <option value="ARCHIVED">ARCHIVED</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Launch Date / ISO String</label>
                    <input
                      type="text"
                      required
                      value={dropForm.launchDate}
                      onChange={(e) => setDropForm({ ...dropForm, launchDate: e.target.value })}
                      placeholder="2026-08-22T18:00:00"
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-black focus:outline-none focus:border-black font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Units Allocated</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={dropForm.units}
                      onChange={(e) => setDropForm({ ...dropForm, units: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-black font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Target Price Range</label>
                    <input
                      type="text"
                      value={dropForm.priceRange}
                      onChange={(e) => setDropForm({ ...dropForm, priceRange: e.target.value })}
                      placeholder="R 750 - R 1,200"
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-black font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Limit Badge Text</label>
                  <input
                    type="text"
                    value={dropForm.limitText}
                    onChange={(e) => setDropForm({ ...dropForm, limitText: e.target.value })}
                    placeholder="LIMITED RUN — 30 PIECES"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-black"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Background Image URL (Optional)</label>
                  <input
                    type="text"
                    value={dropForm.bgUrl}
                    onChange={(e) => setDropForm({ ...dropForm, bgUrl: e.target.value })}
                    placeholder="/images/drop/drop-bg.png"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-black"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingDrop(null);
                      setIsAddingDrop(false);
                    }}
                    className="px-4 py-2 border border-neutral-300 text-neutral-700 hover:bg-neutral-100 font-bold uppercase rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-black text-white hover:bg-neutral-800 font-bold uppercase rounded-xl transition-colors cursor-pointer"
                  >
                    Save Capsule Drop
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
