"use client";

import React from "react";
import dayjs from "dayjs";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Clock,
  TrendingUp,
  Pencil,
  Archive,
  Info,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, convertTo } from "@/lib/currency-helper";
import { toast } from "sonner";
import { archiveSubscription } from "@/actions/subscription-actions";
import { SubscriptionModal } from "@/components/dashboard/SubscriptionModal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function SubscriptionDetailView({
  sub,
  baseCurrency,
  rates,
}: any) {
  const router = useRouter();
  const [editModalOpen, setEditModalOpen] = React.useState(false);

  // 1. Date Calculations
  const startDate = dayjs(sub.startDate).startOf('day');
  const today = dayjs().startOf('day'); // 👈 FIX: Ignore time components
  const isFuture = startDate.isAfter(today);

  // Calculate Next Renewal
  let nextRenewal = dayjs(sub.nextRenewalDate).startOf('day');
  const cycleUnit = sub.frequency === "MONTHLY" ? "month" : "year";

  if (isFuture) {
    nextRenewal = startDate;
  } else {
    if (nextRenewal.isBefore(today)) {
      const diff = today.diff(nextRenewal, cycleUnit);
      nextRenewal = nextRenewal.add(diff, cycleUnit);

      if (nextRenewal.isBefore(today)) {
        nextRenewal = nextRenewal.add(1, cycleUnit);
      }
    }
  }

  // Cycle Progress
  const currentCycleStart = isFuture 
    ? startDate 
    : nextRenewal.clone().subtract(1, cycleUnit);

  const totalDaysInCycle = nextRenewal.diff(currentCycleStart, "day") || 1; 
  const daysUntilRenewal = nextRenewal.diff(today, "day"); // 👈 Now accurate (e.g. 28 days)

  const daysUsed = isFuture ? 0 : totalDaysInCycle - daysUntilRenewal;
  const progressValue = Math.min(
    100,
    Math.max(0, (daysUsed / totalDaysInCycle) * 100)
  );

  // 2. Cost Calculations
  const yearlyCost = sub.frequency === "MONTHLY" ? sub.cost * 12 : sub.cost;
  
  // 👇 FIX: Lifetime Spend Logic
  // We want to count "How many times has the billing cycle triggered?"
  let paymentsMade = 0;

  if (!isFuture && !sub.isTrial) {
    // If Yearly: Simple year diff + 1 (for the initial payment)
    // If Monthly: Simple month diff + 1
    const diffUnit = sub.frequency === "MONTHLY" ? "month" : "year";
    paymentsMade = today.diff(startDate, diffUnit) + 1;
  }

  // Calculate Spend based on PAYMENTS, not time passed
  const lifetimeSpend = paymentsMade * sub.cost;

  // Conversion Logic
  const isDiffCurrency = sub.currency !== baseCurrency;

  const convertedCost = isDiffCurrency
    ? convertTo(sub.cost, sub.currency, baseCurrency, rates)
    : null;
  const convertedYearly = isDiffCurrency
    ? convertTo(yearlyCost, sub.currency, baseCurrency, rates)
    : null;
  const convertedLifetime = isDiffCurrency
    ? convertTo(lifetimeSpend, sub.currency, baseCurrency, rates)
    : null;

  const handleArchive = async () => {
    toast.promise(archiveSubscription(sub.id), {
      loading: "Archiving...",
      success: () => {
        router.push("/subscriptions");
        return "Subscription archived";
      },
      error: "Failed to archive",
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 🔙 Navigation */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="group pl-0 hover:pl-2 transition-all text-muted-foreground hover:text-foreground cursor-pointer"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Subscriptions
      </Button>

      {/* ✨ Hero Header */}
      <div className="rounded-3xl border border-border/40 bg-secondary/30 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="h-16 w-16 md:h-24 md:w-24 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary">
              <span className="text-2xl md:text-4xl font-bold">
                {sub.vendor.name.charAt(0)}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-2">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight truncate">
                  {sub.vendor.name}
                </h1>
                <Badge
                  variant={sub.isTrial ? "secondary" : "default"}
                  className="px-3 py-1 shrink-0"
                >
                  {sub.isTrial ? "Trial" : "Active"}
                </Badge>
              </div>
              <p className="text-muted-foreground flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                {sub.category}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 mt-4 md:mt-0">
            {/* Cost Display */}
            <div className="flex flex-col items-start md:items-end">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Cost
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl md:text-4xl font-black text-foreground">
                  {formatCurrency(sub.cost, sub.currency)}
                </span>
                <span className="text-muted-foreground font-medium">
                  / {sub.frequency === "MONTHLY" ? "mo" : "yr"}
                </span>
              </div>
              {/* ⬇️ Converted Price (if different) */}
              {convertedCost && (
                <div className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400 mt-1 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full">
                  <Info className="h-3 w-3" />
                  <span>≈ {formatCurrency(convertedCost, baseCurrency)}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-1 mt-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditModalOpen(true)}
                      className="h-9 w-9 text-muted-foreground hover:text-foreground cursor-pointer hover:bg-muted/80"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleArchive}
                      className="h-9 w-9 text-red-500/70 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Archive</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>

      {/* 📊 The Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2 border-border/50 bg-card/50 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase flex items-center gap-2">
              <Clock className="h-4 w-4 text-violet-500" /> Current Cycle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {isFuture 
                    ? `Starts in ${Math.abs(daysUntilRenewal)} days`
                    : `${daysUntilRenewal} days left`
                  }
                </p>
                <p className="text-sm text-muted-foreground">
                  {isFuture ? "Starts on" : "Resets on"} {nextRenewal.format("MMMM D, YYYY")}
                </p>
              </div>
              <Badge variant="outline" className="bg-background">
                {Math.round(progressValue)}% Used
              </Badge>
            </div>
            <Progress
              value={progressValue}
              className="h-3 rounded-full bg-secondary"
            />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>{currentCycleStart.format("MMM D")}</span>
              <span>{nextRenewal.format("MMM D")}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase flex items-center gap-2">
              <Calendar className="h-4 w-4 text-amber-500" /> Yearly Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground mb-1">
              {formatCurrency(yearlyCost, sub.currency)}
            </p>
            {convertedYearly && (
              <p className="text-sm font-medium text-muted-foreground mb-1">
                ≈ {formatCurrency(convertedYearly, baseCurrency)}
              </p>
            )}
            <p className="text-xs text-muted-foreground leading-relaxed mt-2">
              Projected spend for 12 months.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" /> Lifetime Spend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground mb-1">
              {formatCurrency(lifetimeSpend, sub.currency)}
            </p>
            {convertedLifetime && (
              <p className="text-sm font-medium text-muted-foreground mb-1">
                ≈ {formatCurrency(convertedLifetime, baseCurrency)}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Total paid since {startDate.format("MMM YYYY")}.
            </p>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2 border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase">
              <CreditCard className="h-4 w-4 text-primary" /> Subscription
              Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase text-muted-foreground">
                Start Date
              </p>
              <p className="font-medium text-lg">
                {startDate.format("MMMM D, YYYY")}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase text-muted-foreground">
                Billing Frequency
              </p>
              <p className="font-medium text-lg capitalize">
                {sub.frequency.toLowerCase()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase text-muted-foreground">
                Category
              </p>
              <p className="font-medium text-lg">{sub.category}</p>
            </div>
            {sub.splitCost > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase text-muted-foreground text-amber-500">
                  Your Split Share
                </p>
                <p className="font-medium text-lg text-amber-500">
                  {formatCurrency(sub.splitCost, sub.currency)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <SubscriptionModal
        opened={editModalOpen}
        close={() => setEditModalOpen(false)}
        subToEdit={sub}
      />
    </div>
  );
}