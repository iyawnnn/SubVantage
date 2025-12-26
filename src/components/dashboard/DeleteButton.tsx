"use client";
import { ActionIcon, Tooltip } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { deleteSubscription } from "@/actions/subscription-actions";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";

export function DeleteButton({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if(!confirm("Permanently delete this record? This cannot be undone.")) return;
    
    const res = await deleteSubscription(id);
    if (res.success) {
      notifications.show({ title: "Deleted", message: "Record permanently removed.", color: "gray" });
      router.refresh();
    }
  };

  return (
    <Tooltip label="Delete Permanently">
      <ActionIcon variant="subtle" color="red" onClick={handleDelete}>
        <IconTrash size={18} />
      </ActionIcon>
    </Tooltip>
  );
}