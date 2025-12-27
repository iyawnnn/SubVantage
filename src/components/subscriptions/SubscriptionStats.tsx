"use client";

import React from "react";
import dayjs from "dayjs";
import { TrendingUp, CreditCard, CalendarClock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, convertTo } from "@/lib/currency-helper";

export function SubscriptionStats({ subs, rates, baseCurrency }: any) {
  const stats = React.useMemo(() => {
    const totalActive = subs.length;
    
    // Calculate Monthly Burn
    const monthlyTotal = subs.reduce((acc: number, sub: any) => {
      const realCost = sub.splitCost > 0 ? sub.splitCost : sub.cost;
      const costInBase = convertTo(realCost, sub.currency, baseCurrency, rates);
      const monthly = sub.frequency === "YEARLY" ? costInBase / 12 : costInBase;
      return acc + monthly;
    }, 0);

    // Find Next Renewal
    const sortedByDate = [...subs].sort((a, b) => {
      const dateA = dayjs(a.nextRenewalDate);
      const dateB = dayjs(b.nextRenewalDate);
      return dateA.diff(dayjs()) - dateB.diff(dayjs());
    }).filter(s => dayjs(s.nextRenewalDate).isAfter(dayjs()));

    const nextBill = sortedByDate[0];
    const nextBillDays = nextBill ? dayjs(nextBill.nextRenewalDate).diff(dayjs(), 'day') : null;

    return { totalActive, monthlyTotal, nextBillDays, nextBillName: nextBill?.vendor?.name };
  }, [subs, rates, baseCurrency]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* Total Active */}
      <Card className="border-border bg-card shadow-sm">
        <CardContent className="p-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Total Active</p>
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
            <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Monthly Cost</p>
            <h3 className="text-2xl font-bold">{formatCurrency(stats.monthlyTotal, baseCurrency)}</h3>
          </div>
          <div className="p-3 rounded-xl bg-violet-500/10 text-violet-500">
            <TrendingUp className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>

      {/* Next Renewal */}
      <Card className="border-border bg-card shadow-sm">
        <CardContent className="p-5 flex items-center justify-between">
          {/* 👇 FIX: Added 'min-w-0' and 'flex-1' to parent div */}
          <div className="min-w-0 flex-1 mr-2">
            <p className="text-xs font-bold uppercase text-muted-foreground mb-1">Next Bill</p>
            {/* 👇 FIX: Removed 'max-w-[120px]'. Now it fills available space naturally. */}
            <h3 className="text-lg font-bold truncate text-foreground" title={stats.nextBillName}>
              {stats.nextBillName || "None"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {stats.nextBillDays !== null ? `in ${stats.nextBillDays} days` : "All caught up"}
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