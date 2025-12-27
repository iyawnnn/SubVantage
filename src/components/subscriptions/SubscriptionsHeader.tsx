"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onAdd: () => void;
}

export function SubscriptionsHeader({ onAdd }: HeaderProps) {
  return (
    <div className="relative overflow-hidden flex flex-col items-start justify-between gap-4 border-b border-border/40 pb-8 pt-2 md:flex-row md:items-center">
      
      {/* Glow Effect */}
      <div className="absolute right-0 top-0 -z-10 h-32 w-96 -translate-y-10 translate-x-10 bg-primary/20 blur-[100px] opacity-50 pointer-events-none" />

      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          My <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">Subscriptions</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Manage your recurring payments and track your spending.
        </p>
      </div>

      <Button 
        onClick={onAdd} 
        size="lg" 
        className={cn(
          "h-12 rounded-xl shadow-xl shadow-primary/20 font-semibold",
          "bg-gradient-to-r from-primary to-violet-600 text-white border-0",
          "hover:scale-[1.02] hover:shadow-primary/30 transition-all duration-300",
          "w-full md:w-auto px-8 cursor-pointer"
        )}
      >
        <Plus className="mr-2 h-5 w-5" />
        Add Subscription
      </Button>
    </div>
  );
}