import * as z from "zod";

export const currencySchema = z.enum(["USD", "EUR", "GBP", "JPY", "PHP"], {
  errorMap: () => ({ message: "Invalid currency selected" }),
});

export const notificationSchema = z.boolean({
  required_error: "Notification preference is required",
  invalid_type_error: "Preference must be a boolean",
});

export const onboardingSchema = z.object({
  currency: currencySchema,
  notifications: notificationSchema,
});