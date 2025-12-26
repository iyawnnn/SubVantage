import dayjs from "dayjs";
import { convertTo } from "@/lib/currency-helper";

type SubStatus = "ACTIVE" | "PAUSED" | "CANCELLED";

interface Subscription {
  id: string;
  vendor: { name: string };
  cost: number;
  splitCost?: number; // 👈 ADDED THIS
  currency: string;
  category: string;
  status: SubStatus | string;
  frequency: "MONTHLY" | "YEARLY" | string;
  nextRenewalDate: Date;
}

const SAFE_CATEGORIES = [
  "Personal",
  "Work",
  "Uncategorized",
  "General",
  "Utilities",
  "Entertainment",
  "Dev Tools",
  "Health",
  "Education"
];

// Helper to get the actual amount you pay
function getRealCost(sub: Subscription) {
  return (sub.splitCost && sub.splitCost > 0) ? sub.splitCost : sub.cost;
}

/**
 * 1. Redundancy Insights (v2.1 - Collaborative Aware)
 */
export function getRedundancyInsights(subs: Subscription[]) {
  const activeSubs = subs.filter((s) => s.status === "ACTIVE");
  const alerts: any[] = [];
  const processedIDs = new Set<string>(); 

  // --- CHECK 1: EXACT VENDOR DUPLICATES ---
  const vendorGroups: Record<string, Subscription[]> = {};
  activeSubs.forEach((sub) => {
    const name = sub.vendor.name;
    if (!vendorGroups[name]) vendorGroups[name] = [];
    vendorGroups[name].push(sub);
  });

  Object.entries(vendorGroups).forEach(([vendorName, items]) => {
    if (items.length > 1) {
      items.forEach(i => processedIDs.add(i.id));

      alerts.push({
        type: "DUPLICATE_VENDOR",
        category: vendorName, 
        count: items.length,
        vendors: items.map(i => i.vendor.name), 
        // 👈 FIX: Use real cost (your share) for total
        totalCost: items.reduce((sum, i) => sum + getRealCost(i), 0),
        message: `You have ${items.length} subscriptions for ${vendorName}.`
      });
    }
  });

  // --- CHECK 2: CATEGORY OVERLOAD ---
  const categoryGroups: Record<string, Subscription[]> = {};
  activeSubs.forEach((sub) => {
    if (!categoryGroups[sub.category]) categoryGroups[sub.category] = [];
    categoryGroups[sub.category].push(sub);
  });

  Object.entries(categoryGroups).forEach(([category, items]) => {
    if (SAFE_CATEGORIES.includes(category)) return;
    if (items.length <= 1) return;

    const unprocessedItems = items.filter(i => !processedIDs.has(i.id));
    if (unprocessedItems.length < 2) return;

    alerts.push({
      type: "CATEGORY_OVERLOAD",
      category: category,
      count: items.length,
      vendors: items.map(i => i.vendor.name),
      // 👈 FIX: Use real cost for total
      totalCost: items.reduce((sum, i) => sum + getRealCost(i), 0),
      message: `You have ${items.length} subscriptions in ${category}.`
    });
  });

  return alerts;
}

/**
 * 2. Graveyard Stats (Money Saved)
 * Calculates savings based on YOUR share, not full price.
 */
export function getGraveyardStats(
  subs: Subscription[],
  rates: Record<string, number>,
  baseCurrency: string
) {
  const cancelled = subs.filter((s) => s.status === "CANCELLED");

  const totalSavedMonthly = cancelled.reduce((acc, sub) => {
    // 👈 FIX: Calculate savings based on what YOU were paying
    const realCost = getRealCost(sub);
    
    const costInBase = convertTo(realCost, sub.currency, baseCurrency, rates);
    const monthlyCost =
      sub.frequency === "YEARLY" ? costInBase / 12 : costInBase;
    return acc + monthlyCost;
  }, 0);

  return {
    count: cancelled.length,
    totalSavedMonthly,
    cancelledSubs: cancelled,
  };
}

/**
 * 3. Cash Flow Runway (30/60/90 Days)
 * Projects future liabilities using your Split Cost.
 */
export function getCashFlowRunway(
  subs: Subscription[],
  rates: Record<string, number>,
  baseCurrency: string
) {
  const active = subs.filter((s) => s.status === "ACTIVE");
  const now = dayjs();

  let d30 = 0;
  let d60 = 0;
  let d90 = 0;

  active.forEach((sub) => {
    let renewal = dayjs(sub.nextRenewalDate);
    
    // 👈 FIX: Use getRealCost so projections are accurate to your wallet
    const realCost = getRealCost(sub);
    const cost = convertTo(realCost, sub.currency, baseCurrency, rates);

    for (let i = 0; i < 12; i++) {
      const diff = renewal.diff(now, "day");
      if (diff > 90) break;

      if (diff >= 0) {
        if (diff <= 30) d30 += cost;
        if (diff <= 60) d60 += cost;
        if (diff <= 90) d90 += cost;
      }

      if (sub.frequency === "MONTHLY") {
        renewal = renewal.add(1, "month");
      } else if (sub.frequency === "YEARLY") {
        renewal = renewal.add(1, "year");
      } else {
        break;
      }
    }
  });

  return { d30, d60, d90 };
}