"use client";
import { Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { SubscriptionModal } from "./SubscriptionModal";

export function AddButton() {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Button leftSection={<IconPlus size={16} />} onClick={open}>
        Add Subscription
      </Button>
      <SubscriptionModal opened={opened} close={close} />
    </>
  );
}