import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Container, Title, Text, Paper, Group, ThemeIcon } from "@mantine/core";
import { IconArchive } from "@tabler/icons-react";
import { formatCurrency, convertTo } from "@/lib/currency-helper";
import { getLiveRates } from "@/lib/exchange-rates";
import { ArchiveList } from "@/components/dashboard/ArchiveList";

async function getArchivedData() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const data = await prisma.subscription.findMany({
    where: { 
      userId: session.user.id,
      status: "CANCELLED" 
    },
    orderBy: { cost: "desc" },
    include: { vendor: true },
  });

  // 👇 STRICT SAFETY FIX: 
  // We explicitly build the object instead of using '...sub'. 
  // This guarantees NO Decimal objects or hidden metadata leak through.
  return data.map((sub) => ({
    id: sub.id,
    vendor: {
        name: sub.vendor.name,
        website: sub.vendor.website
    },
    // Force conversion to numbers
    cost: Number(sub.cost),
    splitCost: sub.splitCost ? Number(sub.splitCost) : 0,
    
    // Pass plain strings/dates
    currency: sub.currency,
    frequency: sub.frequency,
    startDate: sub.startDate,
    nextRenewalDate: sub.nextRenewalDate,
    isTrial: sub.isTrial,
    category: sub.category,
    status: sub.status,
  }));
}

export default async function ArchivePage() {
  const session = await auth();
  const [subs, user, rates] = await Promise.all([
    getArchivedData(),
    prisma.user.findUnique({ where: { id: session?.user?.id }, select: { preferredCurrency: true } }),
    getLiveRates("USD"),
  ]);

  const baseCurrency = user?.preferredCurrency || "USD";

  // Calculate Total "Life-to-Date" (Monthly Value)
  const totalMonthlyValue = subs.reduce((acc, sub) => {
    // Logic: If you were splitting the cost, you only saved your share.
    // If splitCost is 0, you saved the full cost.
    const finalCost = sub.splitCost > 0 ? sub.splitCost : sub.cost;
    
    const cost = convertTo(finalCost, sub.currency, baseCurrency, rates);
    return acc + (sub.frequency === "YEARLY" ? cost / 12 : cost);
  }, 0);

  return (
    <Container size="lg" py="lg">
      <Title order={2} mb="xs">Subscription Graveyard</Title>
      <Text c="dimmed" mb="xl">Subscriptions you have cancelled. Restoring them brings them back to your dashboard.</Text>

      {/* Savings Card */}
      <Paper p="xl" radius="md" withBorder mb="xl" bg="gray.0">
        <Group>
          <ThemeIcon size={50} radius="md" color="gray" variant="white">
            <IconArchive size={28} />
          </ThemeIcon>
          <div>
            <Text c="dimmed" tt="uppercase" fw={700} size="xs">Total Monthly Value Saved</Text>
            <Text fw={700} size="32px" c="green.8">
              {formatCurrency(totalMonthlyValue, baseCurrency)} / mo
            </Text>
          </div>
        </Group>
      </Paper>

      {/* Render the Client Component for the Table */}
      <ArchiveList data={subs} />
    </Container>
  );
}