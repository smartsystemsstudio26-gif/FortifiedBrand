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
    const customerName = body.customerName || "Valued Customer";
    const parts = String(customerName).trim().split(/\s+/);
    const fields = {
      merchant_id: String(merchantId).trim(),
      merchant_key: String(merchantKey).trim(),
      return_url: body.returnUrl || `${origin}/cart?payment=success&order=${encodeURIComponent(orderNumber)}`,
      cancel_url: body.cancelUrl || `${origin}/cart?payment=cancelled`,
      notify_url: `${origin}/api/webhooks/payfast`,
      name_first: parts.shift() || "Valued",
      name_last: parts.join(" ") || "Customer",
      email_address: body.customerEmail || "customer@example.com",
      m_payment_id: String(orderNumber),
      amount: Number(body.amount || 0).toFixed(2),
      item_name: `FORTIFIED Order ${orderNumber}`.trim(),
      custom_str1: "FORTIFIED_BRAND",
    };

    if (Number(fields.amount) < 5) return json({ success: false, error: "PayFast requires a minimum payment of R5.00." }, 400);
    fields.signature = generateSignature(fields, passphrase);

    return json({
      success: true,
      payfastUrl: isSandbox ? "https://sandbox.payfast.co.za/eng/process" : "https://www.payfast.co.za/eng/process",
      fields,
    });
  } catch (error) {
    console.error("[PayFast form function]", error);
    return json({ success: false, error: error.message || "PayFast form error" }, 500);
  }
};

export const config = { path: "/api/payfast/form" };
