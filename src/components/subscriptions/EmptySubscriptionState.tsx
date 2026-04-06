"use client";

import { PlusCircle, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptySubscriptionStateProps {
  onAdd: () => void;
  isSearching: boolean;
}

export function EmptySubscriptionState({ onAdd, isSearching }: EmptySubscriptionStateProps) {
  // If the user is just searching and found nothing, show a different message
  if (isSearching) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-border/60 rounded-2xl bg-secondary/10 mt-8">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-6 shadow-sm border border-border/50">
          <SearchX className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2 tracking-tight">No results found</h3>
        <p className="text-muted-foreground max-w-sm mx-auto text-sm leading-relaxed mb-6">
          We couldn't find any subscriptions matching your search criteria.
        </p>
      </div>
    );
  }

  // The default empty state for a new user
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-border/60 rounded-2xl bg-secondary/10 mt-8">
      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 shadow-sm border border-primary/20">
        <PlusCircle className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2 tracking-tight">No Active Subscriptions</h3>
      <p className="text-muted-foreground max-w-sm mx-auto text-sm leading-relaxed mb-6">
        You are not tracking any active subscriptions yet. Add your first recurring expense to start analyzing your spending.
      </p>
      <Button 
        onClick={onAdd}
        className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 shadow-sm cursor-pointer"
      >
        Add First Subscription
      </Button>
    </div>
  );
}