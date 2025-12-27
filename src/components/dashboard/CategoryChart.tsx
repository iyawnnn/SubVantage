"use client";

import * as React from "react";
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { convertTo, formatCurrency } from "@/lib/currency-helper";

interface CategoryChartProps {
  subs: any[];
  rates: any;
  currency: string;
}

export function CategoryChart({ subs, rates, currency }: CategoryChartProps) {
  // Aggregate costs by category
  const categoryData = React.useMemo(() => {
    const data: Record<string, number> = {};
    subs.forEach((sub) => {
      const costInBase = convertTo(sub.cost, sub.currency, currency, rates);
      const monthlyCost = sub.frequency === "YEARLY" ? costInBase / 12 : costInBase;
      data[sub.category] = (data[sub.category] || 0) + monthlyCost;
    });

    return Object.entries(data).map(([name, value], index) => ({
      name,
      value,
      fill: `var(--color-cat-${index + 1})`,
    }));
  }, [subs, rates, currency]);

  // Dynamic config for colors
  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      value: { label: "Monthly Cost" },
    };
    categoryData.forEach((item, index) => {
      config[`cat-${index + 1}`] = {
        label: item.name,
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
      };
    });
    return config;
  }, [categoryData]);

  return (
    <Card className="flex flex-col border-border/50 bg-card/50">
      <CardHeader className="items-center pb-0">
        <CardTitle>Spending by Category</CardTitle>
        <CardDescription>Monthly breakdown in {currency}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}