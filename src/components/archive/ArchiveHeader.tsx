"use client";

import { cn } from "@/lib/utils";

export function ArchiveHeader() {
  return (
    <div className="relative overflow-hidden flex flex-col items-center text-center justify-between gap-4 border-b border-border/40 pb-8 pt-2 md:flex-row md:items-center md:text-left font-sans">
      
      <div className="space-y-1 w-full md:w-auto">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Subscription <span className="bg-gradient-to-br from-primary to-primary/50 bg-clip-text text-transparent">Archive</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          History of your cancelled and inactive subscriptions.
        </p>
      </div>

      <div className="w-full md:w-auto mt-4 md:mt-0 p-2 -m-2 opacity-0 pointer-events-none select-none hidden md:block" aria-hidden="true">
        <div className="h-12 w-[180px]" />
      </div>
      
    </div>
  );
}