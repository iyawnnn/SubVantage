"use client";

import { Modal, TextInput, NumberInput, Select, Button, Group, Checkbox, Stack } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { createSubscription, updateSubscription } from "@/actions/subscription-actions"; 
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SubscriptionModalProps {
  opened: boolean;
  close: () => void;
  subToEdit?: any | null; 
}

export function SubscriptionModal({ opened, close, subToEdit }: SubscriptionModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      vendorName: "",
      website: "",
      cost: 0,
      splitCost: 0, // 👈 NEW: Default to 0
      currency: "PHP",
      frequency: "MONTHLY",
      category: "Personal",
      startDate: new Date(),
      status: "ACTIVE",
      isTrial: false,
    },
    validate: {
      vendorName: (value) => (value.length < 2 ? "Name is too short" : null),
      cost: (value) => (value < 0 ? "Cost cannot be negative" : null),
      splitCost: (value) => (value < 0 ? "Split cost cannot be negative" : null),
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (subToEdit) {
      form.setValues({
        vendorName: subToEdit.vendor.name,
        website: subToEdit.vendor.website || "",
        cost: Number(subToEdit.cost),
        // 👈 NEW: Load splitCost if it exists, otherwise 0
        splitCost: subToEdit.splitCost ? Number(subToEdit.splitCost) : 0,
        currency: subToEdit.currency,
        frequency: subToEdit.frequency,
        category: subToEdit.category,
        startDate: new Date(subToEdit.startDate),
        status: subToEdit.status,
        isTrial: subToEdit.isTrial,
      });
    } else {
      form.reset();
    }
  }, [subToEdit]);

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    
    // Map 'vendorName' to 'name' so the Server understands it
    const payload = {
        ...values,
        name: values.vendorName, 
    };

    try {
      if (subToEdit) {
        // --- UPDATE MODE ---
        const result = await updateSubscription(subToEdit.id, payload);
        
        if (result.success) {
          notifications.show({ title: "Success", message: "Subscription updated!", color: "green" });
          close();
          router.refresh();
        } else {
          const errorMsg = result.errors ? Object.values(result.errors).flat().join(", ") : result.message;
          notifications.show({ title: "Error", message: errorMsg, color: "red" });
        }
      } else {
        // --- CREATE MODE ---
        const result = await createSubscription(payload);

        if (result.success) {
          notifications.show({ title: "Success", message: "Subscription added!", color: "green" });
          form.reset();
          close();
          router.refresh();
        } else {
          const errorMsg = result.errors ? Object.values(result.errors).flat().join(", ") : result.message;
          notifications.show({ title: "Error", message: errorMsg, color: "red" });
        }
      }
    } catch (error) {
      notifications.show({ title: "Error", message: "Something went wrong", color: "red" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      opened={opened} 
      onClose={() => { close(); form.reset(); }} 
      title={subToEdit ? "Edit Subscription" : "Add Subscription"} 
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Vendor Name"
            placeholder="e.g. Netflix"
            withAsterisk
            data-autofocus
            {...form.getInputProps("vendorName")}
          />

          <Group grow>
            <NumberInput
              label="Full Price" // 👈 Renamed for clarity
              placeholder="0.00"
              min={0}
              decimalScale={2}
              fixedDecimalScale
              withAsterisk
              {...form.getInputProps("cost")}
            />
            {/* 👈 NEW: Split Cost Input */}
            <NumberInput
              label="My Share (Optional)"
              description="Leave 0 if you pay full price"
              placeholder="0.00"
              min={0}
              decimalScale={2}
              fixedDecimalScale
              {...form.getInputProps("splitCost")}
            />
          </Group>

          <Group grow>
            <Select
              label="Currency"
              data={["PHP", "USD", "EUR", "GBP", "AUD", "CAD", "JPY"]}
              withAsterisk
              allowDeselect={false}
              {...form.getInputProps("currency")}
            />
            <Select
              label="Billing Cycle"
              data={["MONTHLY", "YEARLY"]}
              withAsterisk
              allowDeselect={false}
              {...form.getInputProps("frequency")}
            />
          </Group>

          <Group grow>
            <Select
              label="Category"
              placeholder="Select category"
              data={[
                "Entertainment", "Personal", "Work", "Dev Tools",
                "Utilities", "Health", "Education", "Uncategorized"
              ]}
              searchable
              withAsterisk
              {...form.getInputProps("category")}
            />
             <Select
              label="Status"
              data={[
                { value: "ACTIVE", label: "Active" },
                { value: "PAUSED", label: "Paused" },
                { value: "CANCELLED", label: "Cancelled" },
              ]}
              allowDeselect={false}
              {...form.getInputProps("status")}
            />
          </Group>

          <DateInput
            label="Start Date"
            placeholder="When did it start?"
            withAsterisk
            {...form.getInputProps("startDate")}
          />

          <Checkbox
            mt="md"
            label="This is a Free Trial"
            {...form.getInputProps("isTrial", { type: "checkbox" })}
          />

          <Group justify="flex-end" mt="xl">
            <Button variant="default" onClick={close}>Cancel</Button>
            <Button type="submit" loading={loading}>
              {subToEdit ? "Save Changes" : "Add Subscription"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}