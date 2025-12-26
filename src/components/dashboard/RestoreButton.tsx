"use client";
import { ActionIcon, Tooltip } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { restoreSubscription } from "@/actions/subscription-actions";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";

export function RestoreButton({ id }: { id: string }) {
  const router = useRouter();
  
  const handleRestore = async () => {
    const res = await restoreSubscription(id);
    if (res.success) {
      notifications.show({ title: "Restored", message: "Subscription is active again.", color: "blue" });
      router.refresh();
    } else {
      notifications.show({ title: "Error", message: res.message, color: "red" });
    }
  };

  return (
    <Tooltip label="Restore to Active">
      <ActionIcon variant="light" color="blue" onClick={handleRestore}>
        <IconRefresh size={18} />
      </ActionIcon>
    </Tooltip>
  );
}