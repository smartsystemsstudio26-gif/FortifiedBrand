import React, { createContext, useContext, useState, useEffect } from "react";
import { CURRENCIES, getCurrencyForCountry, formatPriceWithCurrency, convertFromZar } from "@/lib/currency";
import { ALL_COUNTRIES, getCountryByCode } from "@/lib/countries";

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [countryCode, setCountryCodeState] = useState(() => {
    return localStorage.getItem("fortified_country_code") || "ZA";
  });

  const [currencyCode, setCurrencyCodeState] = useState(() => {
    return localStorage.getItem("fortified_currency_code") || "ZAR";
  });

  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);

  // Sync state with localStorage
  useEffect(() => {
    localStorage.setItem("fortified_country_code", countryCode);
  }, [countryCode]);

  useEffect(() => {
    localStorage.setItem("fortified_currency_code", currencyCode);
  }, [currencyCode]);

  // Set country and automatically update matching currency
  const setCountryCode = (code) => {
    const validCountry = getCountryByCode(code);
    if (validCountry) {
      setCountryCodeState(validCountry.code);
      const matchedCurrency = getCurrencyForCountry(validCountry.code);
      setCurrencyCodeState(matchedCurrency.code);
    }
  };

  // Set currency directly
  const setCurrencyCode = (code) => {
    if (CURRENCIES[code]) {
      setCurrencyCodeState(code);
    }
  };

  const currentCountry = getCountryByCode(countryCode) || ALL_COUNTRIES[0];
  const currentCurrency = CURRENCIES[currencyCode] || CURRENCIES.ZAR;
  const isInternational = currentCurrency.code !== "ZAR";

  // Format price helper using active currency
  const formatPrice = (zarAmount, showSuffix = false) => {
    return formatPriceWithCurrency(zarAmount, currentCurrency.code, showSuffix);
  };

  // Convert raw helper
  const convert = (zarAmount) => {
    return convertFromZar(zarAmount, currentCurrency.code);
  };

  return (
    <CurrencyContext.Provider
      value={{
        countryCode,
        currencyCode,
        currentCountry,
        currentCurrency,
        isInternational,
        setCountryCode,
        setCurrencyCode,
        formatPrice,
        convert,
        allCurrencies: Object.values(CURRENCIES),
        allCountries: ALL_COUNTRIES,
        isCurrencyModalOpen,
        setIsCurrencyModalOpen,
        openCurrencyModal: () => setIsCurrencyModalOpen(true),
        closeCurrencyModal: () => setIsCurrencyModalOpen(false)
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    // Fallback safe object if called outside Provider
    return {
      countryCode: "ZA",
      currencyCode: "ZAR",
      currentCountry: { code: "ZA", name: "South Africa", flag: "🇿🇦" },
      currentCurrency: { code: "ZAR", symbol: "R", name: "South African Rand", rate: 1.0 },
      isInternational: false,
      setCountryCode: () => {},
      setCurrencyCode: () => {},
      formatPrice: (amt) => `R ${Number(amt || 0).toLocaleString("en-ZA")}`,
      convert: (amt) => ({ raw: Number(amt || 0), formatted: `R ${Number(amt || 0).toLocaleString("en-ZA")}`, code: "ZAR", symbol: "R", rate: 1.0 }),
      allCurrencies: Object.values(CURRENCIES),
      allCountries: ALL_COUNTRIES,
      isCurrencyModalOpen: false,
      setIsCurrencyModalOpen: () => {},
      openCurrencyModal: () => {},
      closeCurrencyModal: () => {}
    };
  }
  return context;
}
