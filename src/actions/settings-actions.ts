"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { currencySchema, notificationSchema } from "@/lib/validations/settings";
import { generateSecret, generateURI, verify } from "otplib";
import QRCode from "qrcode";

export async function updateCurrency(currency: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

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

export async function setupTwoFactor() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || !user.email) throw new Error("User mapping failure");

  const secret = generateSecret();
  const appName = process.env.NEXT_PUBLIC_APP_NAME || "SubVantage";

  const otpauth = generateURI({
    issuer: appName,
    label: user.email,
    secret,
  });

  const qrCodeDataUrl = await QRCode.toDataURL(otpauth);

  await prisma.user.update({
    where: { id: user.id },
    data: { twoFactorSecret: secret },
  });

  return { qrCodeDataUrl, secret };
}

export async function verifyAndEnableTwoFactor(token: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || !user.twoFactorSecret) {
    return { success: false, message: "2FA initialization missing." };
  }

  const isValid = verify({
    token,
    secret: user.twoFactorSecret,
  });

  if (!isValid) {
    return { success: false, message: "Invalid synchronization code." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { isTwoFactorEnabled: true },
  });

  revalidatePath("/settings");
  return { success: true };
}

export async function disableTwoFactor() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.user.update({
    where: { id: session.user.id },
    data: { isTwoFactorEnabled: false, twoFactorSecret: null },
  });

  revalidatePath("/settings");
  return { success: true };
}