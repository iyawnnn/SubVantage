"use client";

import { BarChart } from "@mantine/charts";
import { Paper, Text } from "@mantine/core";
import { convertTo, formatCurrency } from "@/lib/currency-helper";

interface SpendingChartProps {
  data: any[];
  baseCurrency: string;
  rates: Record<string, number>;
}

export function SpendingChart({ data, baseCurrency, rates }: SpendingChartProps) {
  const chartData = data.map((sub) => {
    const rawCost = Number(sub.cost);
    const convertedCost = convertTo(rawCost, sub.currency, baseCurrency, rates);
    const monthlyCost = sub.frequency === "YEARLY" ? convertedCost / 12 : convertedCost;

    return {
      name: sub.vendor.name,
      cost: monthlyCost,
    };
  });

  return (
    // FIX: Use style={{ minHeight: 350 }} instead of minH={350}
    <Paper p="md" withBorder radius="md" style={{ minHeight: 350 }}>
      <Text fw={600} mb="md">Monthly Spending Breakdown ({baseCurrency})</Text>
      <BarChart
        h={300}
        data={chartData}
        dataKey="name"
        series={[{ name: "cost", color: "blue.6", label: `Cost (${baseCurrency})` }]}
        tickLine="y"
        gridAxis="y"
        withTooltip
        tooltipAnimationDuration={200}
        valueFormatter={(value) => formatCurrency(value, baseCurrency)}
      />
    </Paper>
  );
}