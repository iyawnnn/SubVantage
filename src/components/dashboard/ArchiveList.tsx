"use client";

import { Table, Badge, Group, Text, Paper } from "@mantine/core";
import { RestoreButton } from "./RestoreButton";
import { DeleteButton } from "./DeleteButton";
import { formatCurrency } from "@/lib/currency-helper";

interface ArchiveListProps {
  data: any[];
}

export function ArchiveList({ data }: ArchiveListProps) {
  if (data.length === 0) {
    return (
      <Paper withBorder p="xl" radius="md" mt="md">
        <Text ta="center" c="dimmed">No archived subscriptions found.</Text>
      </Paper>
    );
  }

  return (
    <Paper withBorder radius="md">
      <Table verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Vendor</Table.Th>
            <Table.Th>Original Cost</Table.Th>
            <Table.Th>Category</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data.map((sub) => (
            <Table.Tr key={sub.id} style={{ opacity: 0.7 }}>
              <Table.Td>
                <Text fw={500}>{sub.vendor.name}</Text>
              </Table.Td>
              <Table.Td>
                {formatCurrency(Number(sub.cost), sub.currency)} / {sub.frequency === "MONTHLY" ? "mo" : "yr"}
              </Table.Td>
              <Table.Td>
                <Badge color="gray" variant="light">{sub.category}</Badge>
              </Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <RestoreButton id={sub.id} />
                  <DeleteButton id={sub.id} />
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Paper>
  );
}