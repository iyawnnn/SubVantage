import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Archive } from "lucide-react";
import { getLiveRates } from "@/lib/exchange-rates";
import { ArchiveList } from "@/components/dashboard/ArchiveList";

async function getArchivedData(userId: string) {
  const data = await prisma.subscription.findMany({
    where: {
      userId: userId,
      status: "CANCELLED",
    },
    orderBy: { updatedAt: "desc" },
    include: { vendor: true },
  });

  // 👇 SERIALIZATION FIX: Convert Decimal to Number
  return data.map((sub) => ({
    id: sub.id,
    vendorName: sub.vendor?.name || sub.name, // Flatten for Client Component
    vendor: {
        name: sub.vendor?.name || sub.name,
        website: sub.vendor?.website
    },
    cost: Number(sub.cost),
    splitCost: sub.splitCost ? Number(sub.splitCost) : 0,
    currency: sub.currency,
    frequency: sub.frequency,
    category: sub.category,
    startDate: sub.startDate,
    nextRenewalDate: sub.nextRenewalDate,
    updatedAt: sub.updatedAt,
    isTrial: sub.isTrial,
  }));
}

export default async function ArchivePage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const [archivedSubs, rates] = await Promise.all([
    getArchivedData(session.user.id),
    getLiveRates(),
  ]);

  const baseCurrency = session.user.preferredCurrency || "USD";

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
          <Archive className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Graveyard</h1>
          <p className="text-muted-foreground">
            Subscriptions you have cancelled. Restore them anytime.
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card">
        <div className="p-6">
          <ArchiveList 
            data={archivedSubs} 
            rates={rates} 
            baseCurrency={baseCurrency} 
          />
        </div>
      </div>
    </div>
  );
}