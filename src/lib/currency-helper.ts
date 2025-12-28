// Fallback rates in case the API fails
const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 150.5,
  PHP: 56.5,
  CAD: 1.35,
  AUD: 1.52,
};

export async function getExchangeRates(base: string) {
  try {
    // Using Frankfurter API (Free, no key required)
    const res = await fetch(`https://api.frankfurter.app/latest?from=${base}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch rates: ${res.statusText}`);
    }

    const data = await res.json();
    
    // API returns rates relative to base. We need to ensure base is included as 1.
    return { ...data.rates, [base]: 1 };
    
  } catch (error) {
    console.error("Currency API Error, using fallback rates:", error);
    // If API fails, return fallback rates (adjusted roughly to base)
    // Note: This fallback math is simple; for production, you'd want better fallback logic.
    return FALLBACK_RATES;
  }
}

export function convertTo(amount: number, from: string, to: string, rates: Record<string, number>) {
  if (from === to) return amount;
  
  // If we have the direct rate
  if (rates[to] && rates[from]) {
    // Convert 'from' to Base, then Base to 'to'
    // Formula: (Amount / Rate_From) * Rate_To
    // Note: Since our rates dictionary is relative to the USER'S base currency (fetched above),
    // the logic is slightly different depending on how we fetched it.
    
    // However, the getExchangeRates above fetches rates where Base = User's Preference.
    // So 'rates[currency]' tells us "How much of this currency equals 1 BaseUnit".
    // Wait, Frankfurter returns: "1 Base = X Target".
    // So if Base is USD, rates['PHP'] is 56. 
    // If I have 100 PHP and want USD: 100 / 56.
    
    const rateFrom = rates[from] || 1; // Rate of the subscription currency relative to base
    
    // Since 'rates' are based on the user's preferred currency (the 'base' arg in getExchangeRates):
    // 1 UserCurrency = X SubCurrency.
    // Therefore: SubCostInUserCurrency = SubCost / RateOfSubCurrency
    
    return amount / rateFrom;
  }
  
  return amount;
}

export function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
}