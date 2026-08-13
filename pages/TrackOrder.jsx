import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  Download,
  ArrowRight,
  AlertCircle,
  Copy,
  Check,
  CreditCard,
  User,
  Mail,
  Phone,
  Printer,
  RefreshCw
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { base44 } from "@/api/base44Client";
import { zar } from "@/lib/media";
import { useAuth } from "@/lib/use-auth";
import Reveal from "@/components/Reveal";
import BackButton from "@/components/BackButton";

import { getYocoCheckoutStatus } from "@/lib/paymentGateways";

export default function TrackOrder() {
  const { user, isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialOrderNum = searchParams.get("order") || "";

  const [orderQuery, setOrderQuery] = useState(initialOrderNum);
  const [emailQuery, setEmailQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [recentOrders, setRecentOrders] = useState([]);

  // Load sample / recent order numbers for quick testing
  useEffect(() => {
    base44.entities.Order.list("-created_date", 5)
      .then((list) => {
        setRecentOrders(list || []);
      })
      .catch((err) => console.error("Error loading recent orders:", err));
  }, []);

  // Auto search if query param present
  useEffect(() => {
    if (initialOrderNum.trim()) {
      handleSearchOrder(initialOrderNum.trim());
    }
  }, [initialOrderNum]);

  const handleSearchOrder = async (queryToSearch) => {
    const query = (queryToSearch || orderQuery).trim();
    if (!query && !emailQuery.trim()) {
      setErrorMsg("Please enter an Order Number or Email Address to search.");
      return;
    }

    setSearching(true);
    setErrorMsg("");
    setSearched(true);

    try {
      const allOrders = await base44.entities.Order.list("-created_date");
      
      let matchedOrder = null;
      if (query) {
        const cleanQuery = query.toLowerCase().replace(/#/g, "");
        matchedOrder = allOrders.find(
          (o) =>
            (o.order_number && o.order_number.toLowerCase().includes(cleanQuery)) ||
            (o.id && o.id.toLowerCase().includes(cleanQuery)) ||
            (o.tracking_number && o.tracking_number.toLowerCase().includes(cleanQuery))
        );
      }

      if (!matchedOrder && emailQuery.trim()) {
        const cleanEmail = emailQuery.trim().toLowerCase();
        matchedOrder = allOrders.find(
          (o) => o.customer_email && o.customer_email.toLowerCase() === cleanEmail
        );
      }

      if (matchedOrder) {
        const yocoStatus = searchParams.get("yoco_status") || searchParams.get("payment") || searchParams.get("status");
        const checkoutId = searchParams.get("checkoutId") || searchParams.get("checkout_id") || searchParams.get("id");

        if ((yocoStatus === "success" || yocoStatus === "successful" || checkoutId) && matchedOrder.payment_status !== "Paid") {
          try {
            if (checkoutId) {
              await getYocoCheckoutStatus(checkoutId);
            }
            await base44.entities.Order.update(matchedOrder.id, {
              payment_status: "Paid",
              status: "processing",
            });
            matchedOrder = {
              ...matchedOrder,
              payment_status: "Paid",
              status: "processing",
            };
          } catch (e) {
            console.warn("Error verifying/updating order payment status:", e);
          }
        }
        setOrderResult(matchedOrder);
        setSearchParams({ order: matchedOrder.order_number });
      } else {
        setOrderResult(null);
        setErrorMsg(`No active purchase found matching "${query || emailQuery}". Please verify your order details.`);
      }
    } catch (err) {
      console.error("Order lookup error:", err);
      setErrorMsg("Failed to query order database. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const copyTracking = (num) => {
    if (!num) return;
    navigator.clipboard.writeText(num);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2500);
  };

  const handleDownloadPDF = async (type = "invoice") => {
    if (!orderResult) return;
    setIsGeneratingPdf(true);

    setTimeout(async () => {
      try {
        const element = document.getElementById("order-tracking-printable-document");
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

        const fileName = `FORTIFIED_${type === "invoice" ? "Tax_Invoice" : "Receipt"}_${orderResult.order_number || "ORD"}.pdf`;
        pdf.save(fileName);
      } catch (err) {
        console.error("PDF export failed:", err);
      } finally {
        setIsGeneratingPdf(false);
      }
    }, 300);
  };

  // Compute status timeline stages
  const getStatusStage = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "pending") return 1;
    if (s === "processing" || s === "paid") return 2;
    if (s === "shipped" || s === "dispatch" || s === "in transit") return 3;
    if (s === "delivered" || s === "completed") return 4;
    return 2; // default processing
  };

  const currentStage = orderResult ? getStatusStage(orderResult.status) : 1;

  const timelineSteps = [
    { stage: 1, label: "Order Placed", desc: "Order details received & verified" },
    { stage: 2, label: "Processing", desc: "Quality inspection & packaging" },
    { stage: 3, label: "Shipped", desc: "Handed to courier express" },
    { stage: 4, label: "Delivered", desc: "Package signed & delivered" }
  ];

  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-28 pt-36 md:px-12 text-neutral-900 bg-white">
      {/* HEADER SECTION */}
      <Reveal>
        {isAuthenticated && (
          <div className="mb-6 p-4 bg-black text-white rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs shadow-md">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Logged in as <strong className="text-white">{user?.email}</strong>
              </span>
            </div>
            <Link
              to="/my-orders"
              className="inline-flex items-center gap-1.5 bg-white text-black font-bold uppercase text-[10px] tracking-widest px-3.5 py-2 rounded hover:bg-neutral-200 transition-all shrink-0"
            >
              <span>View All My Orders & Tracking Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-200 pb-8 gap-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-neutral-500 font-bold">
              CLIENT SERVICES & LOGISTICS
            </p>
            <h1 className="mt-3 font-display text-5xl font-black tracking-tight text-black md:text-7xl uppercase">
              Track Your Order
            </h1>
            <p className="mt-2 font-mono text-xs text-neutral-600 max-w-xl">
              Enter your FORTIFIED order number or registered email to view real-time fulfillment status, tracking identifiers, and download tax documentation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/services"
              className="font-mono text-[10px] uppercase tracking-[0.2em] border border-neutral-300 bg-neutral-100 px-4 py-3 hover:border-black transition-all text-neutral-900 hover:text-black font-bold"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </Reveal>

      {/* SEARCH BOX */}
      <div className="mt-10 bg-neutral-50 border border-neutral-200 p-6 md:p-8 space-y-6 shadow-sm rounded-lg">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearchOrder();
          }}
          className="grid gap-4 md:grid-cols-12 items-end"
        >
          <div className="md:col-span-5 space-y-2">
            <label className="block font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-700 font-bold">
              Order Number (e.g., FTD-982104)
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <input
                type="text"
                placeholder="FTD-XXXXXX"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                className="w-full bg-white border border-neutral-300 px-10 py-3.5 font-mono text-xs uppercase tracking-wider text-black placeholder-neutral-400 focus:border-black focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="md:col-span-4 space-y-2">
            <label className="block font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-700 font-bold">
              Or Customer Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <input
                type="email"
                placeholder="customer@example.com"
                value={emailQuery}
                onChange={(e) => setEmailQuery(e.target.value)}
                className="w-full bg-white border border-neutral-300 px-10 py-3.5 font-mono text-xs text-black placeholder-neutral-400 focus:border-black focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={searching}
              className="w-full bg-black hover:bg-neutral-800 text-white py-3.5 font-mono text-[10px] uppercase tracking-[0.25em] font-bold flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50 cursor-pointer shadow-md"
            >
              {searching ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Querying Vault...</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span>Lookup Purchase</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* QUICK TEST SAMPLES */}
        {recentOrders.length > 0 && (
          <div className="pt-4 border-t border-neutral-200 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-600 font-bold mr-1">
              Sample Orders in System:
            </span>
            {recentOrders.map((ord) => (
              <button
                key={ord.id}
                onClick={() => {
                  setOrderQuery(ord.order_number);
                  handleSearchOrder(ord.order_number);
                }}
                className={`font-mono text-[9px] uppercase tracking-wider px-2.5 py-1 border transition-all cursor-pointer ${
                  orderResult?.order_number === ord.order_number
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800 font-bold"
                    : "border-neutral-300 bg-white text-neutral-700 hover:text-black hover:border-black"
                }`}
              >
                #{ord.order_number} ({ord.status || "Paid"})
              </button>
            ))}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {errorMsg && (
          <div className="p-4 border border-red-300 bg-red-50 text-red-700 font-mono text-xs flex items-center gap-3 rounded">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* SEARCH RESULT DISPLAY */}
      <AnimatePresence mode="wait">
        {orderResult && (
          <motion.div
            key={orderResult.order_number}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="mt-12 space-y-10"
          >
            {/* ORDER OVERVIEW CARD */}
            <div className="border border-neutral-200 bg-neutral-50 p-6 md:p-8 space-y-8 shadow-sm rounded-lg">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-neutral-200 pb-6 gap-6">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-emerald-700 border border-emerald-300 bg-emerald-50 px-2.5 py-1 rounded">
                      {orderResult.status || "Processing"}
                    </span>
                    <span className="font-mono text-xs text-neutral-500">
                      Placed on {new Date(orderResult.created_date || Date.now()).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                  <h2 className="mt-3 font-display text-3xl font-black uppercase tracking-wider text-black">
                    Order #{orderResult.order_number}
                  </h2>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={() => handleDownloadPDF("invoice")}
                    disabled={isGeneratingPdf}
                    className="border border-neutral-300 hover:border-black bg-white text-black font-mono text-[10px] uppercase font-bold tracking-widest px-4 py-3 flex items-center gap-2 transition-all hover:bg-neutral-100 active:scale-95 disabled:opacity-50 cursor-pointer shadow-sm"
                  >
                    <Download className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Download PDF Invoice</span>
                  </button>

                  <button
                    onClick={() => handleDownloadPDF("receipt")}
                    disabled={isGeneratingPdf}
                    className="border border-neutral-300 hover:border-black bg-white text-black font-mono text-[10px] uppercase font-bold tracking-widest px-4 py-3 flex items-center gap-2 transition-all hover:bg-neutral-100 active:scale-95 disabled:opacity-50 cursor-pointer shadow-sm"
                  >
                    <Printer className="h-3.5 w-3.5 text-blue-600" />
                    <span>Download PDF Receipt</span>
                  </button>
                </div>
              </div>

              {/* TIMELINE PROGRESS BAR */}
              <div className="space-y-4 pt-2">
                <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-600 font-bold">
                  Fulfillment Status Stage
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {timelineSteps.map((step) => {
                    const isPassed = currentStage >= step.stage;

                    return (
                      <div
                        key={step.stage}
                        className={`p-4 border transition-all rounded ${
                          isPassed
                            ? "border-emerald-300 bg-emerald-50 text-black"
                            : "border-neutral-200 bg-white text-neutral-500"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`font-mono text-[10px] font-bold uppercase tracking-widest ${
                              isPassed ? "text-emerald-700" : "text-neutral-500"
                            }`}
                          >
                            STAGE 0{step.stage}
                          </span>
                          {isPassed ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <Clock className="h-4 w-4 text-neutral-400" />
                          )}
                        </div>
                        <h4 className="font-sans text-sm font-bold text-black mb-1">
                          {step.label}
                        </h4>
                        <p className="font-mono text-[10px] text-neutral-600">
                          {step.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* TRACKING IDENTIFIER BANNER */}
              {orderResult.tracking_number && (
                <div className="border border-neutral-200 bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded">
                  <div className="flex items-center gap-3">
                    <Truck className="h-5 w-5 text-black shrink-0" />
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 font-bold">
                        Courier Express Tracking Reference
                      </p>
                      <p className="font-mono text-sm font-bold text-black tracking-wider">
                        {orderResult.tracking_number}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => copyTracking(orderResult.tracking_number)}
                    className="border border-neutral-300 hover:border-black bg-neutral-100 px-3.5 py-2 font-mono text-[10px] uppercase font-bold tracking-wider text-black flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
                  >
                    {copiedTracking ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-neutral-600" />
                        <span>Copy Number</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* DETAILS GRID */}
              <div className="grid gap-6 md:grid-cols-3 pt-4 border-t border-neutral-200 font-mono text-xs">
                {/* CUSTOMER DETAILS */}
                <div className="space-y-2 border-r border-neutral-200 pr-4">
                  <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold flex items-center gap-1.5">
                    <User className="h-3 w-3 text-neutral-500" /> Customer Information
                  </span>
                  <p className="font-sans text-sm font-bold text-black">{orderResult.customer_name || "Guest"}</p>
                  <p className="text-neutral-600 text-[11px]">{orderResult.customer_email}</p>
                  <p className="text-neutral-600 text-[11px]">{orderResult.customer_phone || "No phone provided"}</p>
                </div>

                {/* SHIPPING ADDRESS */}
                <div className="space-y-2 border-r border-neutral-200 pr-4">
                  <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-neutral-500" /> Delivery Address
                  </span>
                  <p className="font-sans text-xs text-neutral-800 leading-relaxed">
                    {orderResult.shipping_address || "Standard Courier Delivery"}
                  </p>
                  <p className="text-[10px] text-neutral-500 font-bold uppercase">{orderResult.country || "South Africa"}</p>
                </div>

                {/* PAYMENT & SUMMARY */}
                <div className="space-y-2">
                  <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold flex items-center gap-1.5">
                    <CreditCard className="h-3 w-3 text-neutral-500" /> Payment & Total
                  </span>
                  <p className="text-neutral-700">
                    Method: <span className="text-black font-bold">{orderResult.payment_method || "Card"}</span>
                  </p>
                  <p className="text-neutral-700">
                    Payment Status: <span className="text-emerald-700 font-bold">{orderResult.payment_status || "Paid"}</span>
                  </p>
                  <p className="text-sm font-bold text-black pt-1">
                    Total: {zar(orderResult.total || 0)}
                  </p>
                </div>
              </div>

              {/* ITEMS IN PURCHASE */}
              <div className="space-y-4 pt-4 border-t border-neutral-200">
                <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-600 font-bold">
                  Purchased Items ({Array.isArray(orderResult.items) ? orderResult.items.length : 0})
                </h3>

                <div className="divide-y divide-neutral-200 border border-neutral-200 bg-white rounded">
                  {Array.isArray(orderResult.items) && orderResult.items.map((item, idx) => (
                    <div key={idx} className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-16 w-14 object-cover bg-neutral-100 border border-neutral-200 rounded"
                          />
                        ) : (
                          <div className="h-16 w-14 bg-neutral-100 border border-neutral-200 flex items-center justify-center font-mono text-[8px] text-neutral-500 rounded">
                            FORTIFIED
                          </div>
                        )}
                        <div>
                          <h4 className="font-sans font-bold text-sm text-black">
                            {item.name || "FORTIFIED Garment"}
                          </h4>
                          <div className="flex items-center gap-3 font-mono text-[10px] text-neutral-600 mt-1">
                            <span>Size: <strong className="text-black">{item.size || "M"}</strong></span>
                            <span>Colour: <strong className="text-black">{item.colour || "Black"}</strong></span>
                            <span>Qty: <strong className="text-black">{item.quantity || 1}</strong></span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right font-mono text-sm font-bold text-black">
                        {zar((item.price || 0) * (item.quantity || 1))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PRINTABLE INVOICE / RECEIPT TEMPLATE */}
            <div className="overflow-hidden h-0 w-0 pointer-events-none opacity-0">
              <div
                id="order-tracking-printable-document"
                style={{
                  width: "800px",
                  padding: "40px",
                  backgroundColor: "#ffffff",
                  color: "#000000",
                  fontFamily: "monospace"
                }}
              >
                <div style={{ borderBottom: "2px solid #000000", paddingBottom: "20px", marginBottom: "20px" }}>
                  <div style={{ display: "flex", justify: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                      <img
                        src="/images/brand/fiy-logo.png"
                        alt="FORTIFIED Logo"
                        style={{ height: "48px", width: "48px", objectFit: "contain", flexShrink: 0 }}
                      />
                      <div>
                        <h1 style={{ fontSize: "28px", fontWeight: "900", letterSpacing: "4px", margin: 0 }}>FORTIFIED</h1>
                        <p style={{ fontSize: "10px", letterSpacing: "2px", margin: "4px 0 0 0", color: "#666666" }}>
                          PERMANENT ART. TIMELESS QUALITY.
                        </p>
                        <p style={{ fontSize: "9px", margin: "4px 0 0 0", color: "#666" }}>
                          FORTIFIED BRAND (PTY) LTD | Reg: 2025/120241/07
                        </p>
                        <p style={{ fontSize: "9px", margin: "2px 0 0 0", color: "#000", fontWeight: "bold" }}>
                          CHARDONNAY, CABANAS, COLIN STREET, UVONGO, KWA-ZULU NATAL 4270
                        </p>
                        <p style={{ fontSize: "9px", margin: "2px 0 0 0", color: "#666" }}>
                          Email: fortifiedbrand31@gmail.com | Tel: +27 68 594 0131
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <h2 style={{ fontSize: "20px", fontWeight: "bold", margin: 0 }}>OFFICIAL TAX INVOICE</h2>
                      <p style={{ fontSize: "12px", margin: "4px 0 0 0" }}># {orderResult.order_number}</p>
                      <p style={{ fontSize: "10px", margin: "2px 0 0 0", color: "#666" }}>
                        Date: {new Date(orderResult.created_date || Date.now()).toLocaleDateString()}
                      </p>
                      <p style={{ fontSize: "10px", margin: "2px 0 0 0", color: "#000", fontWeight: "bold" }}>
                        Status: {orderResult.payment_status || "PAID"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* CUSTOMER & SHIPPING INFO */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px", fontSize: "11px", lineHeight: "1.6" }}>
                  <div style={{ width: "48%" }}>
                    <p style={{ fontSize: "9px", fontWeight: "bold", textTransform: "uppercase", color: "#888", marginBottom: "4px" }}>CUSTOMER</p>
                    <p style={{ fontWeight: "bold", margin: 0 }}>{orderResult.customer_name || "Valued Customer"}</p>
                    <p style={{ margin: 0 }}>{orderResult.customer_email}</p>
                    <p style={{ margin: 0 }}>{orderResult.customer_phone || ""}</p>
                  </div>
                  <div style={{ width: "48%", textAlign: "right" }}>
                    <p style={{ fontSize: "9px", fontWeight: "bold", textTransform: "uppercase", color: "#888", marginBottom: "4px" }}>SHIPPING DESTINATION</p>
                    <p style={{ margin: 0 }}>{orderResult.shipping_address || "Standard Delivery"}</p>
                    <p style={{ margin: 0 }}>{orderResult.country || "South Africa"}</p>
                    {orderResult.tracking_number && (
                      <p style={{ margin: "4px 0 0 0", fontWeight: "bold" }}>Tracking: {orderResult.tracking_number}</p>
                    )}
                  </div>
                </div>

                {/* ITEMS TABLE */}
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "30px", fontSize: "11px" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #000000", textAlign: "left", fontSize: "9px", textTransform: "uppercase" }}>
                      <th style={{ padding: "8px 0" }}>Garment Description</th>
                      <th style={{ padding: "8px 0" }}>Size</th>
                      <th style={{ padding: "8px 0" }}>Colour</th>
                      <th style={{ padding: "8px 0", textAlign: "center" }}>Qty</th>
                      <th style={{ padding: "8px 0", textAlign: "right" }}>Unit Price</th>
                      <th style={{ padding: "8px 0", textAlign: "right" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(orderResult.items) && orderResult.items.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid #eeeeee" }}>
                        <td style={{ padding: "10px 0", fontWeight: "bold" }}>{item.name}</td>
                        <td style={{ padding: "10px 0" }}>{item.size || "M"}</td>
                        <td style={{ padding: "10px 0" }}>{item.colour || "Black"}</td>
                        <td style={{ padding: "10px 0", textAlign: "center" }}>{item.quantity || 1}</td>
                        <td style={{ padding: "10px 0", textAlign: "right" }}>{zar(item.price || 0)}</td>
                        <td style={{ padding: "10px 0", textAlign: "right", fontWeight: "bold" }}>{zar((item.price || 0) * (item.quantity || 1))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* TOTALS */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "40px" }}>
                  <div style={{ width: "260px", fontSize: "11px", lineHeight: "1.8" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Subtotal:</span>
                      <span>{zar(orderResult.subtotal || (orderResult.total - (orderResult.shipping || 0)))}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>Express Shipping:</span>
                      <span>{orderResult.shipping > 0 ? zar(orderResult.shipping) : "FREE"}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", borderTop: "2px solid #000000", paddingTop: "8px", marginTop: "8px", fontWeight: "bold", fontSize: "14px" }}>
                      <span>TOTAL (ZAR):</span>
                      <span>{zar(orderResult.total || 0)}</span>
                    </div>
                  </div>
                </div>

                <div style={{ borderTop: "1px solid #cccccc", paddingTop: "15px", textAlign: "center", fontSize: "9px", color: "#666666" }}>
                  Thank you for investing in FORTIFIED Permanent Art. For support inquiries, email fortifiedbrand31@gmail.com
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-16 pt-8 border-t border-neutral-200 flex justify-start">
        <BackButton label="BACK" to="/" />
      </div>
    </div>
  );
}
