"use server";

import { prisma } from "@/lib/prisma";
import { hash, compare } from "bcryptjs";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { auth } from "@/auth";
import { verify } from "otplib";

export async function register(data: { name: string; email: string; password: string }) {
  const { name, email, password } = data;

  if (!email || !password || !name) {
    return { success: false, message: "Missing required fields" };
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, message: "Email already in use" };
    }

    const hashedPassword = await hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return { success: true, message: "Account created! Please log in." };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, message: "Something went wrong during registration." };
  }
}

export async function loginWithCredentials(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const code = formData.get("code") as string;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (user && user.password) {
      const passwordsMatch = await compare(password, user.password);
      if (passwordsMatch && user.isTwoFactorEnabled && !code) {
        return { twoFactor: true };
      }
    }

    await signIn("credentials", {
      email,
      password,
      code,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }
    throw error;
  }
}

export async function verifyOAuthTwoFactorAction(code: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, message: "Unauthorized" };

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || !user.twoFactorSecret) return { success: false, message: "2FA not configured" };

  const result = await verify({ token: code, secret: user.twoFactorSecret });
  
  if (result.valid) {
    return { success: true };
  }
  
  return { success: false, message: "Invalid code." };
}