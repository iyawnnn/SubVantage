import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsGrid } from "@/components/dashboard/DashboardWidgets";
import { UpcomingBills } from "@/components/dashboard/UpcomingBills";
import { SubscriptionCarousel } from "@/components/dashboard/SubscriptionCarousel";
import { InsightsCard } from "@/components/dashboard/Insights";
import { getExchangeRates } from "@/lib/currency-helper"; 
import { processSubscriptionData } from "@/lib/calculations";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
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
    // 👇 FIX 1: Removed 'status: "ACTIVE"' so we fetch the graveyard stats too
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

  // 👇 We pass ALL subs to the calculator so it can calculate the Graveyard/Total Saved
  const {
    monthlyBurn,
    annualProjection,
    activeTrials,
    graveyardStats,
    redundancyInsights,
  } = processSubscriptionData(allSubs, rates, baseCurrency);

  // 👇 FIX 2: We filter the active ones exclusively for the UI charts and carousels
  const activeSubs = allSubs.filter(sub => sub.status === "ACTIVE");

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 animate-in fade-in duration-500 pb-0 overflow-x-hidden">
      {/* Show Onboarding if needed */}
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

      {/* Main Content Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 xl:grid-cols-4 lg:h-[320px]">
        {/* Main Chart */}
        <div className="lg:col-span-2 xl:col-span-3 h-[320px] lg:h-full">
          <Card className="h-full border-border bg-card shadow-sm flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                Spending Velocity
                <TooltipProvider>
                  <Tooltip delayDuration={300}>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground/50 cursor-help hover:text-primary transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Visualizes your projected spending for the next 6
                        months.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0">
              {/* Passed activeSubs here */}
              <SpendingChart
                data={activeSubs}
                rates={rates}
                currency={baseCurrency}
              />
            </CardContent>
          </Card>
        </div>

        {/* Side Widget */}
        <div className="lg:col-span-1 xl:col-span-1 h-auto lg:h-full">
          {/* Passed activeSubs here */}
          <UpcomingBills data={activeSubs} rates={rates} currency={baseCurrency} />
        </div>
      </div>

      <div className="pt-5">
        {/* Passed activeSubs here */}
        <SubscriptionCarousel
          data={activeSubs}
          currency={baseCurrency}
          rates={rates}
        />
      </div>
    </div>
  );
}