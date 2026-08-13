// Currency exchange rates relative to base ZAR store pricing and formatting utilities

export const CURRENCIES = {
  ZAR: { code: "ZAR", symbol: "R", name: "South African Rand", rate: 1.0, locale: "en-ZA", flag: "🇿🇦" },
  USD: { code: "USD", symbol: "$", name: "US Dollar", rate: 0.054, locale: "en-US", flag: "🇺🇸" },
  EUR: { code: "EUR", symbol: "€", name: "Euro", rate: 0.050, locale: "de-DE", flag: "🇪🇺" },
  GBP: { code: "GBP", symbol: "£", name: "British Pound", rate: 0.042, locale: "en-GB", flag: "🇬🇧" },
  CAD: { code: "CAD", symbol: "C$", name: "Canadian Dollar", rate: 0.074, locale: "en-CA", flag: "🇨🇦" },
  AUD: { code: "AUD", symbol: "A$", name: "Australian Dollar", rate: 0.082, locale: "en-AU", flag: "🇦🇺" },
  AED: { code: "AED", symbol: "AED", name: "UAE Dirham", rate: 0.20, locale: "ar-AE", flag: "🇦🇪" },
  NGN: { code: "NGN", symbol: "₦", name: "Nigerian Naira", rate: 82.0, locale: "en-NG", flag: "🇳🇬" },
  KES: { code: "KES", symbol: "KSh", name: "Kenyan Shilling", rate: 7.0, locale: "sw-KE", flag: "🇰🇪" },
  JPY: { code: "JPY", symbol: "¥", name: "Japanese Yen", rate: 8.3, locale: "ja-JP", flag: "🇯🇵" },
  CNY: { code: "CNY", symbol: "¥", name: "Chinese Yuan", rate: 0.39, locale: "zh-CN", flag: "🇨🇳" },
  INR: { code: "INR", symbol: "₹", name: "Indian Rupee", rate: 4.5, locale: "en-IN", flag: "🇮🇳" },
  CHF: { code: "CHF", symbol: "CHF", name: "Swiss Franc", rate: 0.047, locale: "de-CH", flag: "🇨🇭" },
  BWP: { code: "BWP", symbol: "P", name: "Botswana Pula", rate: 0.74, locale: "en-BW", flag: "🇧🇼" },
  NAD: { code: "NAD", symbol: "N$", name: "Namibian Dollar", rate: 1.0, locale: "en-NA", flag: "🇳🇦" },
  BRL: { code: "BRL", symbol: "R$", name: "Brazilian Real", rate: 0.31, locale: "pt-BR", flag: "🇧🇷" },
  SAR: { code: "SAR", symbol: "SR", name: "Saudi Riyal", rate: 0.20, locale: "ar-SA", flag: "🇸🇦" },
  SGD: { code: "SGD", symbol: "S$", name: "Singapore Dollar", rate: 0.072, locale: "en-SG", flag: "🇸🇬" },
  NZD: { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar", rate: 0.090, locale: "en-NZ", flag: "🇳🇿" },
  GHS: { code: "GHS", symbol: "GH₵", name: "Ghanaian Cedi", rate: 0.85, locale: "en-GH", flag: "🇬🇭" },
};

// Map country codes (ISO 2) to supported currency codes
const COUNTRY_TO_CURRENCY = {
  ZA: "ZAR",
  US: "USD",
  GB: "GBP",
  CA: "CAD",
  AU: "AUD",
  AE: "AED",
  NG: "NGN",
  KE: "KES",
  JP: "JPY",
  CN: "CNY",
  IN: "INR",
  CH: "CHF",
  BW: "BWP",
  NA: "NAD",
  BR: "BRL",
  SA: "SAR",
  SG: "SGD",
  NZ: "NZD",
  GH: "GHS",
  // Eurozone Countries
  DE: "EUR", FR: "EUR", IT: "EUR", ES: "EUR", NL: "EUR", BE: "EUR", AT: "EUR",
  IE: "EUR", FI: "EUR", PT: "EUR", GR: "EUR", CY: "EUR", EE: "EUR", LV: "EUR",
  LT: "EUR", LU: "EUR", MT: "EUR", SK: "EUR", SI: "EUR", HR: "EUR", AD: "EUR",
  MC: "EUR", SM: "EUR", VA: "EUR"
};

/**
 * Get currency configuration for a given country code
 */
export function getCurrencyForCountry(countryCode) {
  const code = COUNTRY_TO_CURRENCY[countryCode?.toUpperCase()] || "USD";
  return CURRENCIES[code] || CURRENCIES.USD;
}

/**
 * Convert ZAR base price to target currency
 */
export function convertFromZar(zarAmount, currencyCode = "ZAR") {
  const num = Number(zarAmount) || 0;
  const currency = CURRENCIES[currencyCode] || CURRENCIES.ZAR;
  const converted = num * currency.rate;
  return {
    raw: converted,
    code: currency.code,
    symbol: currency.symbol,
    rate: currency.rate,
    formatted: formatCurrencyValue(converted, currency)
  };
}

/**
 * Format converted currency value nicely
 */
export function formatCurrencyValue(amount, currency) {
  const num = Number(amount) || 0;
  // Zero decimals for JPY, NGN, KES, INR
  const noDecimals = ["JPY", "NGN", "KES", "INR"].includes(currency.code);
  const decimals = noDecimals ? 0 : 2;

  const formattedNum = num.toLocaleString(currency.locale || "en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });

  if (currency.code === "ZAR") {
    return `R ${num.toLocaleString("en-ZA")}`;
  }

  // Symbol placement
  if (["AED", "CHF", "KSh"].includes(currency.symbol)) {
    return `${currency.symbol} ${formattedNum}`;
  }
  return `${currency.symbol}${formattedNum}`;
}

/**
 * Global helper to format price based on selected currency
 */
export function formatPriceWithCurrency(zarAmount, currencyCode = "ZAR", showCodeSuffix = false) {
  const curr = CURRENCIES[currencyCode] || CURRENCIES.ZAR;
  const converted = (Number(zarAmount) || 0) * curr.rate;
  const formatted = formatCurrencyValue(converted, curr);
  
  if (showCodeSuffix && curr.code !== "ZAR") {
    return `${formatted} ${curr.code}`;
  }
  return formatted;
}
