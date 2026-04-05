"use client";

import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onAdd: () => void;
}

export function SubscriptionsHeader({ onAdd }: HeaderProps) {
  return (
    <div className="relative overflow-hidden flex flex-col items-start justify-between gap-4 border-b border-border/40 pb-8 pt-2 md:flex-row md:items-center font-sans">
      
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          My <span className="bg-gradient-to-br from-primary to-primary/50 bg-clip-text text-transparent">Subscriptions</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Manage your recurring payments and track your spending.
        </p>
      </div>

      {/* Padded wrapper to prevent the glowing shadow from getting cut off */}
      <div className="w-full md:w-auto mt-4 md:mt-0 p-2 -m-2">
        <Button 
          onClick={onAdd} 
          className="group relative h-12 w-full overflow-hidden rounded-full bg-primary px-8 text-[15px] font-bold text-primary-foreground shadow-[0_0_20px_-5px_rgba(var(--primary),0.5)] transition-all duration-300 hover:shadow-[0_0_35px_-5px_rgba(var(--primary),0.7)] active:scale-95 md:w-auto cursor-pointer"
        >
          {/* Diagonal shine animation element */}
          <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(150%)]">
            <div className="relative h-full w-8 bg-white/20" />
          </div>
          
          <PlusCircle className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
          <span className="relative z-10 tracking-wide">Add Subscription</span>
        </Button>
      </div>
      
    </div>
  );
}