import { createHmac, timingSafeEqual } from "node:crypto";
import { json, requireEnv } from "../../src/server/_shared.mjs";

function verifyYocoSignature(rawBody, headers, secret) {
  const webhookId = headers.get("webhook-id");
  const webhookTimestamp = headers.get("webhook-timestamp");
  const webhookSignature = headers.get("webhook-signature");
  if (!webhookId || !webhookTimestamp || !webhookSignature) return false;

  const ts = Number(webhookTimestamp);
  if (!Number.isFinite(ts) || Math.abs(Date.now() / 1000 - ts) > 300) return false;

  const signingSecret = secret.startsWith("whsec_") ? secret.slice(6) : secret;
  let secretBytes;
  try { secretBytes = Buffer.from(signingSecret, "base64"); } catch { return false; }
  const signed = `${webhookId}.${webhookTimestamp}.${rawBody}`;
  const expected = createHmac("sha256", secretBytes).update(signed).digest("base64");

  return webhookSignature.split(" ").some((candidate) => {
    const value = candidate.replace(/^v1,/, "");
    const a = Buffer.from(value);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  });
}

export default async (request) => {
  if (request.method !== "POST") return json({ received: false, error: "Method not allowed" }, 405);

  try {
    const secret = requireEnv("YOCO_WEBHOOK_SECRET");
    const rawBody = await request.text();
    if (!verifyYocoSignature(rawBody, request.headers, secret)) {
      return json({ received: false, error: "Invalid webhook signature" }, 401);
    }

    let event = {};
    try { event = JSON.parse(rawBody); } catch {}
    console.log("[Yoco webhook verified]", event?.type || event?.event || "unknown");

    // IMPORTANT: persist/update the order here once a server-side order repository is selected.
    // The current project stores much of its order state client-side, so this function does not
    // invent a database write that could incorrectly mark an order as paid.
    return json({ received: true, status: "acknowledged" }, 200);
  } catch (error) {
    console.error("[Yoco webhook]", error);
    return json({ received: false, error: error.message || "Webhook processing failed" }, 500);
  }
};

export const config = { path: ["/api/webhooks/yoco", "/api/yoco/webhook"] };
