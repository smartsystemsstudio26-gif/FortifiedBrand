import { json, readJson, originFrom } from "../../src/server/_shared.mjs";
import { generateSignature } from "../../src/server/payfast-common.mjs";

export default async (request) => {
  if (request.method !== "POST") return json({ success: false, error: "Method not allowed" }, 405);
  try {
    const body = await readJson(request);
    const merchantId = process.env.PAYFAST_MERCHANT_ID;
    const merchantKey = process.env.PAYFAST_MERCHANT_KEY;
    const passphrase = process.env.PAYFAST_PASSPHRASE || "";
    const isSandbox = body.isSandbox !== undefined ? Boolean(body.isSandbox) : process.env.PAYFAST_ENV === "sandbox";
    if (!merchantId || !merchantKey) return json({ success: false, error: "PayFast is not configured on the server." }, 503);

    const origin = originFrom(request);
    const orderNumber = body.orderNumber || `ORDER-${Date.now()}`;
    const payload = {
      merchant_id: String(merchantId).trim(),
      merchant_key: String(merchantKey).trim(),
      return_url: `${origin}/cart?payment=success&order=${encodeURIComponent(orderNumber)}`,
      cancel_url: `${origin}/cart?payment=cancelled`,
      notify_url: `${origin}/api/webhooks/payfast`,
      name_first: String((body.customerName || "Valued Customer").split(" ")[0]),
      name_last: String((body.customerName || "Valued Customer").split(" ").slice(1).join(" ") || "Customer"),
      email_address: body.customerEmail || "customer@example.com",
      m_payment_id: String(orderNumber),
      amount: Number(body.amount || 0).toFixed(2),
      item_name: `FORTIFIED Order ${orderNumber}`.trim(),
      custom_str1: "FORTIFIED_BRAND",
    };

    if (Number(payload.amount) < 5) return json({ success: false, error: "PayFast requires a minimum payment of R5.00." }, 400);
    payload.signature = generateSignature(payload, passphrase);

    const targetUrl = isSandbox ? "https://sandbox.payfast.co.za/onsite/process" : "https://www.payfast.co.za/onsite/process";
    const form = new URLSearchParams();
    for (const [key, value] of Object.entries(payload)) form.append(key, String(value));
    const response = await fetch(targetUrl, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" }, body: form.toString() });
    const responseText = await response.text();
    let data = {};
    try { data = JSON.parse(responseText); } catch {}

    if (!response.ok || !data?.uuid) {
      console.error("[PayFast Onsite]", response.status, responseText);
      return json({ success: false, error: data?.error || data?.message || "Could not generate PayFast Onsite UUID" }, 502);
    }

    return json({ success: true, uuid: data.uuid, return_url: payload.return_url, cancel_url: payload.cancel_url, isSandbox });
  } catch (error) {
    console.error("[PayFast Onsite function]", error);
    return json({ success: false, error: error.message || "PayFast Onsite error" }, 500);
  }
};

export const config = { path: "/api/payfast/onsite" };
