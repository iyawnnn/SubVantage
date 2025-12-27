import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getLiveRates } from "@/lib/exchange-rates";
import { SubscriptionsView } from "@/components/subscriptions/SubscriptionsView";

export const metadata = {
  title: "My Subscriptions | SubTrack",
};

async function getData() {
  const session = await auth();
  if (!session?.user?.id) return { subs: [], user: null, rates: {} };

  const rawSubs = await prisma.subscription.findMany({
    where: { 
      userId: session.user.id,
      status: { not: "CANCELLED" }
    }, 
    include: { vendor: true },
    orderBy: { nextRenewalDate: "asc" },
  });

  const subs = rawSubs.map(sub => ({
    ...sub,
    cost: Number(sub.cost),
    splitCost: sub.splitCost ? Number(sub.splitCost) : 0,
  }));

  const rates = await getLiveRates();
  return { subs, user: session.user, rates };
}

export default async function SubscriptionsPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  const { subs, user, rates } = await getData();
  const baseCurrency = user?.preferredCurrency || "USD";

  return (
    <div className="mx-auto max-w-[1600px] pb-0">
      {/* We now use the Client Component to manage everything */}
      <SubscriptionsView 
        initialData={subs} 
        rates={rates} 
        baseCurrency={baseCurrency} 
      />
    </div>
  );
}