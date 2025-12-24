import { BillingFrequency } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

type CostItem = {
  cost: Decimal | number;
  frequency: BillingFrequency;
};

/**
 * Calculates the total monthly burn rate.
 * Formula: Monthly Subs + (Yearly Subs / 12)
 */
export function calculateMonthlyBurnRate(items: CostItem[]): number {
  return items.reduce((total, item) => {
    const amount = Number(item.cost);
    
    // If yearly, divide by 12 to get monthly cost. Otherwise, take full amount.
    if (item.frequency === "YEARLY") {
      return total + (amount / 12);
    }
    
    return total + amount;
  }, 0);
}