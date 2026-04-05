"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { currencySchema, notificationSchema } from "@/lib/validations/settings";

export async function updateCurrency(currency: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Strict Validation
  const validated = currencySchema.safeParse(currency);
  if (!validated.success) throw new Error("Invalid currency code");

  await prisma.user.update({
    where: { id: session.user.id },
    data: { preferredCurrency: validated.data },
  });

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateNotificationSettings(enabled: boolean) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Strict Validation
  const validated = notificationSchema.safeParse(enabled);
  if (!validated.success) throw new Error("Invalid boolean value");

  await prisma.user.update({
    where: { id: session.user.id },
    data: { emailNotifications: validated.data },
  });

  revalidatePath("/settings");
  return { success: true };
}

export async function getExportData() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const subs = await prisma.subscription.findMany({
    where: { userId: session.user.id },
    include: { vendor: true },
  });

  return subs.map((sub) => ({
    Subscription: sub.vendor.name,
    Cost: Number(sub.cost),
    Currency: sub.currency || "USD",
    Frequency: sub.frequency,
    Category: sub.category,
    Status: sub.status,
    StartDate: sub.startDate.toISOString().split("T")[0],
    NextRenewal: sub.nextRenewalDate.toISOString().split("T")[0],
  }));
}