import { Decimal } from "@prisma/client/runtime/library";

// Re-export formatting from helper if needed, or define here to satisfy prompt
export function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

type CostItem = {
  cost: Decimal | number;
  currency: string;
  frequency: string; // "MONTHLY" | "YEARLY"
};

/**
 * Calculates total monthly cost, converting all items to the 'baseCurrency'
 */
export function calculateMonthlyBurnRate(
  items: CostItem[],
  rates: Record<string, number>,
  baseCurrency: string
): number {
  const targetRate = rates[baseCurrency] || 1;

  return items.reduce((total, item) => {
    const amount = Number(item.cost);
    const itemRate = rates[item.currency] || 1;

    // 1. Normalize to USD (assuming rates are based on USD)
    const amountInUSD = amount / itemRate;

    // 2. Convert to Target Base Currency
    const amountInBase = amountInUSD * targetRate;

    // 3. Normalize to Monthly frequency
    if (item.frequency === "YEARLY") {
      return total + (amountInBase / 12);
    }

    return total + amountInBase;
  }, 0);
}