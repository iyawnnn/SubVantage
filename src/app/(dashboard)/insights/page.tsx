import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Container, Title, SimpleGrid, Paper, Text, Group, ThemeIcon, Alert } from "@mantine/core";
import { IconTrendingUp, IconTrendingDown, IconBulb, IconAlertTriangle } from "@tabler/icons-react";
import { getRedundancyInsights } from "@/lib/intelligence"; // Reusing your engine
import { convertTo, formatCurrency } from "@/lib/currency-helper";
import { getLiveRates } from "@/lib/exchange-rates";
import { SpendingHeatmap } from "@/components/insights/SpendingHeatmap";
import dayjs from "dayjs";

export default async function InsightsPage() {
  const session = await auth();
  const rates = await getLiveRates("USD");
  
  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    include: { subscriptions: { include: { vendor: true } } }
  });

  if (!user) return null;
  const currency = user.preferredCurrency;
  const subs = user.subscriptions.map(s => ({ ...s, cost: Number(s.cost) }));

  // 1. Calculate Monthly Variance
  const thisMonthTotal = subs
    .filter(s => s.status === "ACTIVE")
    .reduce((acc, s) => acc + convertTo(s.cost, s.currency, currency, rates), 0);
  
  // Mocking "Last Month" for variance demo (In real app, you'd fetch historical snapshots)
  const lastMonthTotal = thisMonthTotal * 0.88; // Assume spending increased 12%
  const variance = ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;

  // 2. Prepare Heatmap Data (Next Renewal Dates mapped to Cost)
  const heatmapData = subs
    .filter(s => s.status === "ACTIVE")
    .map(s => ({
      date: dayjs(s.nextRenewalDate).format("YYYY-MM-DD"),
      amount: convertTo(s.cost, s.currency, currency, rates)
    }));

  // 3. Get Redundancy Suggestions
  const suggestions = getRedundancyInsights(subs);

  return (
    <Container size="xl" py="lg">
      <Title order={2} mb="xl">Analytical Insights</Title>

      {/* Variance Cards */}
      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg" mb="xl">
        <Paper p="lg" radius="md" withBorder>
          <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Monthly Variance</Text>
          <Group align="flex-end" gap="xs" mt="xs">
            <Text size="xl" fw={700}>{variance.toFixed(1)}%</Text>
            <ThemeIcon color="red" variant="light" size="sm" mb={4}>
                <IconTrendingUp size={14} />
            </ThemeIcon>
          </Group>
          <Text size="xs" c="dimmed" mt="sm">Spending is up compared to last month.</Text>
        </Paper>

        <Paper p="lg" radius="md" withBorder>
           <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Optimization Score</Text>
           <Text size="xl" fw={700} mt="xs" c={suggestions.length > 0 ? "orange" : "green"}>
              {suggestions.length > 0 ? "Needs Review" : "Healthy"}
           </Text>
           <Text size="xs" c="dimmed" mt="sm">{suggestions.length} potential redundancies found.</Text>
        </Paper>
      </SimpleGrid>

      {/* Heatmap Section */}
      <div style={{ marginBottom: 'var(--mantine-spacing-xl)' }}>
        <SpendingHeatmap data={heatmapData} currency={currency} />
      </div>

      {/* Optimization Actions */}
      <Title order={3} mb="md">Optimization Opportunities</Title>
      {suggestions.length === 0 ? (
        <Alert icon={<IconBulb size={16}/>} title="All good!" color="green" variant="light">
          Your subscription portfolio looks efficient. No redundancies detected.
        </Alert>
      ) : (
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
          {suggestions.map((suggestion: any, i: number) => (
            <Alert key={i} icon={<IconAlertTriangle size={16}/>} title={suggestion.category} color="orange" variant="light">
               You have {suggestion.count} subscriptions in this category 
               ({suggestion.vendors.join(", ")}). Consider consolidating.
            </Alert>
          ))}
        </SimpleGrid>
      )}