import { createHash } from "node:crypto";

export function encodeValue(value) {
  return encodeURIComponent(String(value).trim()).replace(/%20/g, "+");
}

export function generateSignature(data, passphrase = "") {
  const pairs = [];
  for (const [key, value] of Object.entries(data)) {
    if (key === "signature" || value === "" || value === null || value === undefined) continue;
    pairs.push(`${key}=${encodeValue(value)}`);
  }
  let paramString = pairs.join("&");
  if (passphrase) paramString += `&passphrase=${encodeValue(passphrase)}`;
  return createHash("md5").update(paramString).digest("hex");
}

export function parseFormBody(rawBody) {
  const params = new URLSearchParams(rawBody);
  return Object.fromEntries(params.entries());
}

export async function confirmWithPayFast(data, isSandbox) {
  const host = isSandbox ? "sandbox.payfast.co.za" : "www.payfast.co.za";
  const body = new URLSearchParams();
  for (const [key, value] of Object.entries(data)) body.append(key, String(value ?? ""));
  const response = await fetch(`https://${host}/eng/query/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "text/plain" },
    body: body.toString(),
  });
  return (await response.text()).trim() === "VALID";
}
