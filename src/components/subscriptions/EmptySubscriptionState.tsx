"use client";

import React from "react";
import { CreditCard, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onAdd: () => void;
  isSearching: boolean;
}

export function EmptySubscriptionState({ onAdd, isSearching }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in duration-500">
      
      {/* Icon with Ring Effect */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
        <div className="relative h-20 w-20 bg-background border border-border/50 rounded-full flex items-center justify-center shadow-xl">
          <CreditCard className="h-9 w-9 text-primary/80" />
        </div>
      </div>

      <h3 className="text-2xl font-bold text-foreground mb-2">
        {isSearching ? "No matching subscriptions" : "No active subscriptions"}
      </h3>
      
      <p className="text-muted-foreground max-w-sm mx-auto mb-8 leading-relaxed">
        {isSearching 
          ? "We couldn't find any subscriptions matching your search or filters."
          : "You haven't added any subscriptions yet. Add your first one to start tracking your expenses."
        }
      </p>

      {/* Primary Action Button */}
      <Button 
        onClick={onAdd} 
        size="lg"
        className="gap-2 rounded-xl h-11 px-6 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
      >
        <Plus className="h-4 w-4" />
        Add Subscription
      </Button>
    </div>
  );
}