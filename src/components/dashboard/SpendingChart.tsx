"use client";

import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart";
import dayjs from "dayjs";
import { BarChart3 } from "lucide-react";
import { formatCurrency, convertTo } from "@/lib/currency-helper"; // 👈 Added convertTo

const PREDEFINED_COLORS = [
  "hsl(263.4, 70%, 50.4%)", // Vivid Purple
  "hsl(217.2, 91.2%, 59.8%)", // Blue
  "hsl(190, 90%, 50%)",      // Cyan
  "hsl(280, 85%, 60%)",      // Violet
  "hsl(330, 80%, 60%)",      // Pink
];

// 👇 Updated Tooltip to accept 'currency' prop
const CustomTooltip = ({ active, payload, currency }: any) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);
    return (
      <div className="rounded-lg border border-border bg-popover/95 backdrop-blur p-3 shadow-xl min-w-[180px]">
        <p className="mb-2 text-sm font-bold text-popover-foreground">
          {payload[0].payload.fullDate}
        </p>
        <div className="space-y-1 mb-3">
          {payload.map((entry: any, index: number) => (
            // Only show categories with value > 0 for this month
            entry.value > 0 && (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full shadow-[0_0_8px_currentColor]" style={{ color: entry.color, backgroundColor: entry.color }} />
                  <span className="text-xs font-medium text-muted-foreground">
                    {entry.name}
                  </span>
                </div>
                <span className="text-xs font-mono font-medium text-popover-foreground">
                  {/* 👇 FIX: Use dynamic currency */}
                  {formatCurrency(entry.value, currency)}
                </span>
              </div>
            )
          ))}
        </div>
        <div className="pt-2 border-t border-border flex items-center justify-between">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total</span>
          <span className="text-sm font-bold text-primary">
            {/* 👇 FIX: Use dynamic currency */}
            {formatCurrency(total, currency)}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

// 👇 Updated Props Interface
interface ChartProps {
  data: any[];
  rates: Record<string, number>;
  currency: string;
}

export function SpendingChart({ data, rates, currency }: ChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[250px] flex-col items-center justify-center gap-2 text-muted-foreground">
        <div className="rounded-full bg-muted p-3">
          <BarChart3 className="h-6 w-6 opacity-50" />
        </div>
        <p className="text-sm font-medium">No active subscriptions to forecast</p>
      </div>
    );
  }

  const categories = Array.from(new Set(data.map((sub) => sub.category)));

  const chartConfig = categories.reduce((config, category, index) => {
    config[category] = {
      label: category,
      color: PREDEFINED_COLORS[index % PREDEFINED_COLORS.length],
    };
    return config;
  }, {} as ChartConfig);

  const currentMonth = dayjs();
  
  // Prepare Monthly Data
  const chartData = Array.from({ length: 6 }).map((_, i) => {
    const monthDate = currentMonth.add(i, "month");
    const monthName = monthDate.format("MMM");
    const fullDate = monthDate.format("MMMM YYYY");

    const dataPoint: any = {
      month: monthName,
      fullDate: fullDate,
    };

    categories.forEach(cat => dataPoint[cat] = 0);

    data.forEach((sub) => {
      let applies = false;
      if (sub.frequency === "MONTHLY") {
        applies = true;
      } else if (sub.frequency === "YEARLY") {
        const renewalMonth = dayjs(sub.nextRenewalDate).month();
        if (renewalMonth === monthDate.month()) applies = true;
      }

      if (applies) {
         // 👇 FIX: Convert cost to User's Currency
         const rawCost = Number(sub.splitCost) > 0 ? Number(sub.splitCost) : Number(sub.cost);
         const convertedCost = convertTo(rawCost, sub.currency, currency, rates);
         
         dataPoint[sub.category] += convertedCost;
      }
    });

    return dataPoint;
  });

  return (
    <div className="h-[250px] w-full min-h-[250px] max-h-[250px]">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ left: 0, right: 0, top: 20, bottom: 0 }} barSize={32}>
            
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
            
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              interval={0} 
              padding={{ left: 20, right: 20 }}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} 
            />

            <YAxis 
              width={0} 
              tick={false} 
              axisLine={false}
            />

            <Tooltip 
              content={<CustomTooltip currency={currency} />} // 👇 Pass currency prop
              cursor={{ fill: "var(--muted)", opacity: 0.2 }} 
            />
            
            {/* Stacked Bars */}
            {categories.map((category, index) => {
              const isLast = index === categories.length - 1;
              const radius: [number, number, number, number] = isLast ? [4, 4, 0, 0] : [0, 0, 0, 0];

              return (
                <Bar
                  key={category}
                  dataKey={category}
                  stackId="a"
                  fill={chartConfig[category].color}
                  radius={radius}
                />
              );
            })}
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}