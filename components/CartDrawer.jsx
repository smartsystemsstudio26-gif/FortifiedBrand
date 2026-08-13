import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/lib/CartContext";
import { zar } from "@/lib/media";
import { useCurrency } from "@/context/CurrencyContext";
import CurrencySelectorBadge from "@/components/CurrencySelectorBadge";
import { useStoreSettings } from "@/lib/storeSettings";

export default function CartDrawer() {
  const { items, open, setOpen, removeItem, updateQty, subtotal } = useCart();
  const { currentCountry, currentCurrency, isInternational } = useCurrency();
  const { storeSettings } = useStoreSettings();
  const navigate = useNavigate();

  const isNational = currentCountry?.code === "ZA";
  const nationalFee = storeSettings?.nationalShippingFee ?? 100;
  const nationalThreshold = storeSettings?.nationalFreeThreshold ?? 0;
  const intlFee = storeSettings?.internationalShippingFee ?? 450;
  const intlThreshold = storeSettings?.internationalFreeThreshold ?? 0;

  const drawerShipping = isNational
    ? (nationalThreshold > 0 && subtotal >= nationalThreshold ? 0 : nationalFee)
    : (intlThreshold > 0 && subtotal >= intlThreshold ? 0 : intlFee);

  const drawerTotal = subtotal + drawerShipping;

  const checkout = () => {
    setOpen(false);
    navigate("/cart");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            className="fixed right-0 top-0 z-[80] flex h-full w-full max-w-md flex-col border-l border-neutral-200 bg-white text-black shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
          >
            <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-5 bg-neutral-900 text-white">
              <div className="flex items-center gap-3">
                <h3 className="font-mono text-xs uppercase tracking-[0.3em] font-bold">Your Bag</h3>
                <CurrencySelectorBadge />
              </div>
              <button onClick={() => setOpen(false)} className="text-neutral-400 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-4">
              {items.length === 0 ? (
                <p className="mt-20 text-center font-mono text-xs uppercase tracking-[0.2em] text-neutral-500">
                  Your bag is empty
                </p>
              ) : (
                items.map((i) => (
                  <div key={i.key} className="flex gap-4 border-b border-neutral-200 py-5">
                    <img src={i.image || "/images/embroidered-black/emb_black_front.jpg"} alt={i.name} className="h-24 w-20 object-cover border border-neutral-100" />
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <p className="text-sm font-bold text-black">{i.name}</p>
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-500 mt-0.5">
                          Size {i.size}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 border border-neutral-300 px-2 py-1 bg-neutral-50">
                          <button onClick={() => updateQty(i.key, i.quantity - 1)} className="text-neutral-600 hover:text-black"><Minus className="h-3 w-3" /></button>
                          <span className="font-mono text-xs font-bold text-black">{i.quantity}</span>
                          <button onClick={() => updateQty(i.key, i.quantity + 1)} className="text-neutral-600 hover:text-black"><Plus className="h-3 w-3" /></button>
                        </div>
                        <span className="font-mono text-xs font-bold text-black">{zar(i.price * i.quantity)}</span>
                      </div>
                    </div>
                    <button onClick={() => removeItem(i.key)} className="self-start text-neutral-400 hover:text-black transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t border-neutral-200 px-6 py-6 bg-neutral-50">
                <div className="flex justify-between items-baseline">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-neutral-600">Subtotal</span>
                  <div className="text-right">
                    <span className="font-mono text-base font-bold text-black block">{zar(subtotal)}</span>
                    {isInternational && (
                      <span className="font-mono text-[9px] text-neutral-500 block">
                        (Base ZAR: R {subtotal.toLocaleString("en-ZA")})
                      </span>
                    )}
                  </div>
                </div>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.15em] text-neutral-600 flex items-center gap-1.5">
                  <span>{currentCountry.flag}</span>
                  <span>
                    {drawerShipping === 0
                      ? `Complimentary Express Shipping to ${currentCountry.name} (${currentCurrency.code})`
                      : `Express Shipping to ${currentCountry.name}: ${zar(drawerShipping)}`}
                  </span>
                </p>
                <button
                  onClick={checkout}
                  className="mt-5 w-full bg-black py-4 font-mono text-xs font-bold uppercase tracking-[0.25em] text-white transition-colors hover:bg-neutral-800 flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <span>·</span>
                  <span>{zar(drawerTotal)}</span>
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}