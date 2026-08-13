import { json } from "../../src/server/_shared.mjs";
import { confirmWithPayFast, generateSignature, parseFormBody } from "../../src/server/payfast-common.mjs";

export default async (request) => {
  if (request.method !== "POST") return json({ received: false, error: "Method not allowed" }, 405);
  try {
    const raw = await request.text();
    const data = parseFormBody(raw);
    const merchantId = process.env.PAYFAST_MERCHANT_ID;
    const passphrase = process.env.PAYFAST_PASSPHRASE || "";
    const isSandbox = process.env.PAYFAST_ENV === "sandbox";

    if (!merchantId) return json({ received: false, error: "PayFast merchant ID is not configured" }, 503);
    if (String(data.merchant_id || "") !== String(merchantId)) return json({ received: false, error: "Invalid merchant ID" }, 401);

    const expectedSignature = generateSignature(data, passphrase);
    if (!data.signature || data.signature !== expectedSignature) {
      return json({ received: false, error: "Invalid PayFast signature" }, 401);
    }

    const confirmed = await confirmWithPayFast(data, isSandbox);
    if (!confirmed) return json({ received: false, error: "PayFast server validation failed" }, 400);

    console.log("[PayFast ITN verified]", {
      paymentId: data.m_payment_id,
      status: data.payment_status,
      amount: data.amount_gross,
    });

    // IMPORTANT: persist/update the order here once a server-side order repository is selected.
    return new Response("OK", { status: 200, headers: { "content-type": "text/plain" } });
  } catch (error) {
    console.error("[PayFast webhook function]", error);
    return json({ received: false, error: error.message || "ITN processing failed" }, 500);
  }
};

export const config = { path: ["/api/webhooks/payfast", "/api/payfast/itn"] };
