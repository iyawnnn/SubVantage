import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import SubscriptionDetailView from "@/components/subscriptions/SubscriptionDetailView";
import { getExchangeRates } from "@/lib/currency-helper";
import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

// 👇 REPLACED: Static metadata with Dynamic Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const session = await auth();
  const { id } = await params;

  if (!session?.user) {
    return { title: "Details | SubTrack" };
  }

  // Fetch just enough data to get the title
  const sub = await prisma.subscription.findUnique({
    where: { 
      id: id,
      userId: session.user.id 
    },
    include: { vendor: true },
  });

  if (!sub) {
    return { title: "Subscription Not Found | SubTrack" };
  }

  // Example: "GitHub | SubTrack"
  return {
    title: `${sub.vendor.name} | SubTrack`,
  };
}

export default async function SubscriptionPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/");

  const { id } = await params;

  // 1. Fetch User Settings
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { preferredCurrency: true }
  });
  
  const baseCurrency = user?.preferredCurrency || "USD";

  // 2. Fetch Subscription
  const sub = await prisma.subscription.findUnique({
    where: { 
      id: id,
      userId: session.user.id 
    },
    include: { vendor: true },
  });

  if (!sub) return notFound();

  // 3. Fetch Exchange Rates
  const rates = await getExchangeRates(baseCurrency);

  const serializedSub = {
    ...sub,
    cost: Number(sub.cost),
    splitCost: sub.splitCost ? Number(sub.splitCost) : 0,
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-4 pb-0">
      <SubscriptionDetailView 
        sub={serializedSub} 
        baseCurrency={baseCurrency} 
        rates={rates} 
      />
    </div>
  );
}