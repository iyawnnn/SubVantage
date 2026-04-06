import { Suspense } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { SearchWrapper } from "@/components/dashboard/SearchWrapper";
import { auth } from "@/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Middleware guarantees only authenticated, verified users reach this point.
  // We only return null as a type-safety fallback.
  if (!session?.user) return null;

  return (
    <>
      <Suspense fallback={null}>
        <SearchWrapper />
      </Suspense>

      <DashboardShell user={session.user}>
        {children}
      </DashboardShell>
    </>
  );
}