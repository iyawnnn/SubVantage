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

// --- ADD SUBSCRIPTION ---
export async function addSubscription(
  data: SubscriptionFormData
): Promise<ActionResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized. Please log in." };
  }

  // 1. Validate Input
  const validated = subscriptionSchema.safeParse(data);
  if (!validated.success) {
    console.error(
      "❌ Validation Errors:",
      validated.error.flatten().fieldErrors
    );

    return {
      success: false,
      message: "Validation failed",
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { name, website, ...subData } = validated.data;

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
    const renewalDate = calculateRenewalDate(subData.startDate, subData.frequency);

    await prisma.subscription.create({
      data: {
        cost: subData.cost,
        frequency: subData.frequency,
        startDate: subData.startDate,
        nextRenewalDate: renewalDate,
        isTrial: subData.isTrial,
        category: subData.category, // Pass Category
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

// --- NEW: UPDATE SUBSCRIPTION ---
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

  try {
    // 1. Check Ownership
    const existingSub = await prisma.subscription.findUnique({
      where: { id },
    });

    if (!existingSub || existingSub.userId !== session.user.id) {
      return { success: false, message: "Subscription not found" };
    }

    // 2. Handle Vendor Change
    // If the name changed, find or create the new vendor
    let vendorId = existingSub.vendorId;
    
    // We try to find the vendor matching the new name
    let vendor = await prisma.vendor.findFirst({
        where: { name: { equals: name, mode: "insensitive" }, userId: session.user.id }
    });

    // If it doesn't exist, create it
    if (!vendor) {
        vendor = await prisma.vendor.create({ data: { name, userId: session.user.id } });
    }
    vendorId = vendor.id;

    // 3. Recalculate Renewal
    const renewalDate = calculateRenewalDate(subData.startDate, subData.frequency);

    // 4. Update Database
    await prisma.subscription.update({
      where: { id },
      data: {
        vendorId: vendorId, // Link to potentially new vendor
        cost: subData.cost,
        frequency: subData.frequency,
        startDate: subData.startDate,
        nextRenewalDate: renewalDate,
        isTrial: subData.isTrial,
        category: subData.category,
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
      return {
        success: false,
        message: "Subscription not found or access denied.",
      };
    }

    await prisma.subscription.delete({ where: { id } });

    revalidatePath("/dashboard");
    return { success: true, message: "Subscription deleted." };
  } catch (error) {
    return { success: false, message: "Failed to delete subscription." };
  }
}

// --- HELPER FUNCTION ---
function calculateRenewalDate(startDate: Date, frequency: "MONTHLY" | "YEARLY") {
  const date = new Date(startDate);
  if (frequency === "MONTHLY") {
    date.setMonth(date.getMonth() + 1);
  } else {
    date.setFullYear(date.getFullYear() + 1);
  }
  return date;
}