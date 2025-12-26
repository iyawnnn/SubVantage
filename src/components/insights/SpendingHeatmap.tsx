"use client";

import { Paper, Title, Text, Tooltip, SimpleGrid, Box, Group } from "@mantine/core";
import dayjs from "dayjs";
import { formatCurrency } from "@/lib/currency-helper";

// Generates a GitHub-style contribution graph for finances
export function SpendingHeatmap({ 
  data, 
  currency 
}: { 
  data: { date: string; amount: number }[], 
  currency: string 
}) {
  // Create a map for quick lookup: "2024-01-01" -> 150.00
  const spendMap = new Map(data.map(d => [d.date, d.amount]));

  // Generate last 365 days
  const today = dayjs();
  const days = Array.from({ length: 365 }, (_, i) => {
    const date = today.subtract(364 - i, "day");
    return {
      date: date.format("YYYY-MM-DD"),
      month: date.format("MMM"),
      amount: spendMap.get(date.format("YYYY-MM-DD")) || 0,
    };
  });

  // Helper for color intensity
  const getColor = (amount: number) => {
    if (amount === 0) return "var(--mantine-color-dark-6)";
    if (amount < 20) return "var(--mantine-color-blue-9)";
    if (amount < 50) return "var(--mantine-color-blue-7)";
    if (amount < 100) return "var(--mantine-color-blue-5)";
    return "var(--mantine-color-blue-3)"; // High spend
  };

  return (
    <Paper p="xl" withBorder radius="md">
      <Group justify="space-between" mb="lg">
        <Title order={4}>Spending Intensity (Last 12 Months)</Title>
        <Group gap={4}>
           <Text size="xs" c="dimmed">Less</Text>
           <Box w={10} h={10} bg="dark.6" style={{ borderRadius: 2 }} />
           <Box w={10} h={10} bg="blue.9" style={{ borderRadius: 2 }} />
           <Box w={10} h={10} bg="blue.5" style={{ borderRadius: 2 }} />
           <Box w={10} h={10} bg="blue.3" style={{ borderRadius: 2 }} />
           <Text size="xs" c="dimmed">More</Text>
        </Group>
      </Group>
      
      {/* The Heatmap Grid */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {days.map((day) => (
          <Tooltip 
            key={day.date} 
            label={`${day.date}: ${formatCurrency(day.amount, currency)}`}
            transitionProps={{ duration: 0 }}
          >
            <Box 
              w={12} 
              h={12} 
              style={{ 
                backgroundColor: getColor(day.amount), 
                borderRadius: 2,
                cursor: 'pointer'
              }} 
            />
          </Tooltip>
        ))}
      </div>
    </Paper>
  );
}