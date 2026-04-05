import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      preferredCurrency: 'USD',
    },
  });

  const vendor = await prisma.vendor.upsert({
    where: {
      userId_name: {
        userId: user.id,
        name: 'Netflix',
      },
    },
    update: {},
    create: {
      name: 'Netflix',
      website: 'https://netflix.com',
      userId: user.id,
    },
  });

  await prisma.subscription.create({
    data: {
      userId: user.id,
      vendorId: vendor.id,
      cost: 15.99,
      currency: 'USD',
      frequency: 'MONTHLY',
      startDate: new Date(),
      nextRenewalDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      category: 'Entertainment',
      status: 'ACTIVE',
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });