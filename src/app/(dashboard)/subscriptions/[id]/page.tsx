import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { Card, Group, Text, ThemeIcon, Grid, Badge, Title, Button, Stack, Container, SimpleGrid } from "@mantine/core";
import { IconCalendar, IconCoin, IconClock, IconArrowLeft } from "@tabler/icons-react";
import dayjs from "dayjs";
import { formatCurrency } from "@/lib/currency-helper";
import Link from "next/link";

export default async function SubscriptionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/");

  const { id } = await params;

  const sub = await prisma.subscription.findUnique({
    where: { id },
    include: { vendor: true }
  });

  if (!sub || sub.userId !== session.user.id) notFound();

  const cost = sub.splitCost && Number(sub.splitCost) > 0 
    ? Number(sub.splitCost) 
    : Number(sub.cost);

  const now = dayjs();
  const start = dayjs(sub.startDate);
  
  const monthsActive = now.diff(start, 'month') + 1; 
  const lifetimeSpend = monthsActive * cost;

  return (
    <Container size="md" py="xl">
       {/* Header */}
       <Group mb={30}>
          {/* 👇 FIX: Wrap Button in Link instead of using component={Link} */}
          <Link href="/dashboard">
            <Button 
              variant="subtle" 
              color="gray" 
              leftSection={<IconArrowLeft size={16} />}
              size="xs"
              // Optional: Render as div to ensure valid HTML (<a> containing <div> instead of <button>)
              component="div"
            >
              Back to Dashboard
            </Button>
          </Link>
       </Group>

       <Group justify="space-between" mb="xl">
          <div>
            <Title order={1} fw={800}>{sub.vendor.name}</Title>
            <Text c="dimmed" size="lg">{sub.category}</Text>
          </div>
          <Badge 
            size="xl" 
            radius="md" 
            variant="light"
            color={sub.status === "ACTIVE" ? "green" : "gray"}
          >
            {sub.status}
          </Badge>
       </Group>

       <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
          
          <Card withBorder radius="md" p="xl" shadow="sm">
            <Group justify="space-between" mb="xs">
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Monthly Cost</Text>
              <ThemeIcon variant="light" color="blue" radius="md">
                <IconCoin size={18} />
              </ThemeIcon>
            </Group>
            <Text fw={800} size="xl" style={{ fontSize: 28 }}>
              {formatCurrency(cost, sub.currency)}
            </Text>
            {Number(sub.splitCost) > 0 && (
              <Badge mt="sm" variant="dot" color="blue">Split Cost Active</Badge>
            )}
          </Card>

          <Card withBorder radius="md" p="xl" shadow="sm">
             <Group justify="space-between" mb="xs">
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Lifetime Spend</Text>
              <ThemeIcon variant="light" color="violet" radius="md">
                <IconClock size={18} />
              </ThemeIcon>
            </Group>
            <Text fw={800} size="xl" style={{ fontSize: 28 }}>
              {formatCurrency(lifetimeSpend, sub.currency)}
            </Text>
            <Text size="xs" c="dimmed" mt={4}>
              Over {monthsActive} months
            </Text>
          </Card>

           <Card withBorder radius="md" p="xl" shadow="sm">
             <Group justify="space-between" mb="xs">
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>Next Payment</Text>
              <ThemeIcon variant="light" color="orange" radius="md">
                <IconCalendar size={18} />
              </ThemeIcon>
            </Group>
            <Text fw={800} size="xl" style={{ fontSize: 28 }}>
              {dayjs(sub.nextRenewalDate).format("MMM D")}
            </Text>
             <Text size="xs" c="dimmed" mt={4}>
              {dayjs(sub.nextRenewalDate).format("dddd")}
            </Text>
          </Card>

       </SimpleGrid>

       <Card withBorder radius="md" mt="lg" p="xl">
          <Title order={4} mb="md">Subscription Details</Title>
          <SimpleGrid cols={2}>
             <Stack gap={4}>
                <Text size="sm" c="dimmed">Start Date</Text>
                <Text fw={500}>{dayjs(sub.startDate).format("MMMM D, YYYY")}</Text>
             </Stack>
             <Stack gap={4}>
                <Text size="sm" c="dimmed">Website</Text>
                {sub.vendor.website ? (
                   <a href={sub.vendor.website} target="_blank" style={{ color: '#228be6' }}>
                      Visit Site
                   </a>
                ) : (
                   <Text c="dimmed">—</Text>
                )}
             </Stack>
             <Stack gap={4}>
                <Text size="sm" c="dimmed">Billing Cycle</Text>
                <Text fw={500}>{sub.frequency}</Text>
             </Stack>
             <Stack gap={4}>
                <Text size="sm" c="dimmed">Trial Status</Text>
                <Text fw={500}>{sub.isTrial ? "Active Trial" : "Standard Plan"}</Text>
             </Stack>
          </SimpleGrid>
       </Card>
    </Container>
  );
}