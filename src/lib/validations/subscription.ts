import * as z from "zod";

export const subscriptionSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .trim(),
  website: z
    .string()
    .url("Invalid URL")
    .optional()
    .or(z.literal("")),
  cost: z.coerce
    .number()
    .min(0, "Cost cannot be negative")
    .max(1000000, "Cost exceeds acceptable limits"),
  splitCost: z.coerce
    .number()
    .min(0, "Split cost cannot be negative")
    .max(1000000, "Split cost exceeds acceptable limits")
    .optional()
    .default(0),
  currency: z
    .string()
    .length(3, "Currency must be exactly 3 letters")
    .toUpperCase(),
  frequency: z.enum(["MONTHLY", "YEARLY"], {
    message: "Please select a billing cycle",
  }),
  category: z
    .string()
    .min(1, "Category is required")
    .max(30, "Category name is too long")
    .trim(),
  status: z.enum(["ACTIVE", "PAUSED", "CANCELLED"]).default("ACTIVE"),
  startDate: z.date({
    message: "A valid start date is required",
  }),
  isTrial: z.boolean().default(false),
}).refine((data) => (data.splitCost || 0) <= data.cost, {
  message: "Your split share cannot be greater than the total cost",
  path: ["splitCost"],
});

export type SubscriptionFormData = z.infer<typeof subscriptionSchema>;