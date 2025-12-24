"use client";

import { Paper, Text, Title, Group, Stack, ThemeIcon, rem } from "@mantine/core";
import { IconCalendarEvent } from "@tabler/icons-react";
import dayjs from "dayjs";

interface Subscription {
  id: string;
  vendor: { name: string };
  cost: number;
  nextRenewalDate: Date;
}

export function UpcomingBills({ data }: { data: Subscription[] }) {
  // Sort by date (closest first) and take top 3
  const upcoming = [...data]
    .sort((a, b) => new Date(a.nextRenewalDate).getTime() - new Date(b.nextRenewalDate).getTime())
    .slice(0, 3);

  return (
    <Paper p="md" withBorder radius="md">
      <Title order={4} mb="md">Next Up</Title>
      <Stack gap="sm">
        {upcoming.map((sub) => (
          <Group key={sub.id} justify="space-between" wrap="nowrap">
            <Group gap="xs">
              <ThemeIcon color="gray" variant="light" size="md">
                <IconCalendarEvent style={{ width: rem(14), height: rem(14) }} />
              </ThemeIcon>
              <div>
                <Text size="sm" fw={500} lineClamp={1}>{sub.vendor.name}</Text>
                <Text size="xs" c="dimmed">
                  {dayjs(sub.nextRenewalDate).format("MMM D")}
                </Text>
              </div>
            </Group>
            <Text fw={600} size="sm">${sub.cost.toFixed(2)}</Text>
          </Group>
        ))}
        {upcoming.length === 0 && <Text c="dimmed" size="sm">No upcoming bills.</Text>}
      </Stack>
    </Paper>
  );
}