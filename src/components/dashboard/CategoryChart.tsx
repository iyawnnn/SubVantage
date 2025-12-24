"use client";

import { DonutChart } from "@mantine/charts";
import { Paper, Text, Title, Center } from "@mantine/core";

interface Subscription {
  cost: number;
  category: string;
}

export function CategoryChart({ data }: { data: Subscription[] }) {
  // Logic: Group total cost by category
  const categoryTotals: Record<string, number> = {};

  data.forEach((sub) => {
    // Handle legacy data that might be null
    const cat = sub.category || "Uncategorized";
    categoryTotals[cat] = (categoryTotals[cat] || 0) + sub.cost;
  });

  const chartData = Object.keys(categoryTotals).map((cat, index) => ({
    name: cat,
    value: categoryTotals[cat],
    color: ['blue.6', 'teal.6', 'violet.6', 'orange.6', 'red.6'][index % 5],
  }));

  if (data.length === 0) return null;

  return (
    <Paper p="xl" withBorder radius="md" h="100%">
      <Title order={4} mb="lg">Spend by Category</Title>
      <Center>
        <DonutChart 
          data={chartData} 
          tooltipDataSource="segment" 
          withLabelsLine 
          withLabels 
          size={160} 
          thickness={20}
        />
      </Center>
    </Paper>
  );
}