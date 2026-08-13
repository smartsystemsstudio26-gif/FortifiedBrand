import { json, readJson } from "../../src/server/_shared.mjs";

export default async (request) => {
  if (request.method !== "POST") return json({ success: false, error: "Method not allowed" }, 405);
  const body = await readJson(request);
  const path = new URL(request.url).pathname;

  if (path.endsWith("send-vip-email")) {
    if (!body.email) return json({ success: false, error: "Email address is required" }, 400);
    console.log("[VIP Email Dispatch Request]", { email: body.email, name: body.name, tier: body.tier });
    return json({
      success: true,
      method: "queued_logged",
      message: "VIP email request logged. Add a transactional email provider to send automatically.",
      recipient: body.email,
    });
  }

  console.log("[Broadcast Email Request]", { subject: body.subject, recipients: Array.isArray(body.recipients) ? body.recipients.length : 0 });
  return json({
    success: true,
    method: "queued_logged",
    message: `Broadcast request logged for ${Array.isArray(body.recipients) ? body.recipients.length : 0} clients.`,
  });
};

export const config = { path: ["/api/send-vip-email", "/api/send-broadcast-email"] };
