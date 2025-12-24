import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { calculateMonthlyBurnRate } from "@/lib/calculations";
import { SimpleGrid, Paper, Text, Group, ThemeIcon, Title, Container, Stack } from "@mantine/core";
import { IconCoin, IconCalendarStats, IconAlertCircle } from "@tabler/icons-react";
import { SubscriptionTable } from "@/components/dashboard/SubscriptionTable";
import { AddButton } from "@/components/dashboard/AddButton";
import { SpendingChart } from "@/components/dashboard/SpendingChart";
import { CategoryChart } from "@/components/dashboard/CategoryChart";
import { UpcomingBills } from "@/components/dashboard/UpcomingBills";

async function getSubscriptionData() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const data = await prisma.subscription.findMany({
    where: { userId: session.user.id },
    orderBy: { cost: "desc" },
    include: { vendor: true }
  });
  
  return data.map(sub => ({
    ...sub,
    cost: Number(sub.cost)
  }));
}

export default async function DashboardPage() {
  const subs = await getSubscriptionData();

  // Financial Engine
  const monthlyBurn = calculateMonthlyBurnRate(subs);
  const annualProjection = monthlyBurn * 12;
  const activeTrials = subs.filter(s => s.isTrial).length;

  return (
    <Container size="lg" py="lg">
      <Group justify="space-between" mb="xl">
        <div>
          <Title order={2}>Financial Overview</Title>
          <Text c="dimmed">Track your recurring expenses in one place.</Text>
        </div>
        <AddButton />
      </Group>

      {/* STATS GRID */}
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" mb="xl">
        <Paper shadow="xs" p="xl" radius="md" withBorder>
          <Group>
            <ThemeIcon color="blue" variant="light" size={48} radius="md">
              <IconCoin size="1.5rem" stroke={1.5} />
            </ThemeIcon>
            <div>
              <Text c="dimmed" size="xs" tt="uppercase" fw={700}>Monthly Burn</Text>
              <Text fw={700} size="xl">${monthlyBurn.toFixed(2)}</Text>
            </div>
          </Group>
        </Paper>

        <Paper shadow="xs" p="xl" radius="md" withBorder>
          <Group>
            <ThemeIcon color="violet" variant="light" size={48} radius="md">
              <IconCalendarStats size="1.5rem" stroke={1.5} />
            </ThemeIcon>
            <div>
              <Text c="dimmed" size="xs" tt="uppercase" fw={700}>Annual Projection</Text>
              <Text fw={700} size="xl">${annualProjection.toFixed(2)}</Text>
            </div>
          </Group>
        </Paper>

        <Paper shadow="xs" p="xl" radius="md" withBorder>
          <Group>
            <ThemeIcon color="orange" variant="light" size={48} radius="md">
              <IconAlertCircle size="1.5rem" stroke={1.5} />
            </ThemeIcon>
            <div>
              <Text c="dimmed" size="xs" tt="uppercase" fw={700}>Active Trials</Text>
              <Text fw={700} size="xl">{activeTrials}</Text>
            </div>
          </Group>
        </Paper>
      </SimpleGrid>

      {/* CHARTS & ANALYTICS ROW */}
      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md" mb="xl">
        {/* Main Spending Chart takes up 2 columns */}
        <div style={{ gridColumn: "span 2" }}>
           <SpendingChart data={subs} />
        </div>
        
        {/* Stack the Pie Chart and Upcoming list in the 3rd column */}
        <Stack>
          <CategoryChart data={subs} />
          <UpcomingBills data={subs} />
        </Stack>
      </SimpleGrid>

      {/* THE DATA TABLE */}
      <Paper p="md" withBorder radius="md">
        <Title order={4} mb="md" px="xs">Active Subscriptions</Title>
        <SubscriptionTable data={subs} />
      </Paper>
    </Container>
  );
}