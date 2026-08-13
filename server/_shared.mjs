// Shared helpers are imported by individual functions. Netlify ignores underscore-prefixed files as function entrypoints.
export async function readJson(request) {
  try { return await request.json(); } catch { return {}; }
}

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

export function originFrom(request) {
  const configured = process.env.URL;
  if (configured) return configured.replace(/\/$/, "");
  const origin = request.headers.get("origin");
  if (origin) return origin.replace(/\/$/, "");
  return "https://fortifiedbrand.netlify.app";
}

export function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}
