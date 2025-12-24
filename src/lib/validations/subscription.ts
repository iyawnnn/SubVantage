import { z } from "zod";

export const subscriptionSchema = z.object({
  name: z.string().min(1, "Vendor name is required"),
  website: z.string().optional(),
  cost: z.number().min(0, "Cost cannot be negative"),
  frequency: z.enum(["MONTHLY", "YEARLY"]),
  startDate: z.coerce.date(), 
  isTrial: z.boolean().default(false),
  category: z.string().min(1).default("Personal"),
});

export type SubscriptionFormData = z.infer<typeof subscriptionSchema>;