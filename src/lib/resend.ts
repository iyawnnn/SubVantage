import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

if (!apiKey) {
  console.warn(
    "⚠️ RESEND_API_KEY is missing from .env. Email features will not work."
  );
}

export const resend = new Resend(apiKey || "re_123456789"); // Fallback prevents crash on build