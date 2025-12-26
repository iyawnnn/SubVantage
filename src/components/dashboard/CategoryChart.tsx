"use client";

import { DonutChart } from "@mantine/charts";
import { Paper, Text, Center } from "@mantine/core";
import { convertTo, formatCurrency } from "@/lib/currency-helper";

interface CategoryChartProps {
  data: any[];
  baseCurrency: string;
  rates: Record<string, number>;
}

export function CategoryChart({ data, baseCurrency, rates }: CategoryChartProps) {
  const grouped = data.reduce((acc: any, sub) => {
    const rawCost = Number(sub.cost);
    const converted = convertTo(rawCost, sub.currency, baseCurrency, rates);
    const monthly = sub.frequency === "YEARLY" ? converted / 12 : converted;

    acc[sub.category] = (acc[sub.category] || 0) + monthly;
    return acc;
  }, {});

  const chartData = Object.keys(grouped).map((cat, index) => ({
    name: cat,
    value: parseFloat(grouped[cat].toFixed(2)),
    color: `var(--mantine-color-blue-${index + 4})`, 
  }));

  return (
    // FIX: Use style={{ minHeight: 350 }} instead of minH={350}
    <Paper p="md" withBorder radius="md" style={{ minHeight: 350 }}>
      <Text fw={600} mb="md">Spending by Category</Text>
      <Center h={300}>
        <DonutChart
          data={chartData}
          withTooltip
          tooltipDataSource="segment"
          valueFormatter={(val) => formatCurrency(val, baseCurrency)}
        />
      </Center>
    </Paper>
  );
}