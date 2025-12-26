// Fallback in case the API goes down
const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  PHP: 58.50,
  EUR: 0.93,
  GBP: 0.79,
  AUD: 1.52,
  CAD: 1.36,
  JPY: 155.0,
};

export async function getLiveRates(base = "USD"): Promise<Record<string, number>> {
  try {
    // 1. Fetch from free public API
    // revalidate: 86400 = Cache for 24 Hours (Daily Update)
    const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${base}`, {
      next: { revalidate: 86400 }, 
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch rates: ${res.statusText}`);
    }

    const data = await res.json();

    return data.rates;
  } catch (error) {
    console.warn("⚠️ Currency API failed, using fallback rates.", error);
    return FALLBACK_RATES;
  }
}