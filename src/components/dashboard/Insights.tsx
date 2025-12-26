"use client";

import { Paper, Text, Group, ThemeIcon, Stack, RingProgress, Center } from "@mantine/core";
import { IconAlertTriangle, IconTrendingUp, IconBulb } from "@tabler/icons-react";
import { formatCurrency } from "@/lib/currency-helper";

// --- 1. Redundancy (Insights) Card ---
export function InsightsCard({ 
  redundancies, 
  currency 
}: { 
  redundancies: any[], 
  currency: string 
}) {
  // Grab the first/most important alert
  const alert = redundancies[0];
  const isVendorDup = alert.type === "DUPLICATE_VENDOR";

  return (
    <Paper 
      shadow="xs" 
      radius="md" 
      p="xl" 
      withBorder 
      style={{ height: "100%", borderColor: "var(--mantine-color-red-3)" }}
    >
      <Group align="flex-start" mb="md">
        <ThemeIcon 
          color="red" 
          variant="light" 
          size={42} 
          radius="md"
        >
          <IconAlertTriangle size="1.4rem" stroke={1.5} />
        </ThemeIcon>
        
        <div style={{ flex: 1 }}>
          <Text c="red.7" tt="uppercase" fw={700} size="xs" mb={4}>
            Attention Needed
          </Text>
          <Text fw={700} size="lg" lh={1.2}>
            {isVendorDup ? "Duplicate Subscriptions" : "Category Overload"}
          </Text>
        </div>
      </Group>

      <Text size="sm" c="dimmed" mb="lg">
        {alert.message || `You have multiple subscriptions in ${alert.category}.`}
      </Text>

      {/* List of Offenders */}
      <Stack gap="sm">
        {alert.vendors.map((vendor: string, i: number) => (
          <Group key={i} justify="space-between" p="xs" bg="gray.0" style={{ borderRadius: 6 }}>
             <Text size="sm" fw={500}>{vendor}</Text>
          </Group>
        ))}
      </Stack>

      <Group mt="xl">
         <Text size="sm" fw={700}>
            {/* 👇 FIXED: Uses dynamic currency prop instead of hardcoded PHP */}
            Potential Savings: {formatCurrency(alert.totalCost, currency)} / mo
         </Text>
      </Group>
    </Paper>
  );
}

// --- 2. Forecast (Runway) Widget ---
export function ForecastWidget({ 
  d30, 
  d60, 
  d90, 
  currency 
}: { 
  d30: number, 
  d60: number, 
  d90: number, 
  currency: string 
}) {
  return (
    <Paper shadow="xs" radius="md" p="xl" withBorder style={{ height: "100%" }}>
      <Group mb="md">
        <ThemeIcon color="grape" variant="light" size={42} radius="md">
          <IconBulb size="1.4rem" stroke={1.5} />
        </ThemeIcon>
        <div>
          <Text c="dimmed" tt="uppercase" fw={700} size="xs">
            3-Month Forecast
          </Text>
          <Text fw={700} size="lg">
            Cash Flow Runway
          </Text>
        </div>
      </Group>

      <Group grow align="flex-end" gap="xs">
        {/* 30 Days */}
        <Stack gap={4} align="center">
            <Text size="xs" c="dimmed" fw={700}>30 Days</Text>
            <RingProgress
              size={80}
              thickness={8}
              roundCaps
              sections={[{ value: 33, color: 'blue' }]}
              label={
                <Center>
                  <IconTrendingUp size={20} style={{ opacity: 0.5 }} />
                </Center>
              }
            />
            <Text size="sm" fw={700}>{formatCurrency(d30, currency)}</Text>
        </Stack>

        {/* 60 Days */}
        <Stack gap={4} align="center">
            <Text size="xs" c="dimmed" fw={700}>60 Days</Text>
            <RingProgress
              size={80}
              thickness={8}
              roundCaps
              sections={[{ value: 66, color: 'violet' }]}
              label={
                <Center>
                  <IconTrendingUp size={20} style={{ opacity: 0.5 }} />
                </Center>
              }
            />
            <Text size="sm" fw={700}>{formatCurrency(d60, currency)}</Text>
        </Stack>

        {/* 90 Days */}
        <Stack gap={4} align="center">
            <Text size="xs" c="dimmed" fw={700}>90 Days</Text>
            <RingProgress
              size={80}
              thickness={8}
              roundCaps
              sections={[{ value: 100, color: 'grape' }]}
              label={
                <Center>
                  <IconTrendingUp size={20} style={{ opacity: 0.5 }} />
                </Center>
              }
            />
            <Text size="sm" fw={700}>{formatCurrency(d90, currency)}</Text>
        </Stack>
      </Group>
    </Paper>
  );
}