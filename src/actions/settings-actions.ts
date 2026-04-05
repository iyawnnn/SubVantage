"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import dayjs from "dayjs"; 

export async function updateCurrency(currency: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.user.update({
    where: { id: session.user.id },
    data: { preferredCurrency: currency },
  });

  revalidatePath("/settings");
  revalidatePath("/subscriptions");
  return { success: true };
}

export async function getExportData() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const subs = await prisma.subscription.findMany({
    where: { userId: session.user.id },
    include: { vendor: true },
    orderBy: { startDate: 'desc' }
  });

  return subs.map(sub => ({
    Vendor: sub.vendor.name,
    Category: sub.category,
    Cost: Number(sub.cost),
    Currency: sub.currency,
    Frequency: sub.frequency,
    Status: sub.status,
    "Start Date": dayjs(sub.startDate).format("MMM DD, YYYY"),
    "Next Renewal": dayjs(sub.nextRenewalDate).format("MMM DD, YYYY"),
  }));
}

export async function updateNotificationSettings(enabled: boolean) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.user.update({
    where: { id: session.user.id },
    data: { emailNotifications: enabled },
  });

  revalidatePath("/settings");
  return { success: true };
}