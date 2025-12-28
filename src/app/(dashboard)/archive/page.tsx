import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ArchiveView from "@/components/archive/ArchiveView";

export const metadata = {
  title: "Archive | SubTrack",
};

async function getData() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const rawSubs = await prisma.subscription.findMany({
    where: { 
      userId: session.user.id,
      status: "CANCELLED"
    }, 
    include: { vendor: true },
    orderBy: { updatedAt: "desc" },
  });

  return rawSubs.map(sub => ({
    ...sub,
    cost: Number(sub.cost),
    // 👇 FIX: Explicitly convert Decimal to Number
    splitCost: sub.splitCost ? Number(sub.splitCost) : 0, 
  }));
}

export default async function ArchivePage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  const subs = await getData();

  return (
    <div className="mx-auto max-w-[1600px] pb-0">
      <ArchiveView initialData={subs} />
    </div>
  );
}