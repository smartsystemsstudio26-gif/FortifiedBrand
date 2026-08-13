import { readJson, json, originFrom, requireEnv } from "../../src/server/_shared.mjs";

export default async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { status: 204 });
  if (request.method !== "POST") return json({ success: false, error: "Method not allowed" }, 405);

  try {
    const body = await readJson(request);
    const amountInCents = Number.isFinite(Number(body.amountInCents))
      ? Math.round(Number(body.amountInCents))
      : Math.round(Number(body.amount || 0) * 100);

    if (!amountInCents || amountInCents < 200) {
      return json({ success: false, error: "Payment amount must be at least R2.00." }, 400);
    }

    const secret = requireEnv("YOCO_SECRET_KEY");
    const origin = originFrom(request);
    const payload = {
      amount: amountInCents,
      currency: body.currency || "ZAR",
      successUrl: body.successUrl || `${origin}/track-order?yoco_status=success&order=${encodeURIComponent(body.orderNumber || "")}`,
      cancelUrl: body.cancelUrl || `${origin}/cart?yoco_status=cancel`,
      failureUrl: body.failureUrl || `${origin}/cart?yoco_status=failure`,
      metadata: {
        orderNumber: body.orderNumber || `FTD-${Date.now()}`,
        customerEmail: body.customerEmail || "",
        customerName: body.customerName || "",
      },
    };

    const response = await fetch("https://payments.yoco.com/api/checkouts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
        "Idempotency-Key": crypto.randomUUID(),
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error("[Yoco checkout error]", response.status, data);
      return json({ success: false, error: data?.message || data?.error || "Yoco checkout creation failed." }, 502);
    }

    if (!data?.redirectUrl) {
      console.error("[Yoco checkout missing redirectUrl]", data);
      return json({ success: false, error: "Yoco did not return a checkout URL." }, 502);
    }

    return json({ success: true, checkoutId: data.id, redirectUrl: data.redirectUrl, checkout: data });
  } catch (error) {
    console.error("[Yoco checkout function]", error);
    return json({ success: false, error: error.message || "Unable to create Yoco checkout." }, 500);
  }
};

export const config = {
  path: [
    "/api/checkouts", "/api/checkouts/", "/api/checkout", "/api/checkout/",
    "/api/yoco/checkout", "/api/yoco/checkouts", "/api/create-checkout"
  ],
};
