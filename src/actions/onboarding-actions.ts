"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { onboardingSchema } from "@/lib/validations/settings";

export async function finishOnboarding(data: { currency: string; notifications: boolean; twoFactorEnabled: boolean }) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const validated = onboardingSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: "Invalid configuration data provided." };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        preferredCurrency: validated.data.currency,
        emailNotifications: validated.data.notifications,
        isTwoFactorEnabled: validated.data.twoFactorEnabled,
        hasCompletedOnboarding: true,
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Onboarding error:", error);
    return { success: false, error: "Failed to save onboarding settings." };
  }
}