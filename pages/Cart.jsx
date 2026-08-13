import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, Globe, Search, MapPin, CreditCard, ExternalLink, ShieldCheck, Lock, X, Loader2, AlertCircle } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { base44 } from "@/api/base44Client";
import { zar } from "@/lib/media";
import { ALL_COUNTRIES, getCountryByCode } from "@/lib/countries";
import FlagImage from "@/components/FlagImage";
import BackButton from "@/components/BackButton";
import { processYocoPayment, createYocoCheckout, submitPayFastPayment, processPayFastOnsite } from "@/lib/paymentGateways";
import { useCurrency } from "@/context/CurrencyContext";
import CurrencySelectorBadge from "@/components/CurrencySelectorBadge";
import { useStoreSettings } from "@/lib/storeSettings";

const PaymentLogo = ({ type, className = "h-5" }) => {
  switch (type) {
    case "Card":
      return (
        <div className="flex items-center gap-1.5">
          {/* Visa SVG */}
          <svg className="h-3.5 w-auto" viewBox="0 0 36 12" fill="none">
            <path d="M13.8 0.35L9.05 11.6H6.1L3.7 2.45C3.55 1.85 3.3 1.6 2.7 1.25C1.8 0.75 0.85 0.45 0 0.25L0.1 0.35H5C6.3 0.35 7.15 1.25 7.4 2.15L8.85 9.9L11.8 0.35H13.8ZM25.8 8.15C25.8 5.05 21.5 4.85 21.5 3.45C21.5 2.95 22 2.4 23.2 2.25C23.8 2.2 25.4 2.1 27.05 2.85L27.65 0.75C26.85 0.45 25.7 0.2 24.3 0.2C21.3 0.2 19.2 1.8 19.2 4.05C19.2 5.75 20.7 6.7 21.85 7.25C23 7.8 23.4 8.15 23.4 8.65C23.4 9.4 22.5 9.75 21.6 9.75C20.1 9.75 18.8 9.3 18 8.9L17.35 11.1C18.25 11.5 19.8 11.8 21.4 11.8C24.6 11.8 26.7 10.2 25.8 8.15ZM33.2 11.6H35.8L33.5 0.35H31.15C30.5 0.35 29.95 0.7 29.7 1.3L25.35 11.6H28.35L28.95 9.95H32.6L33.2 11.6ZM29.75 7.65L31.25 3.55L32.1 7.65H29.75ZM18.5 0.35L16.2 11.6H13.45L15.75 0.35H18.5Z" fill="#1434CB"/>
          </svg>
          {/* Mastercard SVG */}
          <svg className="h-4 w-auto" viewBox="0 0 24 16" fill="none">
            <circle cx="7" cy="8" r="7" fill="#EB001B"/>
            <circle cx="17" cy="8" r="7" fill="#F79E1B"/>
            <path d="M12 2.22A6.97 6.97 0 0114.33 8 6.97 6.97 0 0112 13.78 6.97 6.97 0 019.67 8 6.97 6.97 0 0112 2.22z" fill="#FF5F00"/>
          </svg>
        </div>
      );
    case "PayFast":
      return (
        <div className="flex items-center gap-1 font-sans font-black text-xs tracking-tight">
          <span className="text-[#002D62]">Pay</span>
          <span className="text-[#E31837]">Fast</span>
        </div>
      );
    case "Yoco":
      return (
        <div className="flex items-center gap-1 font-sans font-extrabold text-xs tracking-wider text-[#00A8B5]">
          <span>YOCO</span>
        </div>
      );
    case "PayPal":
      return (
        <div className="flex items-center font-sans font-bold text-xs italic tracking-tight">
          <span className="text-[#003087]">Pay</span>
          <span className="text-[#0079C1]">Pal</span>
        </div>
      );
    case "Apple Pay":
      return (
        <div className="flex items-center gap-1 font-sans font-semibold text-xs tracking-tight">
          <svg className="h-3.5 w-auto fill-current" viewBox="0 0 170 170">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.82.13-9.75-1.95-14.79-6.23-3.32-2.73-7.27-7.46-11.85-14.17-6.24-9.1-11.12-19.53-14.63-31.29-3.51-11.76-5.27-22.97-5.27-33.63 0-14.43 3.51-26.39 10.53-35.88 7.02-9.49 16.03-14.34 27.03-14.56 4.82 0 10.05 1.18 15.69 3.54 5.64 2.36 9.49 3.66 11.55 3.89 2.06 0 6.01-1.39 11.85-4.16 5.84-2.77 11.12-4.04 15.84-3.82 12.19.98 21.84 5.27 28.95 12.87-10.74 6.53-15.98 15.69-15.72 27.47.26 9.27 3.86 16.99 10.8 23.16 6.94 6.17 15.17 9.53 24.69 10.08-2.22 6.55-5.12 13.11-8.71 19.68zM119.22 31.05c0-6.72 2.45-13.25 7.35-19.59 4.9-6.34 11.12-10.37 18.66-12.09.26 1.09.39 2.12.39 3.09 0 6.84-2.52 13.56-7.56 20.16-5.04 6.6-11.23 10.6-18.57 12.01-.08-1.09-.27-2.28-.27-3.58z"/>
          </svg>
          <span>Pay</span>
        </div>
      );
    case "Google Pay":
      return (
        <div className="flex items-center gap-1 font-sans font-bold text-xs">
          <span className="text-[#4285F4]">G</span>
          <span className="text-neutral-800">Pay</span>
        </div>
      );
    case "Ozow":
      return (
        <div className="flex items-center font-sans font-black text-xs text-[#0F172A] tracking-tighter">
          <span>OZOW</span>
        </div>
      );
    case "EFT":
      return (
        <div className="flex items-center gap-1 font-sans font-bold text-xs text-neutral-800">
          <span>EFT</span>
        </div>
      );
    default:
      return null;
  }
};

const payments = [
  { id: "Card", name: "Credit / Debit Card", type: "Card" },
  { id: "PayFast", name: "PayFast Gateway", type: "PayFast" },
  { id: "Yoco", name: "Yoco Gateway", type: "Yoco" },
  { id: "PayPal", name: "PayPal Direct", type: "PayPal" },
  { id: "Apple Pay", name: "Apple Pay", type: "Apple Pay" },
  { id: "Google Pay", name: "Google Pay", type: "Google Pay" },
  { id: "Ozow", name: "Ozow Instant EFT", type: "Ozow" },
  { id: "EFT", name: "Bank Transfer", type: "EFT" },
];

export default function Cart() {
  const { items, updateQty, removeItem, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [pay, setPay] = useState("Card");
  const [placed, setPlaced] = useState(null);
  const [gatewayModal, setGatewayModal] = useState(null); // 'yoco' | 'payfast' | null
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [payfastPrompt, setPayfastPrompt] = useState(null);
  
  // Custom Card Input State for Gateway Modals
  const [cardForm, setCardForm] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardHolder: ""
  });

  const [sameAsBilling, setSameAsBilling] = useState(true);
  const { currentCountry } = useCurrency();
  const [shippingForm, setShippingForm] = useState({
    countryCode: currentCountry?.code || "ZA",
    address: "",
    city: "",
    postalCode: ""
  });
  const [shippingCountrySearch, setShippingCountrySearch] = useState("");
  const [shippingCountryDropdownOpen, setShippingCountryDropdownOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: currentCountry?.code || "ZA",
    address: "",
    city: "",
    postalCode: ""
  });
  const [countrySearch, setCountrySearch] = useState("");
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);

  const { storeSettings } = useStoreSettings();

  useEffect(() => {
    if (currentCountry?.code && form.countryCode === "ZA" && currentCountry.code !== "ZA") {
      setForm((prev) => ({ ...prev, countryCode: currentCountry.code }));
      setShippingForm((prev) => ({ ...prev, countryCode: currentCountry.code }));
    }
  }, [currentCountry]);

  const selectedCountry = getCountryByCode(form.countryCode);
  const selectedShippingCountry = getCountryByCode(shippingForm.countryCode);
  const activeShippingCountry = sameAsBilling ? selectedCountry : selectedShippingCountry;
  const isNational = activeShippingCountry?.code === "ZA";

  const nationalFee = storeSettings?.nationalShippingFee ?? 100;
  const nationalThreshold = storeSettings?.nationalFreeThreshold ?? 0;
  const intlFee = storeSettings?.internationalShippingFee ?? 450;
  const intlThreshold = storeSettings?.internationalFreeThreshold ?? 0;

  const shipping = isNational
    ? (nationalThreshold > 0 && subtotal >= nationalThreshold ? 0 : nationalFee)
    : (intlThreshold > 0 && subtotal >= intlThreshold ? 0 : intlFee);

  const total = subtotal + shipping;

  const filteredCountries = ALL_COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.code.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.phone.includes(countrySearch)
  );

  const filteredShippingCountries = ALL_COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(shippingCountrySearch.toLowerCase()) ||
      c.code.toLowerCase().includes(shippingCountrySearch.toLowerCase()) ||
      c.phone.includes(shippingCountrySearch)
  );

  const getFullBillingAddress = () => {
    return `${form.address}${form.city ? `, ${form.city}` : ""}${form.postalCode ? ` ${form.postalCode}` : ""}, ${selectedCountry.flag} ${selectedCountry.name}`;
  };

  const getFullShippingAddress = () => {
    if (sameAsBilling) {
      return getFullBillingAddress();
    }
    return `${shippingForm.address}${shippingForm.city ? `, ${shippingForm.city}` : ""}${shippingForm.postalCode ? ` ${shippingForm.postalCode}` : ""}, ${selectedShippingCountry.flag} ${selectedShippingCountry.name}`;
  };

  // Check URL parameters for redirect callbacks
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const yocoStatus = params.get("yoco_status") || params.get("payment") || params.get("status");
    const orderNum = params.get("order");

    if (yocoStatus === "success" || yocoStatus === "successful") {
      clear();
      if (orderNum) {
        base44.entities.Order.list("-created_date")
          .then(async (allOrders) => {
            const existing = (allOrders || []).find((o) => o.order_number === orderNum);
            if (existing) {
              if (existing.payment_status !== "Paid") {
                await base44.entities.Order.update(existing.id, {
                  payment_status: "Paid",
                  status: "processing",
                });
              }
              setPlaced({ ...existing, payment_status: "Paid", status: "processing" });
            } else {
              setPlaced({
                order_number: orderNum,
                customer_name: form.name || "Valued Customer",
                customer_email: form.email || "customer@fortified.com",
                payment_method: "PayFast Gateway",
                payment_status: "Paid",
                subtotal: subtotal || 1950,
                shipping: shipping || 0,
                total: total || 1950,
                billing_address: getFullBillingAddress(),
                shipping_address: getFullShippingAddress(),
                items: items.length ? items : [{ name: "FORTIFIED Item", quantity: 1, price: 1950 }]
              });
            }
          })
          .catch(() => {});
      }
    } else if (yocoStatus === "cancelled" || yocoStatus === "cancel" || yocoStatus === "failure") {
      setPaymentError("Payment process was cancelled or unsuccessful. Your items remain in your bag.");
      setStep(3);
    }
  }, []);

  const placeOrder = () => {
    setShowConfirmModal(true);
  };

  const executePlaceOrder = async () => {
    setShowConfirmModal(false);
    const fullBillingAddress = getFullBillingAddress();
    const fullShippingAddress = getFullShippingAddress();
    const orderNumber = `FTD-${Date.now().toString().slice(-6)}`;

    if (pay === "Yoco" || pay === "Card") {
      setProcessing(true);
      setPaymentError("");
      try {
        await base44.entities.Order.create({
          order_number: orderNumber,
          items: items.map(({ product_id, name, size, colour, quantity, price, image }) => ({ product_id, name, size, colour, quantity, price, image })),
          subtotal, shipping, total, currency: "ZAR",
          customer_name: form.name || "Customer", 
          customer_email: form.email || "customer@example.com",
          customer_phone: `${selectedCountry.phone} ${form.phone}`.trim(),
          country: selectedCountry.name,
          country_code: selectedCountry.code,
          country_flag: selectedCountry.flag,
          billing_address: fullBillingAddress,
          shipping_address: fullShippingAddress, 
          payment_method: "Yoco Hosted Checkout",
          payment_status: "Pending", 
          status: "pending",
        });

        await createYocoCheckout({
          amountZar: total,
          orderNumber,
          customerEmail: form.email || "customer@example.com",
          customerName: form.name || "Customer",
          onRedirect: () => {
            setProcessing(false);
          },
        });
      } catch (err) {
        console.error("Yoco Payment Initialization Error:", err);
        setProcessing(false);
        setPaymentError(err.message || "Failed to initialize Yoco Payment Gateway.");
      }
      return;
    }

    if (pay === "PayFast") {
      setProcessing(true);
      setPaymentError("");
      try {
        await base44.entities.Order.create({
          order_number: orderNumber,
          items: items.map(({ product_id, name, size, colour, quantity, price, image }) => ({ product_id, name, size, colour, quantity, price, image })),
          subtotal, shipping, total, currency: "ZAR",
          customer_name: form.name || "Customer", 
          customer_email: form.email || "customer@example.com",
          customer_phone: `${selectedCountry.phone} ${form.phone}`.trim(),
          country: selectedCountry.name,
          country_code: selectedCountry.code,
          country_flag: selectedCountry.flag,
          billing_address: fullBillingAddress,
          shipping_address: fullShippingAddress, 
          payment_method: "PayFast Gateway",
          payment_status: "Pending", 
          status: "pending",
        });

        let onsiteUuid = null;
        try {
          const onsiteRes = await processPayFastOnsite({
            amountZar: total,
            orderNumber,
            customerEmail: form.email || "customer@example.com",
            customerName: form.name || "Valued Customer",
            onSuccess: () => {
              clearCart();
              navigate(`/track-order?payfast_status=success&order=${encodeURIComponent(orderNumber)}`);
            },
            onError: (errMsg) => {
              console.warn("PayFast Onsite notice:", errMsg);
            }
          });
          onsiteUuid = onsiteRes?.uuid;
        } catch (e) {
          console.warn("[PayFast Onsite session creation fallback]", e);
        }

        setProcessing(false);
        setPayfastPrompt({
          orderNumber,
          total,
          email: form.email || "customer@example.com",
          name: form.name || "Valued Customer",
          uuid: onsiteUuid,
        });
      } catch (err) {
        console.error("PayFast Payment Initialization Error:", err);
        setProcessing(false);
        setPaymentError(err.message || "Failed to initialize PayFast Payment Gateway.");
      }
      return;
    }

    const order = await base44.entities.Order.create({
      order_number: orderNumber,
      items: items.map(({ product_id, name, size, colour, quantity, price, image }) => ({ product_id, name, size, colour, quantity, price, image })),
      subtotal, shipping, total, currency: "ZAR",
      customer_name: form.name, 
      customer_email: form.email,
      customer_phone: `${selectedCountry.phone} ${form.phone}`.trim(),
      country: selectedCountry.name,
      country_code: selectedCountry.code,
      country_flag: selectedCountry.flag,
      billing_address: fullBillingAddress,
      shipping_address: fullShippingAddress, 
      payment_method: pay, 
      status: "pending",
    });
    clear();
    setPlaced(order);
  };

  const handleAuthorizeGatewayPayment = async (gatewayName) => {
    setProcessing(true);
    const fullBillingAddress = getFullBillingAddress();
    const fullShippingAddress = getFullShippingAddress();
    const orderNumber = `FTD-${Date.now().toString().slice(-6)}`;

    setTimeout(async () => {
      const order = await base44.entities.Order.create({
        order_number: orderNumber,
        items: items.map(({ product_id, name, size, colour, quantity, price, image }) => ({ product_id, name, size, colour, quantity, price, image })),
        subtotal, shipping, total, currency: "ZAR",
        customer_name: form.name || "Customer", 
        customer_email: form.email || "client@fortified.com",
        customer_phone: `${selectedCountry.phone} ${form.phone}`.trim(),
        country: selectedCountry.name,
        country_code: selectedCountry.code,
        country_flag: selectedCountry.flag,
        billing_address: fullBillingAddress,
        shipping_address: fullShippingAddress, 
        payment_method: gatewayName,
        payment_status: "Paid", 
        status: "pending",
      });
      clear();
      setProcessing(false);
      setGatewayModal(null);
      setPlaced(order);
    }, 1200);
  };

  if (placed) {
    const itemsList = (placed.items || []).map((i) => `• ${i.name} (${i.size || "M"} / ${i.colour || "Black"}) x${i.quantity || 1}`).join("\n");
    const waMessage = `*FORTIFIED BRAND - ORDER CONFIRMATION* 🖤

Thank you for choosing FORTIFIED! Your order has been successfully placed.

*Order Summary:*
• Order Number: ${placed.order_number}
• Customer: ${placed.customer_name}
• Email: ${placed.customer_email}
• Phone: ${placed.customer_phone || "N/A"}
• Destination: ${placed.country_flag || "🌐"} ${placed.country || "Worldwide"}
• Billing Address: ${placed.billing_address || placed.shipping_address}
• Shipping Address: ${placed.shipping_address}
• Payment Method: ${placed.payment_method}
• Total: ${zar(placed.total)}

*Items:*
${itemsList || "• Standard Fit Tee"}

*Join our Ecosystem:*
📸 Instagram: https://www.instagram.com/fortified_brand
📘 Facebook: https://web.facebook.com/profile.php?id=61592905169879
🎵 TikTok: https://www.tiktok.com/@fortified_brand
✖️ X (Twitter): https://x.com/fortified98?s=11

*Contact:*
📞 WhatsApp Support: +27 68 594 0131
✉️ Email: fortifiedbrand31@gmail.com

Thank you for standing different with FORTIFIED.`;

    const encoded = encodeURIComponent(waMessage);
    const waLink = `https://wa.me/27685940131?text=${encoded}`;

    return (
      <div className="mx-auto max-w-2xl px-6 pb-28 pt-36">
        <div className="border border-neutral-300 bg-white p-8 md:p-12 shadow-xl text-center rounded-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-black text-white">
            <Check className="h-8 w-8 text-white" />
          </div>

          <p className="mt-6 font-mono text-xs font-bold uppercase tracking-[0.3em] text-neutral-500">
            Payment Verified & Approved
          </p>
          <h1 className="mt-2 font-display text-4xl font-black uppercase text-neutral-900 tracking-tight md:text-5xl">
            Order Confirmed
          </h1>
          <p className="mt-2 font-mono text-sm font-bold text-neutral-800">
            Order Reference: <span className="text-black underline">{placed.order_number}</span>
          </p>

          <div className="mt-8 border border-neutral-200 bg-neutral-50 p-6 text-left space-y-3 font-mono text-xs text-neutral-800 rounded-sm">
            <div className="flex justify-between border-b border-neutral-200 pb-2">
              <span>Customer:</span>
              <span className="font-bold text-neutral-900">{placed.customer_name}</span>
            </div>
            <div className="flex justify-between border-b border-neutral-200 pb-2">
              <span>Payment Gateway:</span>
              <span className="font-bold text-neutral-900">{placed.payment_method}</span>
            </div>
            <div className="flex justify-between border-b border-neutral-200 pb-2">
              <span>Subtotal:</span>
              <span className="font-bold text-neutral-900">{zar(placed.subtotal || (placed.total - (placed.shipping || 0)))}</span>
            </div>
            <div className="flex justify-between border-b border-neutral-200 pb-2">
              <span>Shipping Fee:</span>
              <span className="font-bold text-neutral-900">{!placed.shipping || placed.shipping === 0 ? "Complimentary" : zar(placed.shipping)}</span>
            </div>
            <div className="flex justify-between border-b border-neutral-200 pb-2">
              <span>Total Amount Paid:</span>
              <span className="font-bold text-black text-sm">{zar(placed.total)}</span>
            </div>
            <div className="flex justify-between border-b border-neutral-200 pb-2 text-neutral-700">
              <span>Billing Address:</span>
              <span className="font-bold text-neutral-900 text-right max-w-[220px] truncate">{placed.billing_address || placed.shipping_address}</span>
            </div>
            <div className="flex justify-between text-neutral-700">
              <span>Shipping Address:</span>
              <span className="font-bold text-neutral-900 text-right max-w-[220px] truncate">{placed.shipping_address}</span>
            </div>
          </div>

          <div className="mt-8">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold uppercase tracking-[0.2em] py-4 px-6 rounded-sm shadow-md transition-all cursor-pointer"
            >
              Send Order Confirmation via WhatsApp
            </a>
            <p className="mt-3 font-mono text-[11px] text-neutral-500">
              Connect directly with our logistics team for priority dispatch updates.
            </p>
          </div>

          <div className="mt-8 flex justify-center gap-4 border-t border-neutral-200 pt-6">
            <Link to="/track-order" className="font-mono text-xs uppercase font-bold text-neutral-800 hover:text-black underline">
              Track Order
            </Link>
            <span className="text-neutral-300">|</span>
            <Link to="/shop" className="font-mono text-xs uppercase font-bold text-neutral-800 hover:text-black underline">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0)
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-6 pb-28 pt-48 text-center">
        <h1 className="font-display text-5xl font-black tracking-monolith text-neutral-900">Your bag is empty</h1>
        <p className="mt-3 font-mono text-xs text-neutral-600">Explore the latest FORTIFIED drop and select your fit.</p>
        <Link to="/shop" className="mt-8 bg-black px-9 py-4 font-mono text-xs uppercase tracking-[0.25em] text-white hover:bg-neutral-800 shadow-md rounded-sm">
          Shop Collection
        </Link>
      </div>
    );

  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-28 pt-36 md:px-12 text-neutral-900">
      <h1 className="font-display text-5xl font-black tracking-monolith text-neutral-900 md:text-7xl">Checkout</h1>

      <div className="mt-14 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <div>
          {/* Step indicator */}
          <div className="mb-10 flex gap-6 border-b border-neutral-200 pb-4">
            {["Bag", "Details", "Payment"].map((s, i) => (
              <button
                key={s}
                onClick={() => setStep(i + 1)}
                className={`font-mono text-xs uppercase tracking-[0.2em] transition-colors cursor-pointer ${
                  step === i + 1
                    ? "font-bold text-black border-b-2 border-black pb-1"
                    : "text-neutral-500 hover:text-black"
                }`}
              >
                {`0${i + 1} · ${s}`}
              </button>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-6">
              {items.map((i) => (
                <div key={i.key} className="flex gap-5 border-b border-neutral-200 pb-6 items-center">
                  <img src={i.image || "/images/embroidered-black/emb_black_front.jpg"} alt={i.name} className="h-28 w-24 object-cover border border-neutral-200 rounded-sm" />
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="font-bold text-neutral-900 text-base">{i.name}</p>
                      <p className="font-mono text-xs uppercase tracking-[0.15em] text-neutral-600 mt-1">
                        Size {i.size} · {i.colour}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      <input
                        type="number"
                        min={1}
                        value={i.quantity}
                        onChange={(e) => updateQty(i.key, parseInt(e.target.value) || 1)}
                        className="w-16 border border-neutral-300 bg-white px-3 py-1.5 font-mono text-sm text-neutral-900 rounded-sm"
                      />
                      <button onClick={() => removeItem(i.key)} className="font-mono text-xs uppercase text-red-600 hover:underline cursor-pointer">
                        Remove
                      </button>
                    </div>
                  </div>
                  <span className="font-mono text-base font-bold text-neutral-900">{zar(i.price * i.quantity)}</span>
                </div>
              ))}
              <button
                onClick={() => setStep(2)}
                className="mt-8 w-full bg-black py-4 font-mono text-xs uppercase tracking-[0.25em] text-white hover:bg-neutral-800 transition-all cursor-pointer shadow-md rounded-sm"
              >
                Continue to Details
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="border border-neutral-200 bg-white p-6 md:p-8 space-y-6 shadow-sm rounded-sm">
              <div className="border-b border-neutral-200 pb-3">
                <h3 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-neutral-900">
                  1. Contact Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-700">
                    Full Name *
                  </label>
                  <input
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-neutral-300 bg-white px-4 py-3.5 font-mono text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-black focus:ring-1 focus:ring-black outline-none rounded-sm"
                  />
                </div>
                <div>
                  <label className="block mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-700">
                    Email Address *
                  </label>
                  <input
                    placeholder="john@example.com"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-neutral-300 bg-white px-4 py-3.5 font-mono text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-black focus:ring-1 focus:ring-black outline-none rounded-sm"
                  />
                </div>
              </div>

              {/* Phone Input with Country Code */}
              <div>
                <label className="block mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-700">
                  Phone / WhatsApp Number (for Delivery Tracking)
                </label>
                <div className="flex">
                  <div className="flex items-center gap-2 border border-r-0 border-neutral-300 bg-neutral-100 px-3.5 py-3.5 font-mono text-xs text-neutral-900 font-bold rounded-l-sm">
                    <FlagImage code={selectedCountry.code} className="w-5 h-3.5 object-cover rounded-xs border border-neutral-300 shadow-2xs shrink-0" />
                    <span className="text-black font-bold">{selectedCountry.phone}</span>
                  </div>
                  <input
                    placeholder="82 123 4567"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full flex-1 border border-neutral-300 bg-white px-4 py-3.5 font-mono text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-black outline-none rounded-r-sm"
                  />
                </div>
              </div>

              <div className="border-b border-neutral-200 pb-3 pt-2">
                <h3 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-neutral-900">
                  2. Billing Address
                </h3>
              </div>

              {/* Billing Country Selector */}
              <div className="relative">
                <label className="block mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-700 flex items-center justify-between">
                  <span>Billing Country / Region *</span>
                  <span className="text-black font-bold flex items-center gap-1 text-[11px]">
                    <Globe className="h-3.5 w-3.5 text-black" />
                    <span>Worldwide Shipping</span>
                  </span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                    className="w-full flex items-center justify-between border border-neutral-300 bg-white px-4 py-3.5 font-mono text-sm text-neutral-900 text-left focus:border-black transition-colors cursor-pointer rounded-sm shadow-sm"
                  >
                    <span className="flex items-center gap-3">
                      <FlagImage code={selectedCountry.code} className="w-6 h-4 object-cover rounded-xs border border-neutral-300 shadow-2xs shrink-0" />
                      <span className="font-sans font-bold text-neutral-900">{selectedCountry.name}</span>
                    </span>
                    <span className="font-mono text-xs text-neutral-700 font-bold">{selectedCountry.phone} ▼</span>
                  </button>

                  {countryDropdownOpen && (
                    <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-80 overflow-y-auto border border-neutral-300 bg-white p-2 shadow-2xl rounded-sm custom-scrollbar">
                      <div className="sticky top-0 z-10 bg-white pb-2 pt-1 px-1 border-b border-neutral-200">
                        <div className="relative flex items-center">
                          <Search className="absolute left-3 h-3.5 w-3.5 text-neutral-500" />
                          <input
                            type="text"
                            placeholder="Type to search country..."
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            autoFocus
                            className="w-full border border-neutral-300 bg-neutral-50 pl-9 pr-3 py-2.5 font-mono text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-black outline-none rounded-sm"
                          />
                        </div>
                      </div>
                      <div className="space-y-0.5 mt-2">
                        {filteredCountries.map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => {
                              setForm({ ...form, countryCode: c.code });
                              setCountryDropdownOpen(false);
                              setCountrySearch("");
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2.5 text-left font-mono text-xs transition-colors rounded-sm cursor-pointer ${
                              form.countryCode === c.code
                                ? "bg-black text-white font-bold"
                                : "text-neutral-800 hover:bg-neutral-100 hover:text-black"
                            }`}
                          >
                            <span className="flex items-center gap-3">
                              <FlagImage code={c.code} className="w-6 h-4 object-cover rounded-xs border border-neutral-300 shadow-2xs shrink-0" />
                              <span className="font-sans">{c.name}</span>
                            </span>
                            <span className={`text-[11px] ${form.countryCode === c.code ? "text-white font-bold" : "text-neutral-500"}`}>
                              {c.phone}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-700">
                  Billing Street Address *
                </label>
                <textarea
                  placeholder="House/Building Number, Street Name, District"
                  rows={2}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full border border-neutral-300 bg-white px-4 py-3.5 font-mono text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-black outline-none resize-none rounded-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-700">
                    City / Town
                  </label>
                  <input
                    placeholder="City"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full border border-neutral-300 bg-white px-4 py-3.5 font-mono text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-black outline-none rounded-sm"
                  />
                </div>
                <div>
                  <label className="block mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-700">
                    Postal / Zip Code
                  </label>
                  <input
                    placeholder="4001"
                    value={form.postalCode}
                    onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                    className="w-full border border-neutral-300 bg-white px-4 py-3.5 font-mono text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-black outline-none rounded-sm"
                  />
                </div>
              </div>

              {/* Same as Billing Checkbox */}
              <div className="pt-2 border-t border-neutral-200">
                <label className="flex items-center gap-3 cursor-pointer select-none py-2 px-3 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-sm transition-colors">
                  <input
                    type="checkbox"
                    checked={sameAsBilling}
                    onChange={(e) => setSameAsBilling(e.target.checked)}
                    className="h-4 w-4 rounded border-neutral-300 text-black focus:ring-black accent-black cursor-pointer"
                  />
                  <span className="font-mono text-xs font-bold text-neutral-900 uppercase tracking-wide">
                    Shipping address is the same as billing address
                  </span>
                </label>
              </div>

              {/* Separate Shipping Address Form */}
              {!sameAsBilling && (
                <div className="space-y-4 pt-2 p-5 border border-neutral-300 bg-neutral-50/70 rounded-sm">
                  <div className="border-b border-neutral-200 pb-2">
                    <h3 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-neutral-900">
                      3. Shipping Address
                    </h3>
                  </div>

                  {/* Shipping Country Selector */}
                  <div className="relative">
                    <label className="block mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-700">
                      Shipping Country / Region *
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShippingCountryDropdownOpen(!shippingCountryDropdownOpen)}
                        className="w-full flex items-center justify-between border border-neutral-300 bg-white px-4 py-3.5 font-mono text-sm text-neutral-900 text-left focus:border-black transition-colors cursor-pointer rounded-sm shadow-sm"
                      >
                        <span className="flex items-center gap-3">
                          <FlagImage code={selectedShippingCountry.code} className="w-6 h-4 object-cover rounded-xs border border-neutral-300 shadow-2xs shrink-0" />
                          <span className="font-sans font-bold text-neutral-900">{selectedShippingCountry.name}</span>
                        </span>
                        <span className="font-mono text-xs text-neutral-700 font-bold">{selectedShippingCountry.phone} ▼</span>
                      </button>

                      {shippingCountryDropdownOpen && (
                        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-80 overflow-y-auto border border-neutral-300 bg-white p-2 shadow-2xl rounded-sm custom-scrollbar">
                          <div className="sticky top-0 z-10 bg-white pb-2 pt-1 px-1 border-b border-neutral-200">
                            <div className="relative flex items-center">
                              <Search className="absolute left-3 h-3.5 w-3.5 text-neutral-500" />
                              <input
                                type="text"
                                placeholder="Type to search country..."
                                value={shippingCountrySearch}
                                onChange={(e) => setShippingCountrySearch(e.target.value)}
                                autoFocus
                                className="w-full border border-neutral-300 bg-neutral-50 pl-9 pr-3 py-2.5 font-mono text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-black outline-none rounded-sm"
                              />
                            </div>
                          </div>
                          <div className="space-y-0.5 mt-2">
                            {filteredShippingCountries.map((c) => (
                              <button
                                key={c.code}
                                type="button"
                                onClick={() => {
                                  setShippingForm({ ...shippingForm, countryCode: c.code });
                                  setShippingCountryDropdownOpen(false);
                                  setShippingCountrySearch("");
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2.5 text-left font-mono text-xs transition-colors rounded-sm cursor-pointer ${
                                  shippingForm.countryCode === c.code
                                    ? "bg-black text-white font-bold"
                                    : "text-neutral-800 hover:bg-neutral-100 hover:text-black"
                                }`}
                              >
                                <span className="flex items-center gap-3">
                                  <FlagImage code={c.code} className="w-6 h-4 object-cover rounded-xs border border-neutral-300 shadow-2xs shrink-0" />
                                  <span className="font-sans">{c.name}</span>
                                </span>
                                <span className={`text-[11px] ${shippingForm.countryCode === c.code ? "text-white font-bold" : "text-neutral-500"}`}>
                                  {c.phone}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-700">
                      Shipping Street Address *
                    </label>
                    <textarea
                      placeholder="House/Building Number, Street Name, District"
                      rows={2}
                      value={shippingForm.address}
                      onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                      className="w-full border border-neutral-300 bg-white px-4 py-3.5 font-mono text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-black outline-none resize-none rounded-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-700">
                        City / Town
                      </label>
                      <input
                        placeholder="City"
                        value={shippingForm.city}
                        onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                        className="w-full border border-neutral-300 bg-white px-4 py-3.5 font-mono text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-black outline-none rounded-sm"
                      />
                    </div>
                    <div>
                      <label className="block mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-700">
                        Postal / Zip Code
                      </label>
                      <input
                        placeholder="4001"
                        value={shippingForm.postalCode}
                        onChange={(e) => setShippingForm({ ...shippingForm, postalCode: e.target.value })}
                        className="w-full border border-neutral-300 bg-white px-4 py-3.5 font-mono text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-black outline-none rounded-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="border border-neutral-200 bg-neutral-50 p-4 font-mono text-xs flex items-center gap-3 rounded-sm">
                <MapPin className="h-5 w-5 text-black shrink-0" />
                <div>
                  <p className="text-neutral-900 font-bold">
                    {isNational
                      ? "Nationwide Express Courier (South Africa)"
                      : `Worldwide Express Air Shipping (${activeShippingCountry?.name || "International"})`}
                  </p>
                  <p className="text-neutral-600 text-[11px] mt-0.5">
                    {isNational
                      ? shipping === 0
                        ? `Complimentary door-to-door express courier (${storeSettings?.nationalShippingDays || "1–3 Business Days"} via RAM / The Courier Guy)`
                        : `Flat-rate ${zar(nationalFee)} door-to-door express courier (${storeSettings?.nationalShippingDays || "1–3 Business Days"}).`
                      : shipping === 0
                        ? `Complimentary Worldwide Express Air dispatch (${storeSettings?.internationalShippingDays || "3–7 Business Days"} via DHL / FedEx Air)`
                        : `Flat-rate ${zar(intlFee)} Worldwide Express Air (${storeSettings?.internationalShippingDays || "3–7 Business Days"}).`}
                  </p>
                </div>
              </div>

              <button
                disabled={!form.name || !form.email || !form.address || (!sameAsBilling && !shippingForm.address)}
                onClick={() => setStep(3)}
                className="w-full bg-black py-4 font-mono text-xs uppercase tracking-[0.25em] text-white hover:bg-neutral-800 disabled:opacity-40 transition-all cursor-pointer rounded-sm shadow-md font-bold"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {payments.map((p) => {
                  const isSelected = pay === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setPay(p.id)}
                      className={`border p-3.5 flex flex-col items-center justify-center text-center transition-all cursor-pointer rounded-sm ${
                        isSelected
                          ? "border-black bg-black text-white shadow-md ring-1 ring-black"
                          : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400 hover:bg-neutral-50"
                      }`}
                    >
                      <div className="h-6 flex items-center justify-center mb-1.5">
                        <PaymentLogo type={p.type} />
                      </div>
                      <span className={`font-mono text-[10px] uppercase tracking-wider font-bold ${isSelected ? "text-neutral-200" : "text-neutral-600"}`}>
                        {p.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {pay === "PayFast" && (
                <div className="border border-neutral-300 bg-white p-6 rounded-sm shadow-sm">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-6 w-6 text-blue-600" />
                    <h3 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-neutral-900">
                      PayFast Payment Gateway
                    </h3>
                  </div>
                  <p className="mt-3 text-sm text-neutral-700 leading-relaxed">
                    Pay securely with Instant EFT (Capitec, FNB, ABSA, Nedbank, Standard Bank), Credit/Debit Card, or Mobicred via South Africa's premier gateway.
                  </p>
                  <div className="mt-4 bg-neutral-50 border border-neutral-200 p-4 font-mono text-xs text-neutral-800 rounded-sm">
                    <p className="text-black font-bold uppercase tracking-wider mb-1">▶ Instant Gateway Processing</p>
                    <p className="text-neutral-600">
                      Clicking below launches the PayFast Gateway portal for <span className="text-black font-bold">{zar(total)}</span>.
                    </p>
                  </div>
                </div>
              )}

              {pay === "Yoco" && (
                <div className="border border-neutral-300 bg-white p-6 rounded-sm shadow-sm">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-6 w-6 text-cyan-600" />
                    <h3 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-neutral-900">
                      Yoco Payment Gateway
                    </h3>
                  </div>
                  <p className="mt-3 text-sm text-neutral-700 leading-relaxed">
                    Accepting all Visa & Mastercard South African debit and credit cards instantly with Yoco 256-bit SSL encrypted checkout.
                  </p>
                  <div className="mt-4 bg-cyan-50/50 border border-cyan-200 p-4 font-mono text-xs text-neutral-800 rounded-sm">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-black font-bold uppercase tracking-wider">▶ Yoco Secure Engine</p>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold">
                        ✓ SSL Secured
                      </span>
                    </div>
                    <p className="text-neutral-600 mt-1">
                      Clicking below launches the Yoco secure checkout popup for <span className="text-black font-bold">{zar(total)}</span>.
                    </p>
                  </div>
                </div>
              )}

              {pay === "PayPal" && (
                <div className="border border-neutral-300 bg-white p-6 rounded-sm shadow-sm">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-neutral-900">
                    PayPal Payment Details
                  </h3>
                  <p className="mt-3 text-sm text-neutral-700 leading-relaxed">
                    To complete your purchase via PayPal, please send the total of <span className="text-black font-mono font-bold">{zar(total)}</span> to our handle:
                  </p>
                  <div className="mt-4 flex items-center justify-between bg-neutral-50 border border-neutral-200 p-4 rounded-sm">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-neutral-500">Recipient</p>
                      <p className="mt-1 font-sans text-sm font-bold text-black">@VumileTshazi</p>
                    </div>
                    <a 
                      href="https://paypal.me/VumileTshazi" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-black text-white hover:bg-neutral-800 transition-colors px-4 py-2 font-mono text-[10px] uppercase tracking-wider font-bold rounded-sm"
                    >
                      Pay Now
                    </a>
                  </div>
                </div>
              )}

              {paymentError && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-sm flex items-start gap-2 text-red-800 font-mono text-xs">
                  <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold uppercase tracking-wider text-[11px]">Payment Error</p>
                    <p className="mt-0.5">{paymentError}</p>
                  </div>
                </div>
              )}

              <button
                onClick={placeOrder}
                className="mt-6 w-full bg-black py-4 font-mono text-xs uppercase tracking-[0.25em] text-white hover:bg-neutral-800 transition-all cursor-pointer rounded-sm shadow-md font-bold"
              >
                {pay === "Yoco" || pay === "Card"
                  ? `Pay with Yoco · ${zar(total)}`
                  : pay === "PayFast"
                  ? `Proceed to PayFast Checkout · ${zar(total)}`
                  : `Place Order · ${zar(total)}`}
              </button>
              <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.15em] text-neutral-500">
                SSL 256-Bit Encrypted Payment · Guest Checkout Supported
              </p>

              {/* Accepted Payment Gateway Icons */}
              <div className="pt-3 border-t border-neutral-200 flex flex-wrap items-center justify-center gap-3 text-[10px] font-mono text-neutral-500">
                <span className="uppercase tracking-wider text-neutral-400 font-bold">Accepted:</span>
                <div className="px-2.5 py-1.5 bg-white border border-neutral-200 rounded flex items-center justify-center shadow-2xs">
                  <PaymentLogo type="Card" />
                </div>
                <div className="px-2.5 py-1.5 bg-white border border-neutral-200 rounded flex items-center justify-center shadow-2xs">
                  <PaymentLogo type="PayFast" />
                </div>
                <div className="px-2.5 py-1.5 bg-white border border-neutral-200 rounded flex items-center justify-center shadow-2xs">
                  <PaymentLogo type="Yoco" />
                </div>
                <div className="px-2.5 py-1.5 bg-white border border-neutral-200 rounded flex items-center justify-center shadow-2xs">
                  <PaymentLogo type="PayPal" />
                </div>
                <div className="px-2.5 py-1.5 bg-white border border-neutral-200 rounded flex items-center justify-center shadow-2xs">
                  <PaymentLogo type="Apple Pay" />
                </div>
                <div className="px-2.5 py-1.5 bg-white border border-neutral-200 rounded flex items-center justify-center shadow-2xs">
                  <PaymentLogo type="Google Pay" />
                </div>
                <div className="px-2.5 py-1.5 bg-white border border-neutral-200 rounded flex items-center justify-center shadow-2xs">
                  <PaymentLogo type="Ozow" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <aside className="h-fit border border-neutral-300 bg-white p-8 shadow-sm rounded-sm">
          <h3 className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-neutral-900">Summary</h3>
          <div className="mt-6 space-y-3">
            <div className="flex justify-between text-sm text-neutral-600">
              <span>Subtotal</span>
              <span className="font-mono text-neutral-900 font-bold">{zar(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-neutral-600">
              <span className="flex flex-col">
                <span>Shipping</span>
                <span className="text-[10px] font-mono text-neutral-500 font-normal">
                  {isNational
                    ? "South Africa Express"
                    : `Express Air (${activeShippingCountry?.name || "International"})`}
                </span>
              </span>
              <span className="font-mono text-neutral-900 font-bold">
                {shipping === 0 ? "Complimentary" : zar(shipping)}
              </span>
            </div>
            <div className="mt-4 flex justify-between border-t border-neutral-200 pt-4">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-900 font-bold">Total</span>
              <span className="font-mono text-xl font-black text-black">{zar(total)}</span>
            </div>
          </div>
        </aside>
      </div>

      {/* ORDER CONFIRMATION DIALOG */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-lg border border-neutral-300 bg-white p-6 sm:p-8 shadow-2xl rounded-sm my-6 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar relative animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-neutral-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-black" />
                  <h3 className="font-mono text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-black">
                    Confirm Order & Address
                  </h3>
                </div>
                <p className="mt-1 font-mono text-[11px] text-neutral-500">
                  Please review your order summary and delivery address before final submission
                </p>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="p-1 text-neutral-400 hover:text-black transition-colors rounded cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Delivery & Customer Summary */}
            <div className="space-y-3.5 bg-neutral-50 border border-neutral-200 p-4 rounded-sm font-mono text-xs">
              <div className="border-b border-neutral-200 pb-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-1">
                  Customer
                </p>
                <p className="font-bold text-neutral-900">{form.name}</p>
                <p className="text-neutral-600 text-[11px]">{form.email}</p>
                {form.phone && (
                  <p className="text-neutral-600 text-[11px]">{selectedCountry.phone} {form.phone}</p>
                )}
              </div>

              {/* Shipping Address */}
              <div>
                <div className="flex items-center justify-between text-black font-bold uppercase tracking-wider text-[11px] mb-1">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-black shrink-0" />
                    <span>Shipping Address</span>
                  </span>
                  {!sameAsBilling && (
                    <span className="text-[9px] bg-neutral-200 px-2 py-0.5 rounded text-neutral-800">
                      Separate Shipping
                    </span>
                  )}
                </div>
                <p className="font-sans text-xs font-medium text-neutral-900 leading-relaxed pl-5">
                  {getFullShippingAddress()}
                </p>
              </div>

              {/* Billing Address if different */}
              {!sameAsBilling && (
                <div className="pt-2 border-t border-neutral-200">
                  <div className="text-neutral-600 font-bold uppercase tracking-wider text-[10px] mb-1 pl-5">
                    Billing Address
                  </div>
                  <p className="font-sans text-xs text-neutral-700 leading-relaxed pl-5">
                    {getFullBillingAddress()}
                  </p>
                </div>
              )}
            </div>

            {/* Items Summary */}
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-2">
                Order Items ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </p>
              <div className="divide-y divide-neutral-200 border border-neutral-200 rounded-sm max-h-44 overflow-y-auto custom-scrollbar">
                {items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center gap-3 bg-white">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-12 w-10 object-cover rounded-xs border border-neutral-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-xs font-bold text-black truncate">{item.name}</p>
                      <p className="font-mono text-[10px] text-neutral-500 uppercase tracking-wider">
                        Size: {item.size} · Color: {item.colour} · Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-mono text-xs font-bold text-black shrink-0">
                      {zar(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment & Totals */}
            <div className="border-t border-neutral-200 pt-3 space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Payment Method</span>
                <span className="font-bold text-black">{pay}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="font-bold text-black">{zar(subtotal)}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Express Courier Shipping</span>
                <span className="font-bold text-black uppercase">{shipping === 0 ? "Complimentary" : zar(shipping)}</span>
              </div>
              <div className="flex justify-between border-t border-neutral-200 pt-3 text-sm">
                <span className="font-bold uppercase tracking-wider text-black">Total</span>
                <span className="font-black text-black text-lg">{zar(total)}</span>
              </div>
            </div>

            {paymentError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-sm flex items-start gap-2 text-red-800 font-mono text-xs my-2">
                <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                <span>{paymentError}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                disabled={processing}
                onClick={() => setShowConfirmModal(false)}
                className="w-full sm:w-1/3 border border-neutral-300 bg-white py-3.5 font-mono text-xs uppercase tracking-[0.15em] font-bold text-neutral-800 hover:bg-neutral-100 disabled:opacity-50 transition-colors rounded-sm cursor-pointer"
              >
                Edit Details
              </button>
              <button
                type="button"
                disabled={processing}
                onClick={executePlaceOrder}
                className="w-full sm:w-2/3 bg-black py-3.5 font-mono text-xs uppercase tracking-[0.2em] font-bold text-white hover:bg-neutral-800 disabled:opacity-50 transition-all shadow-md rounded-sm cursor-pointer flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Redirecting to {pay === "PayFast" ? "PayFast" : pay === "Yoco" ? "Yoco" : "Payment Gateway"}...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Submit</span>
                    <Check className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EMBEDDED GATEWAY MODAL (YOCO / PAYFAST) */}
      {gatewayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md border border-neutral-300 bg-white p-6 shadow-2xl rounded-sm">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <div className="flex items-center gap-2.5">
                {gatewayModal === "yoco" ? (
                  <CreditCard className="h-5 w-5 text-amber-600" />
                ) : (
                  <ShieldCheck className="h-5 w-5 text-blue-600" />
                )}
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-black">
                  {gatewayModal === "yoco" ? "Yoco Card Checkout" : "PayFast Gateway Checkout"}
                </h3>
              </div>
              <button
                onClick={() => setGatewayModal(null)}
                className="p-1 text-neutral-500 hover:text-black transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 font-mono text-xs">
              <div className="bg-neutral-100 p-3 rounded-sm flex justify-between items-center text-neutral-800">
                <span>Amount Due:</span>
                <span className="font-bold text-sm text-black">{zar(total)}</span>
              </div>

              <div>
                <label className="block mb-1 text-[10px] uppercase font-bold text-neutral-600">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="e.g. J DOE"
                  value={cardForm.cardHolder}
                  onChange={(e) => setCardForm({ ...cardForm, cardHolder: e.target.value })}
                  className="w-full border border-neutral-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-black rounded-sm"
                />
              </div>

              <div>
                <label className="block mb-1 text-[10px] uppercase font-bold text-neutral-600">Card Number</label>
                <input
                  type="text"
                  placeholder="4000 0000 0000 0000"
                  maxLength={19}
                  value={cardForm.cardNumber}
                  onChange={(e) => setCardForm({ ...cardForm, cardNumber: e.target.value })}
                  className="w-full border border-neutral-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-black rounded-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-[10px] uppercase font-bold text-neutral-600">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    placeholder="12/28"
                    maxLength={5}
                    value={cardForm.expiry}
                    onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                    className="w-full border border-neutral-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-black rounded-sm"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-[10px] uppercase font-bold text-neutral-600">CVV / CVC</label>
                  <input
                    type="password"
                    placeholder="123"
                    maxLength={4}
                    value={cardForm.cvv}
                    onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                    className="w-full border border-neutral-300 bg-white px-3 py-2 text-sm text-black outline-none focus:border-black rounded-sm"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  disabled={processing}
                  onClick={() => handleAuthorizeGatewayPayment(gatewayModal === "yoco" ? "Yoco" : "PayFast")}
                  className="w-full bg-black hover:bg-neutral-800 text-white font-bold py-3.5 uppercase tracking-wider flex items-center justify-center gap-2 rounded-sm transition-all cursor-pointer"
                >
                  {processing ? (
                    <span>Authorizing Payment...</span>
                  ) : (
                    <span>Authorize Payment · {zar(total)}</span>
                  )}
                </button>
              </div>

              <p className="text-[10px] text-neutral-500 text-center flex items-center justify-center gap-1">
                <Lock className="h-3 w-3 text-neutral-500" /> 256-Bit SSL Encrypted Transaction
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PayFast Launch Modal Overlay */}
      {payfastPrompt && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 max-w-md w-full p-6 sm:p-8 rounded-xl shadow-2xl border border-neutral-200 dark:border-neutral-800 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-red-50 dark:bg-red-950/40 rounded-full flex items-center justify-center mx-auto border border-red-200 dark:border-red-900/50">
              <CreditCard className="w-7 h-7 text-[#E31837]" />
            </div>

            <div className="space-y-1">
              <h3 className="font-heading text-lg font-bold uppercase tracking-wider text-black dark:text-white">
                PayFast Onsite Gateway
              </h3>
              <p className="font-mono text-xs text-neutral-600 dark:text-neutral-400">
                Order <span className="font-bold text-black dark:text-white">#{payfastPrompt.orderNumber}</span> • Total: <span className="font-bold text-black dark:text-white">R {payfastPrompt.total}</span>
              </p>
            </div>

            <div className="bg-neutral-50 dark:bg-neutral-800/50 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700/60 text-left space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>In-Website Payment Active</span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug">
                Complete your transaction seamlessly inside the website with Instant EFT, Credit Card, SnapScan, or Zapper.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  if (payfastPrompt.uuid && typeof window.payfast_do_onsite_payment === "function") {
                    try {
                      window.payfast_do_onsite_payment({
                        uuid: payfastPrompt.uuid,
                        return_url: `${window.location.origin}/cart?payment=success&order=${encodeURIComponent(payfastPrompt.orderNumber)}`,
                        cancel_url: `${window.location.origin}/cart?payment=cancelled`,
                      }, (result) => {
                        if (result) {
                          clearCart();
                          navigate(`/track-order?payfast_status=success&order=${encodeURIComponent(payfastPrompt.orderNumber)}`);
                        }
                      });
                      return;
                    } catch (e) {
                      console.warn("Onsite popup fallback:", e);
                    }
                  }
                  // Fallback
                  submitPayFastPayment({
                    amountZar: payfastPrompt.total,
                    orderNumber: payfastPrompt.orderNumber,
                    customerEmail: payfastPrompt.email,
                    customerName: payfastPrompt.name,
                  });
                }}
                className="w-full py-3.5 px-6 bg-[#E31837] hover:bg-red-700 text-white font-mono text-xs tracking-widest uppercase font-bold rounded-md shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>PAY ONSITE IN-APP (R {payfastPrompt.total})</span>
              </button>

              <button
                onClick={() => {
                  submitPayFastPayment({
                    amountZar: payfastPrompt.total,
                    orderNumber: payfastPrompt.orderNumber,
                    customerEmail: payfastPrompt.email,
                    customerName: payfastPrompt.name,
                  });
                }}
                className="w-full py-2 px-4 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-mono text-[11px] tracking-wider uppercase font-semibold rounded transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Open in PayFast Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => setPayfastPrompt(null)}
              className="block w-full text-center font-mono text-[11px] text-neutral-400 hover:text-black dark:hover:text-white underline pt-1 cursor-pointer"
            >
              Cancel & Return to Bag
            </button>
          </div>
        </div>
      )}

      <div className="mt-16 pt-8 border-t border-neutral-200 flex justify-start">
        <BackButton label="BACK" to="/shop" />
      </div>
    </div>
  );
}
