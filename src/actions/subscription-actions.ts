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
    console.error("Validation Errors:", validated.error.flatten().fieldErrors);
    return {
      success: false,
      message: "Validation failed",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { name, website, ...subData } = validated.data;
  
  // Handle fields that might be optional or missing in older schemas
  const status = (subData as any).status || "ACTIVE"; 
  const splitCost = (subData as any).splitCost || 0;

  try {
    // 2. Find or Create Vendor with Strict User Isolation
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
        splitCost: splitCost,
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
  const splitCost = (subData as any).splitCost || 0;

  try {
    // 1. Check Ownership Securely
    const existingSub = await prisma.subscription.findFirst({
      where: { 
        id: id,
        userId: session.user.id 
      },
    });

    if (!existingSub) {
      return { success: false, message: "Subscription not found or unauthorized" };
    }

    // 2. Handle Vendor Change Securely
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

    // 4. Update Database using updateMany for Guaranteed Isolation
    const result = await prisma.subscription.updateMany({
      where: { 
        id: id,
        userId: session.user.id 
      },
      data: {
        vendorId: vendorId,
        cost: subData.cost,
        splitCost: splitCost,
        currency: subData.currency,
        frequency: subData.frequency,
        startDate: subData.startDate,
        nextRenewalDate: renewalDate,
        isTrial: subData.isTrial,
        category: subData.category,
        status: status,
      },
    });

    if (result.count === 0) {
      return { success: false, message: "Failed to update record" };
    }

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
    // deleteMany enforces user isolation at the database level
    const result = await prisma.subscription.deleteMany({
      where: { 
        id: id,
        userId: session.user.id 
      },
    });

    if (result.count === 0) {
      return { success: false, message: "Not found or unauthorized" };
    }

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
    const result = await prisma.subscription.updateMany({
      where: { 
        id: id,
        userId: session.user.id 
      },
      data: { status: "CANCELLED" },
    });

    if (result.count === 0) {
      return { success: false, message: "Not found or unauthorized" };
    }

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
    const result = await prisma.subscription.updateMany({
      where: { 
        id: id,
        userId: session.user.id 
      },
      data: { status: "ACTIVE" },
    });

    if (result.count === 0) {
      return { success: false, message: "Not found or unauthorized" };
    }

    revalidatePath("/dashboard");
    revalidatePath("/archive");
    return { success: true, message: "Subscription restored." };
  } catch (error) {
    return { success: false, message: "Failed to restore." };
  }
}