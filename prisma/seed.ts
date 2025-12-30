import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting clean reset for test user...");

  const TEST_EMAIL = "test@example.com";
  const TEST_PASSWORD = "password123";

  // 1. Find the test user
  const existingUser = await prisma.user.findUnique({
    where: { email: TEST_EMAIL },
  });

  // 2. If they exist, WIPE their associated data (Subscriptions & Vendors)
  if (existingUser) {
    console.log(`🧹 Wiping subscriptions for ${TEST_EMAIL}...`);

    // Delete Subscriptions first (because they rely on Vendors)
    await prisma.subscription.deleteMany({
      where: { userId: existingUser.id },
    });

    // Delete Vendors
    await prisma.vendor.deleteMany({
      where: { userId: existingUser.id },
    });
  }

  // 3. Ensure the User Account itself exists (Create if missing, Update if exists)
  // We DO NOT recreate the subscriptions here anymore.
  const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 10);

  const user = await prisma.user.upsert({
    where: { email: TEST_EMAIL },
    update: {
      password: hashedPassword,
      name: "Test User",
      hasCompletedOnboarding: true, // Important for tests to skip modals
    },
    create: {
      email: TEST_EMAIL,
      password: hashedPassword,
      name: "Test User",
      image: "https://ui.shadcn.com/avatars/02.png",
      hasCompletedOnboarding: true,
      emailNotifications: false,
      preferredCurrency: "USD",
    },
  });

  console.log(`✅ User ${user.email} is ready with 0 subscriptions.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
