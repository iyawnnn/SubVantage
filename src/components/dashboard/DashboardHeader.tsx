"use client";

import { useState, useEffect } from "react";
import { CalendarDays, PlusCircle } from "lucide-react";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { SubscriptionModal } from "@/components/dashboard/SubscriptionModal";
import { motion } from "framer-motion";

export function DashboardHeader({ user }: { user: any }) {
  const [open, setOpen] = useState(false);
  const [greeting, setGreeting] = useState("Welcome back");

  const firstName = user?.name?.split(" ")[0] || "there";

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-border/40 pb-8 pt-4 font-satoshi"
      >
        <div className="space-y-4 w-full md:w-auto">
          
          <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary backdrop-blur-md shadow-[0_0_15px_rgba(var(--primary),0.15)]">
            <CalendarDays className="h-4 w-4" />
            <span className="tracking-wide">{dayjs().format("MMMM D, YYYY")}</span>
            <span className="text-primary/40">•</span>
            <span className="text-foreground/80 font-medium tracking-wide">Your active subscriptions</span>
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            {greeting}, <span className="bg-gradient-to-br from-primary to-primary/50 bg-clip-text text-transparent">{firstName}</span>
          </h1>
        </div>

        <div className="w-full md:w-auto mt-4 md:mt-0 p-2 -m-2">
           <Button 
             onClick={() => setOpen(true)} 
             className="group relative h-12 w-full overflow-hidden rounded-full bg-primary px-8 text-[15px] font-bold text-primary-foreground shadow-[0_0_20px_-5px_rgba(var(--primary),0.5)] transition-all duration-300 hover:shadow-[0_0_35px_-5px_rgba(var(--primary),0.7)] active:scale-95 md:w-auto cursor-pointer"
           >
             <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(150%)]">
               <div className="relative h-full w-8 bg-white/20" />
             </div>
             
             <PlusCircle className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
             <span className="relative z-10 tracking-wide">Add Subscription</span>
           </Button>
        </div>
      </motion.div>

      <SubscriptionModal opened={open} close={() => setOpen(false)} />
    </>
  );
}