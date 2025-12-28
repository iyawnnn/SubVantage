"use client";

import { cn } from "@/lib/utils";

export function ArchiveHeader() {
  return (
    <div className="relative overflow-hidden flex flex-col items-start justify-between gap-4 border-b border-border/40 pb-8 pt-2">
      
      {/* Glow Effect */}
      <div className="absolute right-0 top-0 -z-10 h-32 w-96 -translate-y-10 translate-x-10 bg-violet-500/20 blur-[100px] opacity-50 pointer-events-none" />

      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Subscription <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">Archive</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          History of your cancelled and inactive subscriptions.
        </p>
      </div>
    </div>
  );
}