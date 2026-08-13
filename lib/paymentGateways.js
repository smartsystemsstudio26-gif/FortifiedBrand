/**
 * FORTIFIED Payment Gateways Utility
 *
 * SECURITY MODEL:
 * - No payment secret is read from localStorage, Firestore, React state, or the browser.
 * - Yoco secret + PayFast merchant key/passphrase live only in Netlify Functions.
 * - The browser calls same-origin /api endpoints only.
 */

import { getStoreSettings } from "./storeSettings";

export const loadYocoSdk = () => Promise.reject(new Error("Yoco popup SDK is disabled; hosted checkout is used for secure server-side payment."));

export const createYocoCheckout = async ({
  amountZar,
  orderNumber,
  customerEmail,
  customerName,
  successUrl,
  cancelUrl,
  failureUrl,
  onRedirect,
}) => {
  const origin = window.location.origin;
  const store = getStoreSettings();
  let targetUrl = store?.yocoPayLink || "https://pay.yoco.com/fortified-brand";

  const response = await fetch("/api/checkouts", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      amountInCents: Math.round((amountZar || 0) * 100),
      currency: "ZAR",
      orderNumber,
      customerEmail,
      customerName,
      successUrl: successUrl || `${origin}/track-order?yoco_status=success&order=${encodeURIComponent(orderNumber || "")}`,
      cancelUrl: cancelUrl || `${origin}/cart?yoco_status=cancel`,
      failureUrl: failureUrl || `${origin}/cart?yoco_status=failure`,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data?.success || !data?.redirectUrl) {
    throw new Error(data?.error || "Unable to create Yoco checkout.");
  }

  targetUrl = data.redirectUrl;
  if (onRedirect) onRedirect();
  window.location.assign(targetUrl);
  return { success: true, redirectUrl: targetUrl, checkoutId: data.checkoutId };
};

export const getYocoCheckoutStatus = async (checkoutId) => {
  if (!checkoutId) throw new Error("Checkout ID is required");
  const response = await fetch(`/api/checkouts/${encodeURIComponent(checkoutId)}`);
  const data = await response.json().catch(() => ({}));
  if (response.ok && data.success) return data;
  throw new Error(data.error || "Failed to retrieve checkout status");
};

// Kept for API compatibility with the existing Cart component.
// We deliberately use hosted checkout instead of exposing a Yoco secret to the browser.
export const processYocoPayment = async ({
  amountZar,
  orderNumber,
  customerEmail,
  customerName,
  onSuccess,
  onError,
}) => {
  try {
    const result = await createYocoCheckout({
      amountZar,
      orderNumber,
      customerEmail,
      customerName,
    });
    if (onSuccess) onSuccess(result);
    return result;
  } catch (err) {
    if (onError) onError(err?.message || "Yoco payment initialization failed");
    throw err;
  }
};

export const loadPayFastOnsiteSdk = (isSandbox = false) => {
  return new Promise((resolve) => {
    if (window.payfast_do_onsite_payment) {
      resolve(window.payfast_do_onsite_payment);
      return;
    }
    const scriptUrl = isSandbox
      ? "https://sandbox.payfast.co.za/onsite/engine.js"
      : "https://www.payfast.co.za/onsite/engine.js";
    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.onload = () => resolve(window.payfast_do_onsite_payment || null);
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });
};

export const processPayFastOnsite = async ({
  amountZar,
  orderNumber,
  customerName,
  customerEmail,
  isSandbox,
  onSuccess,
  onError,
}) => {
  try {
    const store = getStoreSettings();
    const response = await fetch("/api/payfast/onsite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: amountZar,
        orderNumber,
        customerName,
        customerEmail,
        isSandbox: isSandbox !== undefined ? isSandbox : store?.payfastEnv === "sandbox",
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.success || !data.uuid) {
      throw new Error(data.error || "Could not generate PayFast Onsite payment session.");
    }

    await loadPayFastOnsiteSdk(data.isSandbox);
    if (typeof window.payfast_do_onsite_payment !== "function") {
      throw new Error("PayFast Onsite SDK could not be loaded.");
    }

    window.payfast_do_onsite_payment({
      uuid: data.uuid,
      return_url: data.return_url,
      cancel_url: data.cancel_url,
    }, (result) => {
      if (result) {
        if (onSuccess) onSuccess(result);
      } else if (onError) {
        onError("Payment cancelled or closed");
      }
    });

    return { success: true, uuid: data.uuid, returnUrl: data.return_url, cancelUrl: data.cancel_url };
  } catch (err) {
    if (onError) onError(err?.message || "PayFast Onsite payment error.");
    throw err;
  }
};

/**
 * Secure PayFast form submission.
 * The browser receives a signed set of fields, but never receives the merchant key/passphrase.
 */
export const submitPayFastPayment = async ({
  amountZar,
  orderNumber,
  customerName,
  customerEmail,
  returnUrl = window.location.origin + "/cart?payment=success&order=" + encodeURIComponent(orderNumber || ""),
  cancelUrl = window.location.origin + "/cart?payment=cancelled",
}) => {
  const store = getStoreSettings();
  const response = await fetch("/api/payfast/form", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: amountZar,
      orderNumber,
      customerName,
      customerEmail,
      returnUrl,
      cancelUrl,
      isSandbox: store?.payfastEnv === "sandbox",
    }),
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.success || !result.fields) {
    throw new Error(result.error || "Could not create PayFast payment form.");
  }

  const form = document.createElement("form");
  form.method = "POST";
  form.action = result.payfastUrl;
  form.target = window.top && window.top !== window ? "_blank" : "_self";

  Object.entries(result.fields).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = String(value);
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
  setTimeout(() => form.remove(), 1000);
  return result;
};
