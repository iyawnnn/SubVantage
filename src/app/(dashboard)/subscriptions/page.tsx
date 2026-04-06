import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SubscriptionsView } from "@/components/subscriptions/SubscriptionsView";
import { getExchangeRates } from "@/lib/currency-helper"; 

export const metadata = {
  title: "Subscriptions",
};

export default async function SubscriptionsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  const [user, rawSubs] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { preferredCurrency: true }
    }),
    prisma.subscription.findMany({
      where: { 
        userId: session.user.id,
        status: "ACTIVE"
      }, 
      include: { vendor: true },
      orderBy: { nextRenewalDate: "asc" },
    })
  ]);

  const baseCurrency = user?.preferredCurrency || "USD";

  const rates = await getExchangeRates(baseCurrency);

  const subs = rawSubs.map(sub => ({
    ...sub,
    cost: Number(sub.cost),
    splitCost: sub.splitCost ? Number(sub.splitCost) : 0,
  }));

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-8 pb-0">
      <SubscriptionsView 
        initialData={subs} 
        rates={rates} 
        baseCurrency={baseCurrency} 
      />
    </div>
  );
}