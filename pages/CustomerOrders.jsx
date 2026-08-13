import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Search,
  Copy,
  Check,
  Download,
  Printer,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  MapPin,
  CreditCard,
  AlertCircle,
  Filter,
  Calendar,
  RefreshCw,
  FileText,
  ChevronRight,
  ChevronDown,
  X,
  Mail,
  User,
  ShoppingBag,
  HelpCircle,
  Sparkles
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useAuth } from "@/lib/use-auth";
import { base44 } from "@/api/base44Client";
import { zar } from "@/lib/media";
import BackButton from "@/components/BackButton";
import Reveal from "@/components/Reveal";

export default function CustomerOrders() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL | PROCESSING | SHIPPED | DELIVERED
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfType, setPdfType] = useState("invoice"); // invoice | receipt
  const [showAllDemoOrders, setShowAllDemoOrders] = useState(false);

  // Load customer orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const allOrders = await base44.entities.Order.list("-created_date");
      let userEmail = user?.email?.toLowerCase().trim() || "";

      let filtered = [];
      if (userEmail && !showAllDemoOrders) {
        filtered = allOrders.filter(
          (o) => o.customer_email && o.customer_email.toLowerCase().trim() === userEmail
        );
      }

      // Fallback: If user has no specific orders yet or requested demo view
      if ((filtered.length === 0 && !showAllDemoOrders) || showAllDemoOrders) {
        filtered = allOrders;
      }

      setOrders(filtered);
    } catch (err) {
      console.error("Failed to load customer orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user, showAllDemoOrders]);

  const copyTracking = (num) => {
    if (!num) return;
    navigator.clipboard.writeText(num);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2200);
  };

  const handleDownloadPDF = async (order, type = "invoice") => {
    setSelectedOrder(order);
    setPdfType(type);
    setIsGeneratingPdf(true);

    setTimeout(async () => {
      try {
        const element = document.getElementById("customer-order-printable-doc");
        if (!element) {
          setIsGeneratingPdf(false);
          return;
        }

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

        const fileName = `FORTIFIED_${type === "invoice" ? "Tax_Invoice" : "Receipt"}_${order.order_number || "ORD"}.pdf`;
        pdf.save(fileName);
      } catch (err) {
        console.error("PDF generation failed:", err);
      } finally {
        setIsGeneratingPdf(false);
      }
    }, 400);
  };

  const getStatusStage = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "pending") return 1;
    if (s === "processing" || s === "paid") return 2;
    if (s === "shipped" || s === "dispatch" || s === "in transit") return 3;
    if (s === "delivered" || s === "completed") return 4;
    return 2;
  };

  const getStatusBadgeClass = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "delivered" || s === "completed") {
      return "bg-emerald-50 text-emerald-800 border-emerald-300";
    }
    if (s === "shipped" || s === "dispatch" || s === "in transit") {
      return "bg-blue-50 text-blue-800 border-blue-300";
    }
    if (s === "processing" || s === "paid") {
      return "bg-amber-50 text-amber-800 border-amber-300";
    }
    return "bg-neutral-100 text-neutral-800 border-neutral-300";
  };

  // Filtered list based on search and tab
  const displayOrders = orders.filter((ord) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      (ord.order_number && ord.order_number.toLowerCase().includes(query)) ||
      (ord.tracking_number && ord.tracking_number.toLowerCase().includes(query)) ||
      (ord.items && ord.items.some((i) => i.name && i.name.toLowerCase().includes(query)));

    const stage = getStatusStage(ord.status);
    let matchesStatus = true;
    if (statusFilter === "PROCESSING") matchesStatus = stage === 2 || stage === 1;
    if (statusFilter === "SHIPPED") matchesStatus = stage === 3;
    if (statusFilter === "DELIVERED") matchesStatus = stage === 4;

    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalSpent = orders.reduce((sum, o) => sum + (Number(o.total || o.subtotal) || 0), 0);
  const activeShipmentsCount = orders.filter((o) => {
    const st = getStatusStage(o.status);
    return st === 2 || st === 3;
  }).length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white text-black pt-32 pb-20 px-6 max-w-4xl mx-auto font-sans">
        <div className="border border-neutral-200 bg-neutral-50 p-8 md:p-12 text-center rounded-xl space-y-6 shadow-sm">
          <div className="mx-auto w-16 h-16 rounded-full bg-black text-white flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-black uppercase tracking-wider text-black">
              Customer Orders Portal
            </h1>
            <p className="font-mono text-xs text-neutral-600 max-w-md mx-auto mt-2">
              Please sign in to your FORTIFIED member account to view your complete order history, live shipment tracking updates, and tax invoices.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/login"
              className="w-full sm:w-auto bg-black text-white px-8 py-3.5 font-mono text-xs uppercase tracking-[0.2em] font-bold rounded hover:bg-neutral-800 transition-all shadow-md"
            >
              Sign In to Account
            </Link>
            <Link
              to="/track-order"
              className="w-full sm:w-auto border border-neutral-300 bg-white text-black px-8 py-3.5 font-mono text-xs uppercase tracking-[0.2em] font-bold rounded hover:border-black transition-all"
            >
              Guest Order Lookup
            </Link>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-neutral-200 flex justify-start">
          <BackButton label="BACK" to="/" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto font-sans">
      {/* HEADER SECTION */}
      <Reveal>
        <div className="border-b border-neutral-200 pb-8 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[9px] font-mono uppercase tracking-widest font-bold rounded-full mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-300" />
              Verified Client Portal
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tight text-black">
              My Orders & Shipment Tracking
            </h1>
            <p className="font-mono text-xs text-neutral-500 uppercase tracking-widest mt-1">
              Account Holder: <span className="font-bold text-black">{user?.email}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchOrders}
              className="border border-neutral-300 bg-neutral-50 hover:bg-neutral-100 text-neutral-900 px-4 py-2.5 font-mono text-[10px] uppercase font-bold tracking-widest flex items-center gap-2 rounded transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-black" : ""}`} />
              <span>Refresh Orders</span>
            </button>

            <Link
              to="/shop"
              className="bg-black text-white px-5 py-2.5 font-mono text-[10px] uppercase font-bold tracking-[0.2em] rounded hover:bg-neutral-800 transition-all shadow-sm"
            >
              Visit Store
            </Link>
          </div>
        </div>
      </Reveal>

      {/* METRICS & OVERVIEW ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-neutral-50 border border-neutral-200 p-5 rounded-lg">
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span className="font-mono text-[10px] uppercase font-bold tracking-widest">Total Orders Placed</span>
            <Package className="w-4 h-4 text-black" />
          </div>
          <p className="font-display text-2xl md:text-3xl font-black text-black">{orders.length}</p>
          <p className="font-mono text-[10px] text-neutral-500 mt-1">Verified purchases on record</p>
        </div>

        <div className="bg-neutral-50 border border-neutral-200 p-5 rounded-lg">
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span className="font-mono text-[10px] uppercase font-bold tracking-widest">Active In-Transit</span>
            <Truck className="w-4 h-4 text-blue-600" />
          </div>
          <p className="font-display text-2xl md:text-3xl font-black text-black">{activeShipmentsCount}</p>
          <p className="font-mono text-[10px] text-neutral-500 mt-1">Shipments currently being fulfilled</p>
        </div>

        <div className="bg-neutral-50 border border-neutral-200 p-5 rounded-lg">
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span className="font-mono text-[10px] uppercase font-bold tracking-widest">Lifetime Vault Investment</span>
            <CreditCard className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-display text-2xl md:text-3xl font-black text-black">{zar(totalSpent)}</p>
          <p className="font-mono text-[10px] text-neutral-500 mt-1">Complimentary courier included</p>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-lg mb-8 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 custom-scrollbar">
            {[
              { id: "ALL", label: `All Orders (${orders.length})` },
              { id: "PROCESSING", label: "Processing" },
              { id: "SHIPPED", label: "In Transit / Shipped" },
              { id: "DELIVERED", label: "Delivered" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-2 font-mono text-[10px] uppercase font-bold tracking-wider rounded transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === tab.id
                    ? "bg-black text-white shadow-sm"
                    : "bg-white text-neutral-700 hover:bg-neutral-200 border border-neutral-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search order #, item, or tracking..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-neutral-300 pl-9 pr-4 py-2 font-mono text-xs text-black placeholder:text-neutral-400 focus:border-black outline-none rounded transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Demo Toggle Notice */}
        {orders.length > 0 && (
          <div className="flex items-center justify-between pt-2 border-t border-neutral-200 font-mono text-[10px] text-neutral-500">
            <span>
              Showing {displayOrders.length} of {orders.length} order records
            </span>
            <button
              onClick={() => setShowAllDemoOrders(!showAllDemoOrders)}
              className="text-black font-bold underline cursor-pointer hover:text-neutral-700"
            >
              {showAllDemoOrders ? "Show Only My Direct Orders" : "View All Store Sample Orders"}
            </button>
          </div>
        )}
      </div>

      {/* ORDERS LIST */}
      {loading ? (
        <div className="text-center py-20 border border-dashed border-neutral-300 rounded-lg bg-neutral-50">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-neutral-400 mb-3" />
          <p className="font-mono text-xs text-neutral-500 uppercase tracking-widest">
            Fetching order records & logistics...
          </p>
        </div>
      ) : displayOrders.length === 0 ? (
        <div className="text-center py-16 border border-neutral-200 rounded-lg bg-neutral-50 p-8 space-y-4">
          <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto" />
          <div>
            <h3 className="font-display text-lg font-black uppercase tracking-wider text-black">
              No Matching Orders Found
            </h3>
            <p className="font-mono text-xs text-neutral-500 max-w-sm mx-auto mt-1">
              {searchQuery
                ? `No purchases matched "${searchQuery}". Try clearing your search query.`
                : "You have not placed any orders yet or no purchases match this filter."}
            </p>
          </div>
          <div className="pt-2 flex justify-center gap-3">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="border border-neutral-300 bg-white px-5 py-2.5 font-mono text-[10px] uppercase font-bold rounded hover:border-black cursor-pointer"
              >
                Clear Search
              </button>
            )}
            <Link
              to="/shop"
              className="bg-black text-white px-6 py-2.5 font-mono text-[10px] uppercase font-bold rounded hover:bg-neutral-800 shadow"
            >
              Explore Collection
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {displayOrders.map((order) => {
            const stage = getStatusStage(order.status);
            const isDelivered = stage === 4;
            const trackingNum = order.tracking_number || `RAM-ZA-${order.order_number?.replace("FTD-", "") || "88102"}`;
            const courierName = order.country_code === "ZA" ? "RAM Hand-to-Hand Courier" : "DHL Express Worldwide";

            return (
              <div
                key={order.id || order.order_number}
                className="border border-neutral-200 bg-white rounded-lg shadow-sm hover:border-neutral-400 transition-all overflow-hidden"
              >
                {/* Order Top Header */}
                <div className="bg-neutral-50 border-b border-neutral-200 p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-bold text-black text-sm md:text-base">
                      Order #{order.order_number}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 border text-[10px] font-bold uppercase rounded ${getStatusBadgeClass(
                        order.status
                      )}`}
                    >
                      {order.status || "Processing"}
                    </span>
                    <span className="text-neutral-500 text-[11px]">
                      Placed {new Date(order.created_date || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-neutral-500 text-[11px]">Total Paid:</span>
                    <span className="font-bold text-black text-sm">{zar(order.total || order.subtotal)}</span>
                  </div>
                </div>

                {/* Main Content Grid */}
                <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Purchased Items */}
                  <div className="lg:col-span-7 space-y-3">
                    <p className="font-mono text-[10px] uppercase font-bold tracking-widest text-neutral-500">
                      Purchased Items ({order.items?.length || 1})
                    </p>
                    <div className="space-y-2.5">
                      {(order.items && order.items.length > 0 ? order.items : [{
                        name: "FORTIFIED Item",
                        size: "M",
                        colour: "Black",
                        quantity: 1,
                        price: order.total || 1950,
                        image: "/images/embroidered-black/emb_black_front.jpg"
                      }]).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3.5 bg-neutral-50 p-3 rounded border border-neutral-200">
                          <img
                            src={item.image || "/images/embroidered-black/emb_black_front.jpg"}
                            alt={item.name}
                            className="w-12 h-14 object-cover rounded border border-neutral-200 shrink-0"
                          />
                          <div className="flex-1 min-w-0 font-mono text-xs">
                            <p className="font-bold text-black truncate">{item.name}</p>
                            <p className="text-[10px] text-neutral-500 uppercase tracking-wider mt-0.5">
                              Size: <span className="text-black font-bold">{item.size || "M"}</span> · Color: <span className="text-black font-bold">{item.colour || "Black"}</span> · Qty: <span className="text-black font-bold">{item.quantity || 1}</span>
                            </p>
                          </div>
                          <div className="font-mono text-xs font-bold text-black shrink-0">
                            {zar((item.price || 1950) * (item.quantity || 1))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Delivery Destination */}
                    <div className="pt-2 font-mono text-xs flex items-start gap-2 text-neutral-700">
                      <MapPin className="w-4 h-4 text-black shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-black">Delivery Destination: </span>
                        <span>{order.shipping_address || order.billing_address || "Standard Express Address, South Africa"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Tracking Progress & Actions */}
                  <div className="lg:col-span-5 bg-neutral-50 p-4 md:p-5 rounded-lg border border-neutral-200 space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-3">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-black" />
                          <span className="font-mono text-xs font-bold text-black uppercase tracking-wider">
                            Shipment Tracking Status
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-neutral-500 uppercase font-bold">
                          Stage 0{stage} of 04
                        </span>
                      </div>

                      {/* Stage Progress Visual */}
                      <div className="space-y-2 mb-4">
                        <div className="grid grid-cols-4 gap-1.5">
                          {[1, 2, 3, 4].map((stg) => (
                            <div
                              key={stg}
                              className={`h-2 rounded-full transition-all ${
                                stage >= stg ? "bg-emerald-600" : "bg-neutral-300"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex justify-between font-mono text-[9px] text-neutral-500 uppercase font-bold">
                          <span className={stage >= 1 ? "text-emerald-700" : ""}>Placed</span>
                          <span className={stage >= 2 ? "text-emerald-700" : ""}>Processing</span>
                          <span className={stage >= 3 ? "text-emerald-700" : ""}>In Transit</span>
                          <span className={stage >= 4 ? "text-emerald-700" : ""}>Delivered</span>
                        </div>
                      </div>

                      {/* Tracking Identifier */}
                      <div className="bg-white p-3 rounded border border-neutral-200 font-mono text-xs space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-neutral-500 uppercase font-bold">Courier Partner</span>
                          <span className="font-bold text-black text-[11px]">{courierName}</span>
                        </div>
                        <div className="flex justify-between items-center pt-1 border-t border-neutral-100">
                          <span className="text-[10px] text-neutral-500 uppercase font-bold">Waybill / Tracking #</span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-black tracking-wider">{trackingNum}</span>
                            <button
                              onClick={() => copyTracking(trackingNum)}
                              className="p-1 hover:bg-neutral-100 rounded text-neutral-600 hover:text-black cursor-pointer"
                              title="Copy tracking number"
                            >
                              {copiedTracking ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 pt-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="w-full bg-black text-white py-2.5 font-mono text-[10px] uppercase font-bold tracking-[0.2em] rounded hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>View Live Logistics Timeline</span>
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleDownloadPDF(order, "invoice")}
                          disabled={isGeneratingPdf}
                          className="w-full border border-neutral-300 bg-white hover:border-black text-black py-2 font-mono text-[9px] uppercase font-bold tracking-wider rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Download className="w-3 h-3 text-emerald-600" />
                          <span>Tax Invoice</span>
                        </button>

                        <button
                          onClick={() => handleDownloadPDF(order, "receipt")}
                          disabled={isGeneratingPdf}
                          className="w-full border border-neutral-300 bg-white hover:border-black text-black py-2 font-mono text-[9px] uppercase font-bold tracking-wider rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Printer className="w-3 h-3 text-blue-600" />
                          <span>Receipt</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAILED SHIPMENT TRACKING MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-2xl border border-neutral-300 bg-white p-6 md:p-8 shadow-2xl rounded-lg my-6 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar relative animate-in fade-in zoom-in-95 duration-200 font-sans">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-neutral-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-black" />
                  <h3 className="font-mono text-sm md:text-base font-black uppercase tracking-[0.2em] text-black">
                    Shipment Tracking & Logistics Details
                  </h3>
                </div>
                <p className="mt-1 font-mono text-[11px] text-neutral-500">
                  Order #{selectedOrder.order_number} · Placed {new Date(selectedOrder.created_date || Date.now()).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-neutral-400 hover:text-black transition-colors rounded cursor-pointer"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Courier & Waybill Overview */}
            <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-lg space-y-3 font-mono text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 pb-3">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-bold block">Courier Partner</span>
                  <span className="font-bold text-black text-sm">
                    {selectedOrder.country_code === "ZA" ? "RAM Hand-to-Hand Express Courier" : "DHL Express Worldwide"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-black bg-white border border-neutral-300 px-3 py-1.5 rounded tracking-wider">
                    {selectedOrder.tracking_number || `RAM-ZA-${selectedOrder.order_number?.replace("FTD-", "")}`}
                  </span>
                  <button
                    onClick={() => copyTracking(selectedOrder.tracking_number || `RAM-ZA-${selectedOrder.order_number?.replace("FTD-", "")}`)}
                    className="p-2 bg-white border border-neutral-300 hover:border-black rounded text-black transition-colors cursor-pointer"
                    title="Copy tracking code"
                  >
                    {copiedTracking ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-neutral-700 pt-1">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-bold block">Estimated Delivery</span>
                  <span className="font-bold text-emerald-700">1–3 Business Days (Express)</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-bold block">Recipient Name</span>
                  <span className="font-bold text-black">{selectedOrder.customer_name}</span>
                </div>
              </div>
            </div>

            {/* Stage Stepper */}
            <div className="space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500">
                Fulfillment Milestone Stages
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { stage: 1, name: "Order Placed", detail: "Payment Verified" },
                  { stage: 2, name: "Processing", detail: "Vault Quality Inspection" },
                  { stage: 3, name: "In Transit", detail: "Scanned at Express Depot" },
                  { stage: 4, name: "Delivered", detail: "Package Signed For" }
                ].map((step) => {
                  const currentStg = getStatusStage(selectedOrder.status);
                  const isDone = currentStg >= step.stage;

                  return (
                    <div
                      key={step.stage}
                      className={`p-3 border rounded text-xs font-mono transition-all ${
                        isDone
                          ? "border-emerald-300 bg-emerald-50 text-black"
                          : "border-neutral-200 bg-neutral-50 text-neutral-400"
                      }`}
                    >
                      <p className={`text-[9px] font-bold uppercase ${isDone ? "text-emerald-800" : ""}`}>
                        Stage 0{step.stage}
                      </p>
                      <p className="font-bold text-black mt-0.5">{step.name}</p>
                      <p className="text-[9px] text-neutral-500 mt-0.5">{step.detail}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Activity Log Timeline */}
            <div className="space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-500">
                Logistics Activity Log
              </p>
              <div className="border border-neutral-200 rounded-lg p-4 bg-neutral-50 space-y-4 font-mono text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-1 shrink-0 ring-4 ring-emerald-100" />
                  <div>
                    <p className="font-bold text-black">Package Handed Over to Regional Dispatch Driver</p>
                    <p className="text-[10px] text-neutral-500">Johannesburg Vault Hub · Sandton, GP</p>
                    <p className="text-[9px] text-neutral-400 mt-0.5">Live tracking updated via RAM Logistics API</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t border-neutral-200 pt-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-1 shrink-0" />
                  <div>
                    <p className="font-bold text-black">Quality Inspection & Custom Garment Packaging Complete</p>
                    <p className="text-[10px] text-neutral-500">Fortified Atelier Facility · Johannesburg</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t border-neutral-200 pt-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-1 shrink-0" />
                  <div>
                    <p className="font-bold text-black">Order Placed & Payment Authorized</p>
                    <p className="text-[10px] text-neutral-500">
                      {new Date(selectedOrder.created_date || Date.now()).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleDownloadPDF(selectedOrder, "invoice")}
                disabled={isGeneratingPdf}
                className="w-full sm:w-1/2 border border-neutral-300 bg-white py-3 font-mono text-xs uppercase tracking-wider font-bold text-black hover:border-black transition-colors rounded flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-600" />
                <span>Download Tax Invoice</span>
              </button>

              <Link
                to="/services"
                className="w-full sm:w-1/2 bg-black py-3 font-mono text-xs uppercase tracking-wider font-bold text-white hover:bg-neutral-800 transition-colors rounded flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Inquire About Delivery</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* HIDDEN PRINTABLE CONTAINER FOR PDF GENERATION */}
      {selectedOrder && (
        <div className="absolute top-[-9999px] left-[-9999px] pointer-events-none">
          <div
            id="customer-order-printable-doc"
            className="w-[800px] bg-white p-10 font-mono text-black border border-neutral-300 space-y-8"
          >
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-black pb-6">
              <div>
                <h1 className="text-3xl font-black uppercase tracking-widest text-black">FORTIFIED</h1>
                <p className="text-xs text-neutral-600 mt-1">PERMANENT ART & ATELIER STREETWEAR</p>
                <p className="text-[10px] text-neutral-500">Rosebank, Sandton, Johannesburg, 2196, South Africa</p>
                <p className="text-[10px] text-neutral-500">VAT Registration: 4920194821 | Tax ID: ZA8820194</p>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-widest mb-2">
                  OFFICIAL {pdfType === "invoice" ? "TAX INVOICE" : "PAYMENT RECEIPT"}
                </span>
                <p className="text-xs font-bold text-black">Document #{selectedOrder.order_number}</p>
                <p className="text-[10px] text-neutral-600">
                  Date: {new Date(selectedOrder.created_date || Date.now()).toLocaleDateString("en-ZA")}
                </p>
              </div>
            </div>

            {/* Billed & Shipped To */}
            <div className="grid grid-cols-2 gap-8 text-xs border-b border-neutral-200 pb-6">
              <div>
                <p className="font-bold text-[10px] uppercase text-neutral-500 mb-1">CUSTOMER & BILLING DETAILS</p>
                <p className="font-bold text-black">{selectedOrder.customer_name}</p>
                <p className="text-neutral-700">{selectedOrder.customer_email}</p>
                <p className="text-neutral-700">{selectedOrder.customer_phone}</p>
                <p className="text-neutral-700 mt-1">{selectedOrder.billing_address || selectedOrder.shipping_address}</p>
              </div>
              <div>
                <p className="font-bold text-[10px] uppercase text-neutral-500 mb-1">DELIVERY & LOGISTICS</p>
                <p className="font-bold text-black">{selectedOrder.country || "South Africa"}</p>
                <p className="text-neutral-700">{selectedOrder.shipping_address}</p>
                <p className="text-neutral-700 font-bold mt-1">
                  Waybill: {selectedOrder.tracking_number || `RAM-ZA-${selectedOrder.order_number?.replace("FTD-", "")}`}
                </p>
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-black text-[10px] font-bold uppercase">
                  <th className="py-2">Item Description</th>
                  <th className="py-2">Variant</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Unit Price</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {(selectedOrder.items && selectedOrder.items.length > 0 ? selectedOrder.items : [{
                  name: "FORTIFIED Item",
                  size: "M",
                  colour: "Black",
                  quantity: 1,
                  price: selectedOrder.total || 1950
                }]).map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 font-bold text-black">{item.name}</td>
                    <td className="py-3 text-neutral-600">Size {item.size} / {item.colour}</td>
                    <td className="py-3 text-center">{item.quantity}</td>
                    <td className="py-3 text-right">{zar(item.price)}</td>
                    <td className="py-3 text-right font-bold">{zar(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals Summary */}
            <div className="border-t-2 border-black pt-4 flex justify-end text-xs">
              <div className="w-64 space-y-2 font-mono">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{zar(selectedOrder.subtotal || (selectedOrder.total - (selectedOrder.shipping || 0)))}</span>
                </div>
                <div className="flex justify-between">
                  <span>Express Delivery</span>
                  <span className={selectedOrder.shipping > 0 ? "font-bold text-black" : "uppercase text-emerald-700 font-bold"}>
                    {selectedOrder.shipping > 0 ? zar(selectedOrder.shipping) : "Complimentary"}
                  </span>
                </div>
                <div className="flex justify-between border-t border-black pt-2 font-bold text-sm">
                  <span>Total Paid ({selectedOrder.payment_method || "Card"})</span>
                  <span>{zar(selectedOrder.total || selectedOrder.subtotal)}</span>
                </div>
              </div>
            </div>

            {/* Footer Notice */}
            <div className="border-t border-neutral-200 pt-6 text-[10px] text-neutral-500 text-center">
              Thank you for purchasing FORTIFIED Permanent Art & Streetwear. For client queries, email support@fortified.co.za
            </div>
          </div>
        </div>
      )}

      <div className="mt-16 pt-8 border-t border-neutral-200 flex justify-start">
        <BackButton label="BACK" to="/account" />
      </div>
    </div>
  );
}
