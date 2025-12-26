"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  subscriptionSchema,
  SubscriptionFormData,
} from "@/lib/validations/subscription";
import { revalidatePath } from "next/cache";

export type ActionResponse = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

// --- CREATE SUBSCRIPTION ---
export async function createSubscription(
  data: SubscriptionFormData
): Promise<ActionResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized. Please log in." };
  }

  // 1. Validate Input
  const validated = subscriptionSchema.safeParse(data);
  if (!validated.success) {
    console.error("❌ Validation Errors:", validated.error.flatten().fieldErrors);
    return {
      success: false,
      message: "Validation failed",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { name, website, ...subData } = validated.data;
  
  // Handle fields that might be optional/missing in older schemas
  const status = (subData as any).status || "ACTIVE"; 
  const splitCost = (subData as any).splitCost || 0; // 👈 NEW: Capture Split Cost

  try {
    // 2. Find or Create Vendor
    let vendor = await prisma.vendor.findFirst({
      where: {
        name: { equals: name, mode: "insensitive" },
        userId: session.user.id,
      },
    });

    if (!vendor) {
      vendor = await prisma.vendor.create({
        data: {
          name,
          website: website || null,
          userId: session.user.id,
        },
      });
    }

    // 3. Create Subscription
    const renewalDate = calculateRenewalDate(
      subData.startDate,
      subData.frequency
    );

    await prisma.subscription.create({
      data: {
        cost: subData.cost,
        splitCost: splitCost, // 👈 SAVING SPLIT COST TO DB
        currency: subData.currency,
        frequency: subData.frequency,
        startDate: subData.startDate,
        nextRenewalDate: renewalDate,
        isTrial: subData.isTrial,
        category: subData.category,
        status: status,
        userId: session.user.id,
        vendorId: vendor.id,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, message: "Subscription added successfully" };
  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, message: "Failed to save subscription." };
  }
}

// --- UPDATE SUBSCRIPTION ---
export async function updateSubscription(
  id: string,
  data: SubscriptionFormData
): Promise<ActionResponse> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: "Unauthorized" };

  const validated = subscriptionSchema.safeParse(data);
  if (!validated.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { name, ...subData } = validated.data;
  const status = (subData as any).status || "ACTIVE";
  const splitCost = (subData as any).splitCost || 0; // 👈 NEW: Capture Split Cost

  try {
    // 1. Check Ownership
    const existingSub = await prisma.subscription.findUnique({
      where: { id },
    });

    if (!existingSub || existingSub.userId !== session.user.id) {
      return { success: false, message: "Subscription not found" };
    }

    // 2. Handle Vendor Change
    let vendorId = existingSub.vendorId;
    let vendor = await prisma.vendor.findFirst({
      where: {
        name: { equals: name, mode: "insensitive" },
        userId: session.user.id,
      },
    });

    if (!vendor) {
      vendor = await prisma.vendor.create({
        data: { name, userId: session.user.id },
      });
    }
    vendorId = vendor.id;

    // 3. Recalculate Renewal
    const renewalDate = calculateRenewalDate(
      subData.startDate,
      subData.frequency
    );

    // 4. Update Database
    await prisma.subscription.update({
      where: { id },
      data: {
        vendorId: vendorId,
        cost: subData.cost,
        splitCost: splitCost, // 👈 UPDATING SPLIT COST
        currency: subData.currency,
        frequency: subData.frequency,
        startDate: subData.startDate,
        nextRenewalDate: renewalDate,
        isTrial: subData.isTrial,
        category: subData.category,
        status: status,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, message: "Subscription updated" };
  } catch (error) {
    console.error("Update Error:", error);
    return { success: false, message: "Failed to update" };
  }
}

// --- DELETE SUBSCRIPTION ---
export async function deleteSubscription(id: string): Promise<ActionResponse> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: "Unauthorized" };

  try {
    const sub = await prisma.subscription.findUnique({
      where: { id },
    });

    if (!sub || sub.userId !== session.user.id) {
      return { success: false, message: "Not found" };
    }

    await prisma.subscription.delete({ where: { id } });
    revalidatePath("/dashboard");
    return { success: true, message: "Subscription deleted." };
  } catch (error) {
    return { success: false, message: "Failed to delete subscription." };
  }
}

// --- HELPER ---
function calculateRenewalDate(startDate: Date, frequency: "MONTHLY" | "YEARLY") {
  const date = new Date(startDate);
  if (frequency === "MONTHLY") {
    date.setMonth(date.getMonth() + 1);
  } else {
    date.setFullYear(date.getFullYear() + 1);
  }
  return date;
}

// --- ARCHIVE SUBSCRIPTION ---
export async function archiveSubscription(id: string): Promise<ActionResponse> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: "Unauthorized" };

  try {
    await prisma.subscription.update({
      where: { id },
      data: { status: "CANCELLED" },
    });
    revalidatePath("/dashboard");
    revalidatePath("/archive");
    return { success: true, message: "Subscription archived." };
  } catch (error) {
    return { success: false, message: "Failed to archive." };
  }
}

// --- RESTORE SUBSCRIPTION ---
export async function restoreSubscription(id: string): Promise<ActionResponse> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: "Unauthorized" };

  try {
    await prisma.subscription.update({
      where: { id },
      data: { status: "ACTIVE" },
    });
    revalidatePath("/dashboard");
    revalidatePath("/archive");
    return { success: true, message: "Subscription restored." };
  } catch (error) {
    return { success: false, message: "Failed to restore." };
  }
}