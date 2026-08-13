import { json } from "../../src/server/_shared.mjs";

export default async () => json({
  success: false,
  error: "Direct token charge has been disabled in this migration. Use the secure Yoco hosted checkout endpoint at /api/checkouts.",
}, 410);

export const config = { path: ["/api/yoco/charge", "/api/charge"] };
