"use client";

import { Archive } from "lucide-react";

export function EmptyArchiveState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-border/60 rounded-2xl bg-secondary/10 mt-8">
      <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-6 shadow-sm border border-border/50">
        <Archive className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2 tracking-tight">No Archived Records</h3>
      <p className="text-muted-foreground max-w-sm mx-auto text-sm leading-relaxed">
        Your archive is currently empty. Subscriptions that you cancel or delete will be securely preserved here for your historical records.
      </p>
    </div>
  );
}