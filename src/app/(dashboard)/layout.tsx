import { Suspense } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { SearchWrapper } from "@/components/dashboard/SearchWrapper";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Verify2FAScreen } from "@/components/auth/Verify2FAScreen";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  if ((session.user as any).is2faVerified === false) {
    return <Verify2FAScreen />;
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