import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ArchiveView from "@/components/archive/ArchiveView";

export const metadata = {
  title: "Archive",
};

export default async function ArchivePage() {
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
        status: "CANCELLED"
      }, 
      include: { vendor: true },
      orderBy: { updatedAt: "desc" },
    })
  ]);

  const subs = rawSubs.map(sub => ({
    ...sub,
    cost: Number(sub.cost),
    splitCost: sub.splitCost ? Number(sub.splitCost) : 0, 
  }));

  const baseCurrency = user?.preferredCurrency || "USD";

  return (
    <div className="mx-auto max-w-[1600px] py-8 pb-0">
      <ArchiveView initialData={subs} currency={baseCurrency} />
    </div>
  );
}