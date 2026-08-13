import { json, requireEnv } from "../../src/server/_shared.mjs";

export default async (request, context) => {
  if (request.method !== "GET") return json({ success: false, error: "Method not allowed" }, 405);
  const checkoutId = context.params?.id;
  if (!checkoutId) return json({ success: false, error: "Checkout ID is required" }, 400);

  try {
    const secret = requireEnv("YOCO_SECRET_KEY");
    const response = await fetch(`https://payments.yoco.com/api/checkouts/${encodeURIComponent(checkoutId)}`, {
      headers: { Authorization: `Bearer ${secret}` },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return json({ success: false, error: data?.message || "Failed to retrieve checkout status." }, response.status === 404 ? 404 : 502);
    }
    return json({ success: true, checkoutId: data.id, status: data.status, checkout: data });
  } catch (error) {
    console.error("[Yoco status function]", error);
    return json({ success: false, error: error.message || "Failed to retrieve checkout status." }, 500);
  }
};

export const config = { path: ["/api/checkouts/:id", "/api/checkout/:id", "/api/yoco/checkout/:id"] };
