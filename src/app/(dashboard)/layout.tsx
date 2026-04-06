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

  // Intercept unverified OAuth sessions when 2FA is enabled
  if ((session as any).is2faVerified === false) {
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