import { z } from "zod";

export const subscriptionSchema = z.object({
  name: z.string().min(2, "Vendor name is required"),
  website: z.string().optional(),
  cost: z.coerce.number().min(0, "Cost must be positive"),
  splitCost: z.number().min(0).optional(),
  currency: z.string().min(3),
  frequency: z.enum(["MONTHLY", "YEARLY"]),
  category: z.string().min(1, "Category is required"),
  startDate: z.coerce.date(),
  isTrial: z.boolean().default(false),
  status: z.enum(["ACTIVE", "PAUSED", "CANCELLED"]).default("ACTIVE"),
});

export type SubscriptionFormData = z.infer<typeof subscriptionSchema>;