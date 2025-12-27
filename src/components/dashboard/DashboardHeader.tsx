"use client";

import { useState, useEffect } from "react";
import { Plus, CalendarDays } from "lucide-react";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { SubscriptionModal } from "@/components/dashboard/SubscriptionModal";
import { cn } from "@/lib/utils";

export function DashboardHeader({ user }: { user: any }) {
  const [open, setOpen] = useState(false);
  const [greeting, setGreeting] = useState("Welcome back");

  const firstName = user?.name?.split(" ")[0] || "there";

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  return (
    <>
      <div className="relative overflow-hidden flex flex-col items-center text-center gap-6 md:flex-row md:items-end md:justify-between md:text-left border-b border-border/40 pb-8 pt-2">
        
        <div className="absolute right-0 top-0 -z-10 h-32 w-96 -translate-y-10 translate-x-10 bg-primary/20 blur-[100px] opacity-50 pointer-events-none" />

        <div className="space-y-2 relative z-10 w-full md:w-auto">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">{firstName}</span>
          </h1>
          
          <div className="flex items-center justify-center md:justify-start gap-3 text-muted-foreground">
            <div className="flex items-center gap-1.5 rounded-md bg-secondary/50 px-2.5 py-1 text-xs font-medium border border-border/50">
               <CalendarDays className="h-3.5 w-3.5" />
               <span>{dayjs().format("MMMM D, YYYY")}</span>
            </div>
            <span className="hidden md:inline text-sm">•</span>
            <span className="hidden md:inline text-lg">Here is your financial pulse.</span>
          </div>
        </div>

        <div className="relative z-10 w-full md:w-auto">
           <Button 
             onClick={() => setOpen(true)} 
             size="lg" 
             className={cn(
               "h-12 rounded-xl shadow-xl shadow-primary/20 font-semibold",
               "bg-gradient-to-r from-primary to-violet-600 text-white border-0",
               "hover:scale-[1.02] hover:shadow-primary/30 transition-all duration-300",
               "w-full md:w-auto px-8 cursor-pointer" // 👈 Added cursor-pointer explicitly
             )}
           >
             <Plus className="mr-2 h-5 w-5" />
             Add Subscription
           </Button>
        </div>
      </div>

      <SubscriptionModal opened={open} close={() => setOpen(false)} />
    </>
  );
}