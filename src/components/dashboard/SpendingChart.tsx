"use client";

import { BarChart } from "@mantine/charts";
import { Paper, Text, Title } from "@mantine/core";

interface Subscription {
  cost: number;
  frequency: string;
  nextRenewalDate: Date;
}

export function SpendingChart({ data }: { data: Subscription[] }) {
  // Logic: Project costs for the next 6 months
  const chartData = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() + i);
    const monthName = date.toLocaleString('default', { month: 'short' });
    
    // Sum costs for this specific month
    const monthlyTotal = data.reduce((acc, sub) => {
      // Monthly subs always count
      if (sub.frequency === "MONTHLY") return acc + sub.cost;
      
      // Yearly subs only count if their renewal month matches the chart month
      const renewalMonth = new Date(sub.nextRenewalDate).getMonth();
      if (sub.frequency === "YEARLY" && renewalMonth === date.getMonth()) {
        return acc + sub.cost;
      }
      
      return acc;
    }, 0);

    return { month: monthName, cost: monthlyTotal };
  });

  return (
    <Paper p="xl" withBorder radius="md">
      <Title order={4} mb="lg">6-Month Spending Forecast</Title>
      <BarChart
        h={300}
        data={chartData}
        dataKey="month"
        series={[{ name: 'cost', color: 'blue.6' }]}
        tickLine="y"
        gridAxis="y"
        tooltipAnimationDuration={200}
        valueFormatter={(value) => `$${value}`}
      />
    </Paper>
  );
}