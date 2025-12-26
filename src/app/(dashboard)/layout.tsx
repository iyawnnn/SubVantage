import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { GlobalSpotlight } from "@/components/GlobalSpotlight";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  // Fetch simple list for search
  const subs = session?.user?.id ? await prisma.subscription.findMany({
    where: { userId: session.user.id },
    select: { id: true, vendor: { select: { name: true } } }
  }) : [];

  const searchData = subs.map(s => ({ id: s.id, vendorName: s.vendor.name }));

  return (
    <>
      <GlobalSpotlight subscriptions={searchData} />
      <DashboardShell>{children}</DashboardShell>
    </>
  );
}