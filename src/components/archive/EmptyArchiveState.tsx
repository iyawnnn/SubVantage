"use client";

import React from "react";
import Link from "next/link";
import { Archive, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyArchiveState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in duration-500">
      
      {/* Icon with Ring Effect */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-violet-500/20 blur-xl rounded-full" />
        <div className="relative h-20 w-20 bg-background border border-border/50 rounded-full flex items-center justify-center shadow-xl">
          <Archive className="h-9 w-9 text-muted-foreground/50" />
        </div>
      </div>

      <h3 className="text-2xl font-bold text-foreground mb-2">
        No archived subscriptions
      </h3>
      <p className="text-muted-foreground max-w-sm mx-auto mb-8 leading-relaxed">
        Your subscription history is clean. When you cancel or archive a subscription, it will appear here for safekeeping.
      </p>

      <Button asChild variant="outline" className="gap-2 rounded-xl h-11 px-6 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all">
        <Link href="/subscriptions">
          View Active Subscriptions
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}