import CryptoJS from "crypto-js";

let payhereScriptPromise = null;

const PAYHERE_SCRIPT_URL = "https://www.payhere.lk/lib/payhere.js";

function readEnv(name, fallback = "") {
  const env = import.meta.env ?? {};
  const value = env[name];
  if (typeof value === "string") return value.trim();
  return value || fallback;
}

export function getPayHereConfig() {
  const merchantId = readEnv("VITE_PAYHERE_MERCHANT_ID", "1235437");
  const merchantSecret =
    readEnv("VITE_PAYHERE_API_KEY", "") || readEnv("PAYHERE_API_KEY", "");
  return {
    merchantId,
    merchantSecret,
    returnUrl: readEnv(
      "VITE_PAYHERE_RETURN_URL",
      `${window.location.origin}/payment/success`,
    ),
    cancelUrl: readEnv(
      "VITE_PAYHERE_CANCEL_URL",
      `${window.location.origin}/payment/failed`,
    ),
    notifyUrl: readEnv("VITE_PAYHERE_NOTIFY_URL", ""),
    firstName: readEnv("VITE_PAYHERE_DEFAULT_FIRST_NAME", "Tutor"),
    lastName: readEnv("VITE_PAYHERE_DEFAULT_LAST_NAME", "Member"),
    address: readEnv("VITE_PAYHERE_DEFAULT_ADDRESS", "Smart Tuition Finder"),
    city: readEnv("VITE_PAYHERE_DEFAULT_CITY", "Colombo"),
    country: readEnv("VITE_PAYHERE_DEFAULT_COUNTRY", "Sri Lanka"),
    sandbox: true,
  };
}

export function validatePayHereConfig(cfg) {
  if (!cfg || typeof cfg !== "object") return "PayHere config is missing.";
  if (!cfg.merchantId || !/^\d+$/.test(String(cfg.merchantId))) {
    return "Invalid PayHere merchant ID. Please set a valid numeric VITE_PAYHERE_MERCHANT_ID.";
  }
  if (!cfg.merchantSecret || String(cfg.merchantSecret).length < 16) {
    return "Missing PayHere merchant secret. Please set VITE_PAYHERE_API_KEY in .env.local.";
  }
  return null;
}

function toUpperMd5(value) {
  return CryptoJS.MD5(String(value)).toString(CryptoJS.enc.Hex).toUpperCase();
}

export function buildPayHereHash({
  merchantId,
  orderId,
  amount,
  currency,
  merchantSecret,
}) {
  const amountFormatted = Number(amount).toFixed(2);
  const secretMd5 = toUpperMd5(merchantSecret);
  return toUpperMd5(
    `${merchantId}${orderId}${amountFormatted}${currency}${secretMd5}`,
  );
}

export function ensurePayHereScript() {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("PayHere is only available in the browser."),
    );
  }
  if (window.payhere) return Promise.resolve(window.payhere);
  if (payhereScriptPromise) return payhereScriptPromise;

  payhereScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = PAYHERE_SCRIPT_URL;
    script.async = true;
    script.onload = () => {
      if (window.payhere) resolve(window.payhere);
      else reject(new Error("PayHere script loaded but SDK was not found."));
    };
    script.onerror = () => reject(new Error("Failed to load PayHere SDK."));
    document.body.appendChild(script);
  });

  return payhereScriptPromise;
}
