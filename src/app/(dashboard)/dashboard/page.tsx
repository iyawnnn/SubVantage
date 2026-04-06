import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsGrid } from "@/components/dashboard/DashboardWidgets";
import { UpcomingBills } from "@/components/dashboard/UpcomingBills";
import { DashboardClient } from "@/components/dashboard/DashboardClient"; 
import { InsightsCard } from "@/components/dashboard/Insights";
import { getExchangeRates } from "@/lib/currency-helper"; 
import { processSubscriptionData } from "@/lib/calculations";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { OnboardingFlow } from "@/components/dashboard/OnboardingFlow";

export const metadata = {
  title: "Dashboard",
  description: "Your financial pulse at a glance.",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const [user, rawSubs] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
    }),
    prisma.subscription.findMany({
      where: { userId: session.user.id },
      include: { vendor: true },
      orderBy: { cost: "desc" },
    }),
  ]);

  const baseCurrency = user?.preferredCurrency || "USD";
  const rates = await getExchangeRates(baseCurrency);

  const allSubs = rawSubs.map((sub) => ({
    ...sub,
    cost: Number(sub.cost),
    splitCost: sub.splitCost ? Number(sub.splitCost) : 0,
  }));

  const {
    monthlyBurn,
    annualProjection,
    activeTrials,
    graveyardStats,
    redundancyInsights,
  } = processSubscriptionData(allSubs, rates, baseCurrency);

  const activeSubs = allSubs.filter(sub => sub.status === "ACTIVE");

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 animate-in fade-in duration-500 pb-0 overflow-x-hidden">
      {user && !user.hasCompletedOnboarding && <OnboardingFlow isOpen={true} />}

      <DashboardHeader user={user} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsGrid
          monthlyBurn={monthlyBurn}
          annualProjection={annualProjection}
          activeTrials={activeTrials}
          totalSaved={graveyardStats.totalSavedMonthly}
          currency={baseCurrency}
        />
      </div>

      {redundancyInsights.length > 0 && (
        <div className="w-full animate-in slide-in-from-top-2">
          <InsightsCard
            redundancies={redundancyInsights}
            currency={baseCurrency}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 xl:grid-cols-4">
        <div className="lg:col-span-2 xl:col-span-3">
          <SpendingChart
            data={activeSubs}
            rates={rates}
            currency={baseCurrency}
          />
        </div>

        <div className="lg:col-span-1 xl:col-span-1">
          <UpcomingBills data={activeSubs} rates={rates} currency={baseCurrency} />
        </div>
      </div>

      <DashboardClient 
        initialSubs={activeSubs}
        baseCurrency={baseCurrency}
        rates={rates}
      />
      
    </div>
  );
}