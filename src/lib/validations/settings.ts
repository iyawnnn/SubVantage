import * as z from "zod";

export const currencySchema = z.enum(["USD", "EUR", "GBP", "JPY", "PHP"], {
  message: "Invalid currency selected",
});

export const notificationSchema = z.boolean({
  message: "Notification preference must be a valid boolean",
});

export const onboardingSchema = z.object({
  currency: currencySchema,
  notifications: notificationSchema,
  twoFactorEnabled: z.boolean().optional().default(false),
});