import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Settings } from "lucide-react";
import { SettingsForm } from "@/components/dashboard/SettingsForm";
import { Separator } from "@/components/ui/separator";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Settings className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences and application defaults.
          </p>
        </div>
      </div>
      
      <Separator />

      <div className="grid gap-6">
        <SettingsForm user={user} />
      </div>
    </div>
  );
}