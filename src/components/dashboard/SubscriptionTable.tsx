"use client";

import { Table, Badge, ActionIcon, Menu, Text, Center, Stack, ThemeIcon, rem } from "@mantine/core";
import { IconDots, IconPencil, IconTrash, IconReceiptOff } from "@tabler/icons-react";
import dayjs from "dayjs";
import { deleteSubscription } from "@/actions/subscription-actions";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { SubscriptionModal } from "./SubscriptionModal"; // Import the Modal

// Update interface to match what we need
interface Subscription {
  id: string;
  vendor: { name: string; website: string | null };
  cost: number;
  frequency: string;
  startDate: Date; // Added this
  nextRenewalDate: Date;
  isTrial: boolean;
  category: string; // Added this
}

export function SubscriptionTable({ data }: { data: Subscription[] }) {
  const router = useRouter();
  
  // --- NEW STATE FOR EDITING ---
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);
  const [modalOpened, { open, close }] = useDisclosure(false);

  const handleDelete = async (id: string) => {
    // ... (Keep existing delete logic)
    const result = await deleteSubscription(id);
    if (result.success) {
      notifications.show({ title: "Deleted", message: "Subscription removed", color: "blue" });
      router.refresh();
    } else {
       notifications.show({ title: "Error", message: result.message, color: "red" });
    }
  };

  const handleEdit = (sub: Subscription) => {
    setEditingSub(sub); // Set the specific item data
    open(); // Open the modal
  };

  // ... (Keep Empty State Logic) ...
  if (data.length === 0) {
      // ... (Paste your existing Empty State return here)
       return (
      <Center py={60} bg="gray.0" style={{ borderRadius: 8, border: '1px dashed #ced4da' }}>
        <Stack align="center" gap="xs">
          <ThemeIcon size={60} radius="xl" variant="white" color="gray">
            <IconReceiptOff size={34} stroke={1.5} />
          </ThemeIcon>
          <Text size="lg" fw={600} c="dimmed">No subscriptions found</Text>
          <Text size="sm" c="dimmed" maw={300} ta="center">
            You haven't added any subscriptions yet. Click the "Add Subscription" button above to get started.
          </Text>
        </Stack>
      </Center>
    );
  }

  const rows = data.map((sub) => {
    // ... (Keep Trial Logic & Badge Logic) ...
    const now = dayjs();
    const renewal = dayjs(sub.nextRenewalDate);
    const daysLeft = renewal.diff(now, 'day');
    
    let statusBadge = <Badge color="green" variant="light">Active</Badge>;
    if (sub.isTrial) {
      if (daysLeft < 3) {
        statusBadge = <Badge color="red" variant="filled">Expiring in {daysLeft}d</Badge>;
      } else {
        statusBadge = <Badge color="yellow" variant="light">Trial: {daysLeft}d left</Badge>;
      }
    }

    return (
      <Table.Tr key={sub.id}>
        <Table.Td>
          <Text fw={500}>{sub.vendor.name}</Text>
          {/* Optional: Show category in table too */}
          <Text size="xs" c="dimmed">{sub.category}</Text> 
        </Table.Td>
        <Table.Td>
          ${Number(sub.cost).toFixed(2)} / {sub.frequency === "MONTHLY" ? "mo" : "yr"}
        </Table.Td>
        <Table.Td>
          {dayjs(sub.nextRenewalDate).format("MMM D, YYYY")}
        </Table.Td>
        <Table.Td>{statusBadge}</Table.Td>
        <Table.Td>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <IconDots style={{ width: rem(16), height: rem(16) }} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              {/* 👇 CONNECT THE EDIT BUTTON */}
              <Menu.Item 
                leftSection={<IconPencil style={{ width: rem(14), height: rem(14) }} />}
                onClick={() => handleEdit(sub)}
              >
                Edit
              </Menu.Item>
              <Menu.Item 
                color="red" 
                leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                onClick={() => handleDelete(sub.id)}
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Table.Td>
      </Table.Tr>
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
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      {/* 👇 RENDER THE MODAL HERE (Controlled by Table) */}
      <SubscriptionModal 
        opened={modalOpened} 
        close={() => { close(); setEditingSub(null); }} 
        subToEdit={editingSub} 
      />
    </>
  );
}