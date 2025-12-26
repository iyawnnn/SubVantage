"use client";

import { Title, Text, Button, Group } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { SubscriptionModal } from "./SubscriptionModal";

export function DashboardHeader() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Group justify="space-between" mb="xl" align="flex-end">
        <div>
          <Title order={2} fw={800}>Financial Overview</Title>
          <Text c="dimmed" size="sm">Track your recurring expenses in one place.</Text>
        </div>
        
        <Button 
          leftSection={<IconPlus size={16} />} 
          color="blue" 
          radius="md"
          onClick={open}
        >
          Add Subscription
        </Button>
      </Group>

      {/* The Modal lives here for "Create" mode */}
      <SubscriptionModal 
        opened={opened} 
        close={close} 
        subToEdit={null} // null means "Create Mode"
      />
    </>
  );
}