"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface UpdateSettingsData {
  preferredCurrency: string;
}

export async function updateUserSettings(data: UpdateSettingsData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" };
  }

  // 👇 Fix: Access property directly from the object
  const { preferredCurrency } = data;

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { preferredCurrency },
    });

    revalidatePath("/dashboard");
    revalidatePath("/settings");
    revalidatePath("/archive"); // Ensure currency updates everywhere
    
    return { success: true, message: "Settings updated successfully" };
  } catch (error) {
    return { success: false, message: "Failed to update settings" };
  }
}