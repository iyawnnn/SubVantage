"use client";

import React from "react";
import dayjs from "dayjs";
import { TrendingUp, CreditCard, CalendarClock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, convertTo } from "@/lib/currency-helper";

export function SubscriptionStats({ subs, rates, baseCurrency }: any) {
  const stats = React.useMemo(() => {
    const totalActive = subs.length;
    const today = dayjs();
    const todayStart = today.startOf("day");

    // 1. Calculate Monthly Burn
    // FIX: Exclude Trials from Monthly Burn
    const monthlyTotal = subs.reduce((acc: number, sub: any) => {
      if (sub.isTrial) return acc; // 👈 Skip trials

      const realCost = sub.splitCost > 0 ? sub.splitCost : sub.cost;
      const costInBase = convertTo(realCost, sub.currency, baseCurrency, rates);
      const monthly = sub.frequency === "YEARLY" ? costInBase / 12 : costInBase;
      return acc + monthly;
    }, 0);

    // 2. Map subs to their *real* next renewal date
    const activeSubsWithProjectedDates = subs.map((sub: any) => {
      const startDate = dayjs(sub.startDate);
      const isFuture = startDate.isAfter(todayStart, "day");
      let nextRenewal = dayjs(sub.nextRenewalDate);
      const cycleUnit = sub.frequency === "MONTHLY" ? "month" : "year";

      if (isFuture) {
        // FIX: If future, the next bill is the Start Date
        nextRenewal = startDate;
      } else {
        if (nextRenewal.isBefore(todayStart, "day")) {
          const diff = todayStart.diff(nextRenewal, cycleUnit);
          nextRenewal = nextRenewal.add(diff, cycleUnit);
          if (nextRenewal.isBefore(todayStart, "day")) {
            nextRenewal = nextRenewal.add(1, cycleUnit);
          }
        }
      }

      return {
        ...sub,
        effectiveRenewalDate: nextRenewal,
      };
    });

    // 3. Sort by date
    const nextBill = activeSubsWithProjectedDates
      .filter(
        (s: any) =>
          s.effectiveRenewalDate.diff(todayStart, "day") >= 0 && 
          s.cost > 0 &&
          !s.isTrial // 👈 Optionally exclude trials from "Next Bill" alert? Or keep them.
          // If you want to see Trial Expiry in "Next Bill", remove "!s.isTrial".
      )
      .sort(
        (a: any, b: any) =>
          a.effectiveRenewalDate.valueOf() - b.effectiveRenewalDate.valueOf()
      )[0];

    const nextBillDays = nextBill
      ? nextBill.effectiveRenewalDate.diff(todayStart, "day")
      : null;

    return {
      totalActive,
      monthlyTotal,
      nextBillDays,
      nextBillName: nextBill?.vendor?.name,
    };
  }, [subs, rates, baseCurrency]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* Total Active */}
      <Card className="border-border bg-card shadow-sm">
        <CardContent className="p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-muted-foreground mb-1">
              Total Active
            </p>
            <h3 className="text-2xl font-bold">{stats.totalActive}</h3>
          </div>
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <CreditCard className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* Monthly Cost */}
      <Card className="border-border bg-card shadow-sm">
        <CardContent className="p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-muted-foreground mb-1">
              Monthly Cost
            </p>
            <h3 className="text-2xl font-bold">
              {formatCurrency(stats.monthlyTotal, baseCurrency)}
            </h3>
          </div>
          <div className="p-3 rounded-xl bg-violet-500/10 text-violet-500">
            <TrendingUp className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* Next Renewal */}
      <Card className="border-border bg-card shadow-sm">
        <CardContent className="p-5 flex items-center justify-between">
          <div className="min-w-0 flex-1 mr-2">
            <p className="text-xs font-bold uppercase text-muted-foreground mb-1">
              Next Bill
            </p>
            <h3
              className="text-lg font-bold truncate text-foreground"
              title={stats.nextBillName}
            >
              {stats.nextBillName || "None"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {stats.nextBillDays !== null
                ? stats.nextBillDays === 0
                  ? "Due today"
                  : `in ${stats.nextBillDays} days`
                : "All caught up"}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
            <CalendarClock className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}