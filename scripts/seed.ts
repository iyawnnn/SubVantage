import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const myEmail = "iannmacabulos@gmail.com";

  // Find existing user or create a new one
  let user = await prisma.user.findUnique({
    where: { email: myEmail },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: myEmail,
        name: "Ian Macabulos",
        preferredCurrency: "PHP",
        hasCompletedOnboarding: true,
      },
    });
    console.log(`Created new user for: ${myEmail}`);
  }

  // Clear existing mock data attached to your account to prevent duplicates
  await prisma.subscription.deleteMany({
    where: { userId: user.id },
  });

  // Calculate some dynamic dates relative to today (April 2026) for realism
  const today = new Date();
  
  const addDays = (days: number) => {
    const date = new Date(today);
    date.setDate(date.getDate() + days);
    return date;
  };

  const mockSubscriptions = [
    // Your specific requested data
    {
      vendorName: "Cloudflare",
      category: "Infrastructure",
      cost: 13.66,
      currency: "USD",
      frequency: "YEARLY",
      isTrial: false,
      startDate: new Date("2025-12-31"),
      nextRenewalDate: new Date("2026-12-31"),
    },
    {
      vendorName: "Spotify",
      category: "Entertainment",
      cost: 279.00,
      currency: "PHP",
      frequency: "MONTHLY",
      isTrial: false,
      startDate: new Date("2026-03-08"),
      nextRenewalDate: new Date("2026-04-08"),
    },
    // Developer & Design Tools
    {
      vendorName: "Vercel Pro",
      category: "Development",
      cost: 20.00,
      currency: "USD",
      frequency: "MONTHLY",
      isTrial: false,
      startDate: new Date("2025-10-15"),
      nextRenewalDate: addDays(10), // Renews in 10 days
    },
    {
      vendorName: "GitHub Copilot",
      category: "Development",
      cost: 100.00,
      currency: "USD",
      frequency: "YEARLY",
      isTrial: false,
      startDate: new Date("2025-06-01"),
      nextRenewalDate: new Date("2026-06-01"),
    },
    {
      vendorName: "Figma Professional",
      category: "Design",
      cost: 15.00,
      currency: "USD",
      frequency: "MONTHLY",
      isTrial: true,
      startDate: addDays(-5), // Trial started 5 days ago
      nextRenewalDate: addDays(9), // Trial ends in 9 days
    },
    // Lifestyle & Entertainment
    {
      vendorName: "Netflix Premium",
      category: "Entertainment",
      cost: 549.00,
      currency: "PHP",
      frequency: "MONTHLY",
      isTrial: false,
      startDate: new Date("2024-01-20"),
      nextRenewalDate: addDays(15), 
    },
    {
      vendorName: "Amazon Prime Video",
      category: "Entertainment",
      cost: 149.00,
      currency: "PHP",
      frequency: "MONTHLY",
      isTrial: false,
      startDate: new Date("2025-11-02"),
      nextRenewalDate: addDays(27),
    },
    {
      vendorName: "ChatGPT Plus",
      category: "Productivity",
      cost: 20.00,
      currency: "USD",
      frequency: "MONTHLY",
      isTrial: false,
      startDate: new Date("2025-08-12"),
      nextRenewalDate: addDays(7),
    },
    {
      vendorName: "Canva Pro",
      category: "Design",
      cost: 2390.00,
      currency: "PHP",
      frequency: "YEARLY",
      isTrial: false,
      startDate: new Date("2025-02-14"),
      nextRenewalDate: new Date("2027-02-14"),
    }
  ];

  for (const sub of mockSubscriptions) {
    await prisma.subscription.create({
      data: {
        userId: user.id,
        cost: sub.cost,
        currency: sub.currency,
        frequency: sub.frequency as "MONTHLY" | "YEARLY",
        category: sub.category,
        isTrial: sub.isTrial,
        startDate: sub.startDate,
        nextRenewalDate: sub.nextRenewalDate,
        status: "ACTIVE",
        vendor: {
          connectOrCreate: {
            where: { name: sub.vendorName },
            create: { name: sub.vendorName },
          }
        }
      }
    });
  }

  console.log("Successfully seeded SubVantage database with rich mock data.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });