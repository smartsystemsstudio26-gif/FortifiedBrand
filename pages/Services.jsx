import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Phone, Mail, Check, Search, Package, Truck, ArrowRight, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "@/components/Reveal";
import { base44 } from "@/api/base44Client";

const notEligible = [
  "Customized products", "Personalised products", "Altered garments", "Intimate apparel",
  "Final sale merchandise", "Clearance items", "Markdown products",
];

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    await base44.integrations.Core.SendEmail({
      to: "fortifiedbrand31@gmail.com",
      subject: `New enquiry from ${form.name}`,
      body: `From: ${form.name} (${form.email})\n\n${form.message}`,
    });
    setSending(false);
    setSent(true);
  };

  if (sent)
    return (
      <div className="flex flex-col items-center justify-center border border-neutral-200 bg-neutral-50 py-20 text-center rounded-lg">
        <Check className="h-8 w-8 text-black" />
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-neutral-700 font-bold">Message received. We'll be in touch shortly.</p>
      </div>
    );

  return (
    <form onSubmit={submit} className="space-y-4">
      {["name", "email"].map((f) => (
        <input
          key={f}
          required
          type={f === "email" ? "email" : "text"}
          placeholder={f === "email" ? "Email Address" : "Full Name"}
          value={form[f]}
          onChange={(e) => setForm({ ...form, [f]: e.target.value })}
          className="w-full border border-neutral-300 bg-neutral-50 px-4 py-4 font-mono text-sm text-black placeholder:text-neutral-400 focus:border-black focus:outline-none rounded-sm"
        />
      ))}
      <textarea
        required rows={5} placeholder="Your message or query..."
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className="w-full border border-neutral-300 bg-neutral-50 px-4 py-4 font-mono text-sm text-black placeholder:text-neutral-400 focus:border-black focus:outline-none rounded-sm"
      />
      <button disabled={sending} className="w-full bg-black py-4 font-mono text-xs uppercase tracking-[0.25em] text-white font-bold transition-colors hover:bg-neutral-800 disabled:opacity-50 cursor-pointer rounded-sm">
        {sending ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}

function Policy({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-neutral-200">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between py-6 text-left cursor-pointer">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-black font-bold">{title}</span>
        <span className="text-neutral-500 font-bold text-lg">{open ? "—" : "+"}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="pb-6 text-sm leading-relaxed text-neutral-700">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Services() {
  const navigate = useNavigate();
  const [quickOrderNum, setQuickOrderNum] = useState("");

  const handleQuickLookup = (e) => {
    e.preventDefault();
    if (quickOrderNum.trim()) {
      navigate(`/track-order?order=${encodeURIComponent(quickOrderNum.trim())}`);
    } else {
      navigate(`/track-order`);
    }
  };

  return (
    <div className="bg-white min-h-screen text-neutral-900">
      <div className="mx-auto max-w-[1600px] px-6 pb-28 pt-36 md:px-12">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-200 pb-10 gap-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-neutral-500 font-bold">Client Services</p>
              <h1 className="mt-4 font-display text-6xl font-black tracking-monolith text-black md:text-8xl">Support</h1>
            </div>
            <Link
              to="/track-order"
              className="bg-black hover:bg-neutral-800 text-white font-mono text-[10px] uppercase tracking-[0.25em] font-bold px-6 py-4 flex items-center gap-2 transition-all self-start md:self-auto rounded-sm"
            >
              <Truck className="h-4 w-4" /> Open Full Order Tracker <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>

        {/* QUICK ORDER TRACKING CARD */}
        <Reveal delay={0.05}>
          <div className="mt-10 border border-neutral-200 bg-neutral-50 p-6 md:p-8 rounded-lg shadow-sm">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2.5 text-black font-mono text-[10px] uppercase tracking-[0.3em] font-bold">
                <Package className="h-4 w-4 text-emerald-600" /> Live Purchase Lookup
              </div>
              <h2 className="mt-2 font-display text-2xl font-bold uppercase text-black tracking-wider">
                Track Your Purchase Status
              </h2>
              <p className="mt-1 font-mono text-xs text-neutral-600">
                Enter your FORTIFIED order number (e.g. <span className="text-black font-bold">FTD-982104</span>) to view real-time fulfillment, courier tracking, and tax invoice download.
              </p>

              <form onSubmit={handleQuickLookup} className="mt-5 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Enter Order # (e.g. FTD-982104)"
                    value={quickOrderNum}
                    onChange={(e) => setQuickOrderNum(e.target.value)}
                    className="w-full bg-white border border-neutral-300 px-10 py-3.5 font-mono text-xs uppercase tracking-wider text-black placeholder-neutral-400 focus:border-black focus:outline-none rounded-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-black hover:bg-neutral-800 text-white px-8 py-3.5 font-mono text-[10px] uppercase tracking-[0.25em] font-bold flex items-center justify-center gap-2 transition-all rounded-sm cursor-pointer"
                >
                  <Truck className="h-4 w-4" /> Track Status
                </button>
              </form>
            </div>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-16 md:grid-cols-2">
          <Reveal>
            <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-500 font-bold">Contact Us</h2>
            <div className="mt-6 space-y-4 font-medium">
              <a href="tel:+27685940131" className="flex items-center gap-4 text-neutral-900 hover:text-black"><Phone className="h-4 w-4" /> +27 68 594 0131</a>
              <a href="mailto:fortifiedbrand31@gmail.com" className="flex items-center gap-4 text-neutral-900 hover:text-black"><Mail className="h-4 w-4" /> fortifiedbrand31@gmail.com</a>
            </div>
            <div className="mt-10"><ContactForm /></div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-12">
              <div>
                <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-500 font-bold">FAQ's</h2>
                <div className="mt-6">
                  <Policy title="What is a pre-order?">
                    A pre-order is a purchase made for a product before it’s
                    officially released or in stock. It allows you to secure your
                    item in advance. It helps us minimise waste, streamline
                    production and create a better quality product.
                  </Policy>
                  <Policy title="How long will it take to receive my pre-order?">
                    The estimated delivery time for pre-orders is displayed in
                    the product details, if there is any significant change to
                    your delivery date - there we will contact you to let you know.
                  </Policy>
                  <Policy title="Can I cancel or modify my pre-order?">
                    Yes, you can cancel or modify your pre-order at any time
                    before it ships. Please contact our customer service team
                    for assistance.
                  </Policy>
                </div>
              </div>

              <div>
                <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-neutral-500 font-bold">Policies & South African Logistics</h2>
                <div className="mt-6">
                  <Policy title="Delivery to South Africa & Shipping Rates">
                    FORTIFIED BRAND (PTY) LTD is a proudly South African company based in Durban, South Africa. We offer door-to-door express courier shipping nationwide across all 9 provinces in South Africa at a flat rate of <strong>R 100</strong> (via The Courier Guy, RAM Express, or Aramex) within 1–3 business days.
                    <br /><br />
                    <strong>International Shipping:</strong> Worldwide express air shipping is available for all international destinations at a flat rate of <strong>R 450</strong>. Express air delivery typically takes 3–7 business days via DHL Express or FedEx.
                  </Policy>
                  <Policy title="Returns">
                    Customers have <span className="text-black font-bold">14 days from the delivery date</span> to return eligible products. The following items are not eligible for return or exchange:
                    <ul className="mt-3 space-y-1">
                      {notEligible.map((x) => <li key={x} className="font-mono text-xs text-neutral-600">— {x}</li>)}
                    </ul>
                  </Policy>
                  <Policy title="South African Returns">
                    Local returns within South Africa are complimentary. Contact us via phone or email to arrange a door-to-door courier collection within 14 days of delivery.
                  </Policy>
                  <Policy title="International Returns">
                    International returns are accepted within 14 days. Return shipping costs are borne by the customer unless the item is faulty.
                  </Policy>
                  <Policy title="Full Return Policy">
                    Items must be unworn, unwashed and in original condition with tags attached. Refunds are processed to the original payment method within 5–7 business days of receipt.
                  </Policy>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}