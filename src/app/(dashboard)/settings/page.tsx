import { auth } from "@/auth";
import { prisma } from "@/lib/prisma"; // 👈 Import prisma
import { redirect } from "next/navigation";
import SettingsView from "@/components/settings/SettingsView";

export const metadata = {
  title: "Settings | SubTrack",
};

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  // 👇 FIX: Fetch fresh user data from DB instead of relying on stale session
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) redirect("/");

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-8">
      {/* Pass the fresh user object */}
      <SettingsView user={user} />
    </div>
  );
}