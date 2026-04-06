"use client";

import { cn } from "@/lib/utils";

export function ArchiveHeader() {
  return (
    <div className="relative overflow-hidden flex flex-col items-start justify-between gap-4 border-b border-border/40 pb-8 pt-2 md:flex-row md:items-center font-sans">
      
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Subscription <span className="bg-gradient-to-br from-primary to-primary/50 bg-clip-text text-transparent">Archive</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          History of your cancelled and inactive subscriptions.
        </p>
      </div>

      {/* UI FIX: This invisible spacer mimics the exact dimensions of the "Add Subscription" button on the Subscriptions page.
        This forces the Flexbox container to the identical height, ensuring the H1 text perfectly aligns with where it starts on the other page. 
      */}
      <div className="w-full md:w-auto mt-4 md:mt-0 p-2 -m-2 opacity-0 pointer-events-none select-none hidden md:block" aria-hidden="true">
        <div className="h-12 w-[180px]" />
      </div>
      
    </div>
  );
}