"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, TrendingUp, Lightbulb } from "lucide-react";
import { formatCurrency } from "@/lib/currency-helper";
import { cn } from "@/lib/utils";

// --- 1. Redundancy (Insights) Card ---
export function InsightsCard({ 
  redundancies, 
  currency 
}: { 
  redundancies: any[], 
  currency: string 
}) {
  const alert = redundancies[0];
  const isVendorDup = alert.type === "DUPLICATE_VENDOR";

  return (
    <Card className="h-full border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-950/10">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-red-100 p-3 text-red-600 dark:bg-red-900/30 dark:text-red-400">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
              Attention Needed
            </p>
            <h3 className="text-lg font-bold">
              {isVendorDup ? "Duplicate Subscriptions" : "Category Overload"}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {alert.message || `You have multiple subscriptions in ${alert.category}.`}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          {alert.vendors.map((vendor: string, i: number) => (
            <div key={i} className="flex items-center justify-between rounded-md border bg-background px-3 py-2 text-sm font-medium">
               {vendor}
            </div>
          ))}
        </div>

        <div className="mt-6 text-sm font-bold text-red-600 dark:text-red-400">
          Potential Savings: {formatCurrency(alert.totalCost, currency)} / mo
        </div>
      </CardContent>
    </Card>
  );
}

// --- Helper: Simple Circular Progress ---
function CircleProgress({ value, label, colorClass }: { value: number; label: string; colorClass: string }) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs font-bold text-muted-foreground">{label}</span>
      <div className="relative flex items-center justify-center">
        {/* Background Circle */}
        <svg className="h-20 w-20 -rotate-90 transform">
          <circle cx="40" cy="40" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-muted/20" />
          {/* Progress Circle */}
          <circle 
            cx="40" cy="40" r={radius} 
            stroke="currentColor" strokeWidth="6" 
            fill="transparent" 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset} 
            strokeLinecap="round"
            className={cn("transition-all duration-500", colorClass)} 
          />
        </svg>
        <div className="absolute text-muted-foreground/50">
          <TrendingUp size={20} />
        </div>
      </div>
    </div>
  );
}

// --- 2. Forecast (Runway) Widget ---
export function ForecastWidget({ 
  d30, 
  d60, 
  d90, 
  currency 
}: { 
  d30: number, 
  d60: number, 
  d90: number, 
  currency: string 
}) {
  return (
    <Card className="h-full">
      <CardContent className="pt-6">
        <div className="mb-6 flex items-center gap-4">
          <div className="rounded-lg bg-violet-100 p-3 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
            <Lightbulb className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              3-Month Forecast
            </p>
            <h3 className="text-lg font-bold">Cash Flow Runway</h3>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center gap-1">
            <CircleProgress value={33} label="30 Days" colorClass="text-blue-500" />
            <span className="text-sm font-bold">{formatCurrency(d30, currency)}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <CircleProgress value={66} label="60 Days" colorClass="text-violet-500" />
            <span className="text-sm font-bold">{formatCurrency(d60, currency)}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <CircleProgress value={100} label="90 Days" colorClass="text-purple-500" />
            <span className="text-sm font-bold">{formatCurrency(d90, currency)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}