"use client";

import {
  Grid,
  Paper,
  Group,
  ThemeIcon,
  Text,
  Stack,
  Title,
  Box,
} from "@mantine/core";
import {
  IconCoin,
  IconCalendarStats,
  IconAlertCircle,
  IconLeaf,
} from "@tabler/icons-react";
import { StaggerContainer, StaggerItem, StatCard } from "./DashboardMotion";
import { SpendingChart } from "./SpendingChart";
import { CategoryChart } from "./CategoryChart";
import { UpcomingBills } from "./UpcomingBills";
import { SubscriptionTable } from "./SubscriptionTable";
import { InsightsCard, ForecastWidget } from "./Insights";
import { formatCurrency } from "@/lib/currency-helper";

// --- Types ---
interface Subscription {
  id: string;
  vendor: { name: string; website: string | null };
  cost: number;
  currency: string;
  frequency: string;
  startDate: Date;
  nextRenewalDate: Date;
  isTrial: boolean;
  category: string;
}

interface DashboardDataProps {
  subs: Subscription[];
  monthlyBurn: number;
  annualProjection: number;
  activeTrials: number;
  totalSaved: number;
  currency: string;
}

// --- 1. Stats Section ---
export function StatsSection({
  monthlyBurn,
  annualProjection,
  activeTrials,
  totalSaved,
  currency,
}: DashboardDataProps) {
  const colSpan = { base: 12, sm: 6, md: 3 };

  return (
    <StaggerContainer>
      <Grid gutter="md" mb="xl">
        <Grid.Col span={colSpan}>
          <StaggerItem>
            <StatCard shadow="xs" p="xl" radius="md" withBorder>
              <Group>
                <ThemeIcon color="blue" variant="light" size={48} radius="md">
                  <IconCoin size="1.5rem" stroke={1.5} />
                </ThemeIcon>
                <div>
                  <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                    Monthly Burn
                  </Text>
                  <Text fw={700} size="xl">
                    {formatCurrency(monthlyBurn, currency || "USD")}
                  </Text>
                </div>
              </Group>
            </StatCard>
          </StaggerItem>
        </Grid.Col>

        <Grid.Col span={colSpan}>
          <StaggerItem>
            <StatCard shadow="xs" p="xl" radius="md" withBorder>
              <Group>
                <ThemeIcon color="violet" variant="light" size={48} radius="md">
                  <IconCalendarStats size="1.5rem" stroke={1.5} />
                </ThemeIcon>
                <div>
                  <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                    Annual Projection
                  </Text>
                  <Text fw={700} size="xl">
                    {formatCurrency(annualProjection, currency || "USD")}
                  </Text>
                </div>
              </Group>
            </StatCard>
          </StaggerItem>
        </Grid.Col>

        <Grid.Col span={colSpan}>
          <StaggerItem>
            <StatCard shadow="xs" p="xl" radius="md" withBorder>
              <Group>
                <ThemeIcon color="orange" variant="light" size={48} radius="md">
                  <IconAlertCircle size="1.5rem" stroke={1.5} />
                </ThemeIcon>
                <div>
                  <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                    Active Trials
                  </Text>
                  <Text fw={700} size="xl">
                    {activeTrials}
                  </Text>
                </div>
              </Group>
            </StatCard>
          </StaggerItem>
        </Grid.Col>

        <Grid.Col span={colSpan}>
          <StaggerItem>
            <StatCard shadow="xs" p="xl" radius="md" withBorder>
              <Group>
                <ThemeIcon color="teal" variant="light" size={48} radius="md">
                  <IconLeaf size="1.5rem" stroke={1.5} />
                </ThemeIcon>
                <div>
                  <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
                    Monthly Savings
                  </Text>
                  <Text fw={700} size="xl" c="teal">
                    {formatCurrency(totalSaved, currency || "USD")}
                  </Text>
                </div>
              </Group>
            </StatCard>
          </StaggerItem>
        </Grid.Col>
      </Grid>
    </StaggerContainer>
  );
}

// --- 2. Insights Section ---
export function InsightsSection({
  redundancy,
  runway,
  currency,
}: {
  redundancy: any[];
  runway: any;
  currency: string;
}) {
  if (redundancy.length === 0 && !runway) return null;

  return (
    <StaggerContainer>
      <Grid gutter="md" mb="xl">
        {redundancy.length > 0 && (
          <Grid.Col span={{ base: 12, md: 6 }}>
            <StaggerItem style={{ height: "100%" }}>
              <InsightsCard redundancies={redundancy} currency={currency} />
            </StaggerItem>
          </Grid.Col>
        )}

        <Grid.Col span={{ base: 12, md: redundancy.length > 0 ? 6 : 12 }}>
          <StaggerItem style={{ height: "100%" }}>
            <ForecastWidget
              d30={runway.d30}
              d60={runway.d60}
              d90={runway.d90}
              currency={currency}
            />
          </StaggerItem>
        </Grid.Col>
      </Grid>
    </StaggerContainer>
  );
}

// --- 3. Charts Section ---
export function ChartsSection({
  subs,
  rates,
  currency,
}: {
  subs: Subscription[];
  rates: any;
  currency: string;
}) {
  return (
    <StaggerContainer>
      <Grid gutter="md" mb="xl">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <StaggerItem>
            {/* 👇 FIX: Enforce minimum height here so Recharts doesn't crash */}
            <Box style={{ minHeight: 400, width: "100%" }}>
              <SpendingChart
                data={subs}
                baseCurrency={currency}
                rates={rates}
              />
            </Box>
          </StaggerItem>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <StaggerItem>
            <Stack>
               {/* 👇 FIX: Enforce height on Category Chart too */}
              <Box style={{ minHeight: 300, width: "100%" }}>
                <CategoryChart
                  data={subs}
                  baseCurrency={currency}
                  rates={rates}
                />
              </Box>
              <UpcomingBills 
                data={subs} 
                rates={rates} 
                currency={currency} 
              />
            </Stack>
          </StaggerItem>
        </Grid.Col>
      </Grid>
    </StaggerContainer>
  );
}

// --- 4. Table Section ---
export function TableSection({ 
  subs, 
  rates, 
  currency 
}: { 
  subs: Subscription[], 
  rates: any, 
  currency: string 
}) {
  return (
    <StaggerContainer>
      <StaggerItem>
        <Paper p="md" withBorder radius="md">
          <Title order={4} mb="md" px="xs">
            Active Subscriptions
          </Title>
          <SubscriptionTable 
            data={subs} 
            rates={rates} 
            baseCurrency={currency} 
          />
        </Paper>
      </StaggerItem>
    </StaggerContainer>
  );
}