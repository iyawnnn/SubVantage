"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, TrendingUp, Zap, Wallet, Info } from "lucide-react";
import { formatCurrency } from "@/lib/currency-helper";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  colorClass: string;
  tooltipText?: string; // 👈 New Prop
}

export function StatCard({ title, value, icon, colorClass, tooltipText }: StatCardProps) {
  return (
    <Card className="border-border bg-card shadow-sm transition-all hover:shadow-md h-full">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {title}
            </p>
            {/* Tooltip Implementation */}
            {tooltipText && (
              <TooltipProvider>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground/50 cursor-help hover:text-primary transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-[200px] text-center">{tooltipText}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <h3 className="text-2xl font-bold text-foreground tracking-tight">{value}</h3>
        </div>
        <div className={`rounded-xl p-3 ${colorClass}`}>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsGrid({
  monthlyBurn,
  annualProjection,
  activeTrials,
  totalSaved,
  currency,
}: any) {
  return (
    <>
      <StatCard 
        title="Monthly Burn" 
        value={formatCurrency(monthlyBurn, currency)} 
        icon={<TrendingDown className="h-5 w-5" />} 
        colorClass="bg-red-500/10 text-red-500 dark:bg-red-500/20"
        tooltipText="Your total recurring costs for this month. Excludes free trials."
      />
      <StatCard 
        title="Annual Forecast" 
        value={formatCurrency(annualProjection, currency)} 
        icon={<TrendingUp className="h-5 w-5" />} 
        colorClass="bg-blue-500/10 text-blue-500 dark:bg-blue-500/20"
        tooltipText="Projected total spend for the next 12 months based on active subscriptions."
      />
      <StatCard 
        title="Active Trials" 
        value={activeTrials.toString()} 
        icon={<Zap className="h-5 w-5" />} 
        colorClass="bg-amber-500/10 text-amber-500 dark:bg-amber-500/20"
        tooltipText="Subscriptions currently in a free trial period. These are $0.00 until they renew."
      />
      <StatCard 
        title="Total Saved" 
        value={formatCurrency(totalSaved, currency)} 
        icon={<Wallet className="h-5 w-5" />} 
        colorClass="bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20"
        tooltipText="The monthly value of all subscriptions you have cancelled."
      />
    </>
  );
}