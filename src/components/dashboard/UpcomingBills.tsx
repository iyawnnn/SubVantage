"use client";

import { Paper, Text, Group, Stack, ThemeIcon } from "@mantine/core";
import { IconCalendarClock } from "@tabler/icons-react";
import dayjs from "dayjs";
// 👇 1. Import helper functions
import { formatCurrency, convertTo } from "@/lib/currency-helper"; 

// 👇 2. Update props to accept rates/currency (just like the charts)
export function UpcomingBills({ 
  data,
  rates, 
  currency 
}: { 
  data: any[], 
  rates: Record<string, number>, 
  currency: string 
}) {
  // Filter: Active subs renewing in next 7 days
  const upcoming = data
    .filter((sub) => {
      const days = dayjs(sub.nextRenewalDate).diff(dayjs(), "day");
      return days >= 0 && days <= 7;
    })
    .sort((a, b) => new Date(a.nextRenewalDate).getTime() - new Date(b.nextRenewalDate).getTime())
    .slice(0, 3);

  return (
    <Paper p="md" withBorder radius="md">
      <Group mb="md">
        <ThemeIcon variant="light" color="violet" radius="md">
          <IconCalendarClock size="1.1rem" />
        </ThemeIcon>
        <Text fw={600}>Next Up (7 Days)</Text>
      </Group>

      {upcoming.length === 0 ? (
        <Text c="dimmed" size="sm">No upcoming payments.</Text>
      ) : (
        <Stack gap="sm">
          {upcoming.map((sub) => {
            // 👇 3. Calculate the REAL cost in your preferred currency
            const realCost = convertTo(sub.cost, sub.currency, currency, rates);

            return (
              <Group key={sub.id} justify="space-between">
                <div>
                  <Text size="sm" fw={500}>{sub.vendor.name}</Text>
                  <Text size="xs" c="dimmed">
                    {dayjs(sub.nextRenewalDate).format("MMM D")}
                  </Text>
                </div>
                {/* 👇 4. Display the converted amount */}
                <Text size="sm" fw={600}>
                  {formatCurrency(realCost, currency)}
                </Text>
              </Group>
            );
          })}
        </Stack>
      )}
    </Paper>
  );
}