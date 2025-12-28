import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsGrid } from "@/components/dashboard/DashboardWidgets";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { UpcomingBills } from "@/components/dashboard/UpcomingBills";
import { SubscriptionCarousel } from "@/components/dashboard/SubscriptionCarousel";
import { InsightsCard } from "@/components/dashboard/Insights";
import { getLiveRates } from "@/lib/exchange-rates";
import { processSubscriptionData } from "@/lib/calculations";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

// 👇 ADDED: Page Metadata
export const metadata = {
  title: "Dashboard | SubTrack",
  description: "Your financial pulse at a glance.",
};

async function getData() {
  const session = await auth();
  if (!session?.user?.id) return { subs: [], user: null, rates: {} };

  // Fetch fresh user data (ensures currency setting is up-to-date)
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  const rawSubs = await prisma.subscription.findMany({
    where: { userId: session.user.id, status: "ACTIVE" },
    include: { vendor: true },
    orderBy: { cost: "desc" },
  });

  const subs = rawSubs.map(sub => ({
    ...sub,
    cost: Number(sub.cost),
    splitCost: sub.splitCost ? Number(sub.splitCost) : 0,
  }));

  const rates = await getLiveRates(user?.preferredCurrency || "USD");
  return { subs, user, rates };
}

export default async function DashboardPage() {
  const { subs, user, rates } = await getData();
  const baseCurrency = user?.preferredCurrency || "USD";
  
  const { 
    monthlyBurn, 
    annualProjection, 
    activeTrials, 
    graveyardStats, 
    redundancyInsights, 
  } = processSubscriptionData(subs, rates, baseCurrency);

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 animate-in fade-in duration-500 pb-0 overflow-x-hidden">
      
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
            <InsightsCard redundancies={redundancyInsights} currency={baseCurrency} />
         </div>
      )}

      {/* Fixed height row for Chart & Upcoming Bills */}
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
                        <p>Visualizes your projected spending for the next 6 months.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 min-h-0">
                 <SpendingChart data={subs} rates={rates} currency={baseCurrency} />
              </CardContent>
           </Card>
        </div>

        {/* Side Widget */}
        <div className="lg:col-span-1 xl:col-span-1 h-auto lg:h-full">
           <UpcomingBills data={subs} rates={rates} currency={baseCurrency} />
        </div>
      </div>

      <div className="pt-5">
         <SubscriptionCarousel data={subs} currency={baseCurrency} rates={rates} />
      </div>

    </div>
  );
}