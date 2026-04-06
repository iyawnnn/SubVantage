"use client";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import dayjs from "dayjs";
import { BarChart3, Info } from "lucide-react";
import { formatCurrency, convertTo } from "@/lib/currency-helper";
import { cn } from "@/lib/utils";

const PREDEFINED_COLORS = [
  "hsl(263.4, 70%, 50.4%)", 
  "hsl(217.2, 91.2%, 59.8%)", 
  "hsl(190, 90%, 50%)",      
  "hsl(280, 85%, 60%)",      
  "hsl(330, 80%, 60%)",      
];

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
            entry.value > 0 && (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full shadow-[0_0_8px_currentColor]" style={{ color: entry.color, backgroundColor: entry.color }} />
                  <span className="text-xs font-medium text-muted-foreground">
                    {entry.name}
                  </span>
                </div>
                <span className="text-xs font-mono font-medium text-popover-foreground">
                  {formatCurrency(entry.value, currency)}
                </span>
              </div>
            )
          ))}
        </div>
        <div className="pt-2 border-t border-border flex items-center justify-between">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total</span>
          <span className="text-sm font-bold text-primary">
            {formatCurrency(total, currency)}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

interface ChartProps {
  data: any[];
  rates: Record<string, number>;
  currency: string;
}

export function SpendingChart({ data, rates, currency }: ChartProps) {
  const [mounted, setMounted] = useState(false);
  const [monthsCount, setMonthsCount] = useState("6");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Card className="border-border bg-card shadow-sm flex flex-col h-full min-h-[350px]">
        <div className="flex flex-1 items-center justify-center rounded-xl bg-muted/20 animate-pulse m-4">
          <span className="text-sm font-medium text-muted-foreground">Loading chart...</span>
        </div>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="border-border bg-card shadow-sm flex flex-col h-full min-h-[350px]">
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-muted-foreground">
          <div className="rounded-full bg-muted p-3">
            <BarChart3 className="h-6 w-6 opacity-50" />
          </div>
          <p className="text-sm font-medium">No active subscriptions to forecast</p>
        </div>
      </Card>
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
  
  const chartData = Array.from({ length: parseInt(monthsCount) }).map((_, i) => {
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
         const rawCost = Number(sub.splitCost) > 0 ? Number(sub.splitCost) : Number(sub.cost);
         const convertedCost = convertTo(rawCost, sub.currency, currency, rates);
         
         dataPoint[sub.category] += convertedCost;
      }
    });

    return dataPoint;
  });

  return (
    <Card className="border-border bg-card shadow-sm flex flex-col h-full overflow-hidden">
      <CardHeader className="pb-4 pt-6 px-6 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          Spending Velocity
          <TooltipProvider>
            <UITooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground/50 cursor-help hover:text-primary transition-colors" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Visualizes your projected spending for the next {monthsCount} months.</p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </CardTitle>
        <Select value={monthsCount} onValueChange={setMonthsCount}>
          <SelectTrigger className="w-[120px] h-9 text-xs font-medium bg-secondary/50 border-border/50">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6">6 Months</SelectItem>
            <SelectItem value="12">12 Months</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full">
        <div className={cn(
          "h-[280px] w-full px-6 pt-2 pb-4", 
          monthsCount === "12" ? "min-w-[1000px] xl:min-w-full" : "min-w-[600px] xl:min-w-full"
        )}>
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={12}
                  interval={0} 
                  padding={{ left: 10, right: 10 }}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} 
                />
                <YAxis width={0} tick={false} axisLine={false} />
                <Tooltip 
                  content={<CustomTooltip currency={currency} />}
                  cursor={{ fill: "var(--muted)", opacity: 0.2 }} 
                />
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
                      maxBarSize={48} 
                    />
                  );
                })}
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}