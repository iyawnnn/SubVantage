import { Suspense } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { SearchWrapper } from "@/components/dashboard/SearchWrapper";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  // THE FOOLPROOF TRAP: The Node server reads the exact state. If they are false, kick them out.
  if ((session.user as any).is2faVerified === false) {
    redirect("/auth/verify-2fa");
  }

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