import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SubscriptionsView } from "@/components/subscriptions/SubscriptionsView";
import { getExchangeRates } from "@/lib/currency-helper"; 

export const metadata = {
  title: "Subscriptions | SubTrack",
};

export default async function SubscriptionsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { preferredCurrency: true }
  });

  const baseCurrency = user?.preferredCurrency || "USD";

  const rawSubs = await prisma.subscription.findMany({
    where: { 
      userId: session.user.id,
      // 👇 FIX: Removed "TRIAL". Only "ACTIVE" is valid in your Enum.
      // Trials are handled by the separate 'isTrial' boolean field.
      status: "ACTIVE"
    }, 
    include: { vendor: true },
    orderBy: { nextRenewalDate: "asc" },
  });

  const subs = rawSubs.map(sub => ({
    ...sub,
    cost: Number(sub.cost),
    splitCost: sub.splitCost ? Number(sub.splitCost) : 0,
  }));

  const rates = await getExchangeRates(baseCurrency);

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