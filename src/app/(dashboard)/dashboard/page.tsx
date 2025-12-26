import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { StatsSection, ChartsSection, TableSection, InsightsSection } from "@/components/dashboard/DashboardWidgets";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"; // 👈 IMPORT THIS
import { convertTo } from "@/lib/currency-helper";
import { getLiveRates } from "@/lib/exchange-rates";
import { getRedundancyInsights, getGraveyardStats, getCashFlowRunway } from "@/lib/intelligence";
import dayjs from "dayjs";

async function getData() {
  const session = await auth();
  if (!session?.user?.id) return { subs: [], user: null, rates: {} };

  const [user, rates] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        subscriptions: {
          where: { status: { not: "CANCELLED" } },
          include: { vendor: true },
          orderBy: { cost: "desc" },
        },
      },
    }),
    getLiveRates("USD"),
  ]);

  const subs = user?.subscriptions.map((sub) => {
    return {
      id: sub.id,
      vendor: {
        name: sub.vendor.name,
        website: sub.vendor.website,
      },
      cost: Number(sub.cost), 
      splitCost: sub.splitCost ? Number(sub.splitCost) : 0, 
      currency: sub.currency,
      frequency: sub.frequency,
      startDate: sub.startDate,
      nextRenewalDate: sub.nextRenewalDate,
      isTrial: sub.isTrial,
      category: sub.category,
      status: sub.status,
      userId: sub.userId,
    };
  }) || [];

  return { subs, user, rates };
}

export default async function DashboardPage() {
  const { subs, user, rates } = await getData();
  const baseCurrency = user?.preferredCurrency || "USD";
  
  // Logic Engine
  const monthlyBurn = subs
    .filter((s) => s.status === "ACTIVE")
    .reduce((acc, sub) => {
      const finalCost = sub.splitCost > 0 ? sub.splitCost : sub.cost;
      const costInBase = convertTo(finalCost, sub.currency, baseCurrency, rates);
      return acc + (sub.frequency === "YEARLY" ? costInBase / 12 : costInBase);
    }, 0);

  const annualProjection = monthlyBurn * 12;
  const activeTrials = subs.filter(
    (s) => s.isTrial && dayjs(s.nextRenewalDate).diff(dayjs(), "day") >= 0
  ).length;

  const redundancyInsights = getRedundancyInsights(subs);
  const graveyardStats = getGraveyardStats(subs, rates, baseCurrency);
  const runwayStats = getCashFlowRunway(subs, rates, baseCurrency);

  const statsProps = {
    monthlyBurn,
    annualProjection,
    activeTrials,
    totalSaved: graveyardStats.totalSavedMonthly,
    currency: baseCurrency,
    subs: [],
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", paddingBottom: 40 }}>
      
      {/* 👇 REPLACED: The interactive Header is back */}
      <DashboardHeader />

      <StatsSection {...statsProps} subs={subs} />

      <InsightsSection 
        redundancy={redundancyInsights} 
        runway={runwayStats} 
        currency={baseCurrency} 
      />

      <div style={{ marginTop: 40, minHeight: 400 }}>
         <ChartsSection subs={subs} rates={rates} currency={baseCurrency} />
      </div>

      <div style={{ marginTop: 40 }}>
        <TableSection subs={subs} rates={rates} currency={baseCurrency} />
      </div>
    </div>
  );
}