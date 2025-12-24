"use client";

import { useForm } from "@mantine/form";
import { Modal, TextInput, NumberInput, Select, Button, Group, Switch, Stack } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { addSubscription, updateSubscription } from "@/actions/subscription-actions"; 
import { notifications } from "@mantine/notifications";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Define the shape of data we might edit
interface SubscriptionData {
  id: string;
  vendor: { name: string };
  cost: number;
  frequency: string;
  startDate: Date;
  isTrial: boolean;
  category: string;
}

interface SubscriptionModalProps {
  opened: boolean;
  close: () => void;
  subToEdit?: SubscriptionData | null; // Optional prop for editing
}

const CATEGORIES = ["Entertainment", "Work", "Utilities", "Dev Tools", "Personal"];

export function SubscriptionModal({ opened, close, subToEdit }: SubscriptionModalProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Initialize form
  const form = useForm({
    initialValues: {
      name: "",
      cost: 0,
      frequency: "MONTHLY",
      category: "Personal",
      startDate: new Date(),
      isTrial: false,
    },
    validate: {
      name: (value) => (value.length < 2 ? "Name is too short" : null),
      cost: (value) => (value < 0 ? "Cost cannot be negative" : null),
      startDate: (value) => (!value ? "Date is required" : null),
    },
  });

  // MAGIC: Watch for "subToEdit" changes and fill the form
  useEffect(() => {
    if (subToEdit) {
      form.setValues({
        name: subToEdit.vendor.name,
        cost: Number(subToEdit.cost),
        frequency: subToEdit.frequency,
        category: subToEdit.category || "Personal",
        startDate: new Date(subToEdit.startDate),
        isTrial: subToEdit.isTrial,
      });
    } else {
      form.reset(); // Reset if adding new
    }
  }, [subToEdit]); // Run this whenever subToEdit changes

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    
    let result;

    if (subToEdit) {
      // --- UPDATE MODE ---
      result = await updateSubscription(subToEdit.id, {
        ...values,
        frequency: values.frequency as "MONTHLY" | "YEARLY",
      });
    } else {
      // --- ADD MODE ---
      result = await addSubscription({
        ...values,
        frequency: values.frequency as "MONTHLY" | "YEARLY",
      });
    }

    setLoading(false);

    if (result.success) {
      notifications.show({ 
        title: "Success", 
        message: subToEdit ? "Subscription updated" : "Subscription added", 
        color: "green" 
      });
      if (!subToEdit) form.reset(); // Only reset on add
      router.refresh();
      close();
    } else {
      notifications.show({ title: "Error", message: result.message, color: "red" });
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
        <Stack gap="md">
          <TextInput
            label="Vendor Name"
            placeholder="Netflix, AWS, etc."
            required
            {...form.getInputProps("name")}
          />
          
          <Group grow>
            <NumberInput
              label="Price"
              prefix="$"
              decimalScale={2}
              allowNegative={false}
              required
              {...form.getInputProps("cost")}
            />
            <Select
              label="Billing Cycle"
              data={['MONTHLY', 'YEARLY']}
              required
              allowDeselect={false}
              {...form.getInputProps("frequency")}
            />
          </Group>

          <Select
            label="Category"
            data={CATEGORIES}
            required
            allowDeselect={false}
            {...form.getInputProps("category")}
          />

          <DatePickerInput
            label="Start Date"
            placeholder="Pick a date"
            required
            {...form.getInputProps("startDate")}
          />

          <Group justify="space-between" mt="xs">
            <Switch
              label="This is a Free Trial"
              {...form.getInputProps("isTrial", { type: "checkbox" })}
            />
          </Group>

          <Button type="submit" fullWidth loading={loading} mt="md">
            {subToEdit ? "Update Subscription" : "Save Subscription"}
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}