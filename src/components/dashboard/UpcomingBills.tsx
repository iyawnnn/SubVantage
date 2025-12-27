"use client";

import React from "react";
import dayjs from "dayjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock } from "lucide-react";
import { formatCurrency, convertTo } from "@/lib/currency-helper";

interface UpcomingBillsProps {
  data: any[];
  rates: any;
  currency: string;
}

export function UpcomingBills({ data, rates, currency }: UpcomingBillsProps) {
  // 1. Sort subscriptions by "days remaining"
  const upcoming = React.useMemo(() => {
    return data
      .map((sub) => {
        const now = dayjs().startOf("day");
        const renewal = dayjs(sub.nextRenewalDate).startOf("day");
        const diff = renewal.diff(now, "day");
        return { ...sub, daysLeft: diff };
      })
      .filter((sub) => sub.daysLeft >= 0 && sub.daysLeft <= 30) // Only next 30 days
      .sort((a, b) => a.daysLeft - b.daysLeft)
      .slice(0, 5); // Take top 5
  }, [data]);

  return (
    <Card className="h-full border-border/50 bg-card/50">
      <CardHeader className="flex flex-row items-center space-y-0 pb-4">
        <div className="mr-4 rounded-lg bg-orange-100 p-2 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
          <CalendarClock className="h-5 w-5" />
        </div>
        <CardTitle className="text-base font-bold">Upcoming Bills</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {upcoming.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming bills for the next 30 days.</p>
        ) : (
          upcoming.map((sub) => {
            const cost = convertTo(sub.cost, sub.currency, currency, rates);
            return (
              <div
                key={sub.id}
                className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-medium text-sm">{sub.vendor.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {sub.daysLeft === 0
                      ? "Due Today"
                      : sub.daysLeft === 1
                      ? "Due Tomorrow"
                      : `Due in ${sub.daysLeft} days`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">{formatCurrency(cost, currency)}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">{sub.frequency}</p>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}