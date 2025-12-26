"use client";

import { Table, Badge, ActionIcon, Menu, Text, Center, Stack, rem, Tooltip } from "@mantine/core";
import { IconDots, IconPencil, IconArchive, IconInfoCircle } from "@tabler/icons-react";
import dayjs from "dayjs";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { SubscriptionModal } from "./SubscriptionModal";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency, convertTo } from "@/lib/currency-helper";
import { archiveSubscription } from "@/actions/subscription-actions";
import Link from "next/link"; // 👈 IMPORT LINK

const MotionTr = motion.create(Table.Tr);

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
  status?: string;
}

export function SubscriptionTable({
  data,
  rates,
  baseCurrency
}: {
  data: Subscription[],
  rates: Record<string, number>,
  baseCurrency: string
}) {
  const router = useRouter();
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);
  const [modalOpened, { open, close }] = useDisclosure(false);

  const [activeSubs, setActiveSubs] = useState(data);

  useEffect(() => {
    setActiveSubs(data);
  }, [data]);

  const handleArchive = async (id: string) => {
    const previousSubs = activeSubs;
    setActiveSubs((current) => current.filter((sub) => sub.id !== id));

    try {
      const result = await archiveSubscription(id);
      
      if (result.success) {
        notifications.show({ title: "Archived", message: "Moved to Graveyard", color: "blue" });
        router.refresh();
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      setActiveSubs(previousSubs);
      notifications.show({ title: "Error", message: error.message || "Failed to archive", color: "red" });
    }
  };

  const handleEdit = (sub: Subscription) => {
    setEditingSub(sub);
    open();
  };

  if (activeSubs.length === 0) {
    return (
      <Center py={60} bg="gray.0" style={{ borderRadius: 8, border: "1px dashed #ced4da" }}>
        <Text>No subscriptions found</Text>
      </Center>
    );
  }

  const rows = activeSubs.map((sub) => {
    const now = dayjs().startOf('day');
    const renewal = dayjs(sub.nextRenewalDate).startOf('day');
    const daysLeft = renewal.diff(now, "day");

    let statusBadge = <Badge color="green" variant="light">Active</Badge>;
    if (sub.isTrial) {
      if (daysLeft < 0) statusBadge = <Badge color="gray" variant="filled">Expired</Badge>;
      else if (daysLeft === 0) statusBadge = <Badge color="red" variant="filled">Expires Today</Badge>;
      else if (daysLeft <= 3) statusBadge = <Badge color="red" variant="light">Expiring in {daysLeft}d</Badge>;
      else statusBadge = <Badge color="yellow" variant="light">Trial: {daysLeft}d left</Badge>;
    }

    const isDifferentCurrency = sub.currency !== baseCurrency;
    const convertedCost = isDifferentCurrency
      ? convertTo(sub.cost, sub.currency, baseCurrency, rates)
      : null;

    return (
      <MotionTr
        key={sub.id}
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, height: 0, overflow: "hidden" }}
        transition={{ duration: 0.3 }}
      >
        <Table.Td>
          {/* 👇 UPDATE: Linked Vendor Name */}
          <Link 
            href={`/subscriptions/${sub.id}`} 
            style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
          >
            <Text fw={500} style={{ cursor: 'pointer' }}>
              {sub.vendor.name}
            </Text>
          </Link>
          <Text size="xs" c="dimmed">{sub.category}</Text>
        </Table.Td>

        <Table.Td>
          <Stack gap={0}>
            <Text fw={500} size="sm">
              {formatCurrency(sub.cost, sub.currency)} / {sub.frequency === "MONTHLY" ? "mo" : "yr"}
            </Text>
            {isDifferentCurrency && convertedCost && (
              <Text size="xs" c="dimmed" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                ≈ {formatCurrency(convertedCost, baseCurrency)}
                <Tooltip label={`Converted to ${baseCurrency} using live rates`} withArrow position="right">
                  <IconInfoCircle size={10} style={{ opacity: 0.5 }} />
                </Tooltip>
              </Text>
            )}
          </Stack>
        </Table.Td>

        <Table.Td>{dayjs(sub.nextRenewalDate).format("MMM D, YYYY")}</Table.Td>
        <Table.Td>{statusBadge}</Table.Td>

        <Table.Td>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <IconDots style={{ width: rem(16), height: rem(16) }} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconPencil style={{ width: rem(14), height: rem(14) }} />} onClick={() => handleEdit(sub)}>
                Edit
              </Menu.Item>

              <Menu.Item
                color="orange"
                leftSection={<IconArchive style={{ width: rem(14), height: rem(14) }} />}
                onClick={() => handleArchive(sub.id)}
              >
                Archive
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Table.Td>
      </MotionTr>
    );
  });

  return (
    <>
      <Table verticalSpacing="sm" striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Vendor</Table.Th>
            <Table.Th>Cost</Table.Th>
            <Table.Th>Next Renewal</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th style={{ width: 50 }} />
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <AnimatePresence mode="popLayout">{rows}</AnimatePresence>
        </Table.Tbody>
      </Table>

      <SubscriptionModal
        opened={modalOpened}
        close={() => { close(); setEditingSub(null); }}
        subToEdit={editingSub}
      />
    </>
  );
}