import { auth } from "@/auth";
import { prisma } from "@/lib/prisma"; 
import { redirect } from "next/navigation";
import SettingsView from "@/components/settings/SettingsView";

export const metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) redirect("/");

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-8">
      <SettingsView user={user} />
    </div>
  );
}