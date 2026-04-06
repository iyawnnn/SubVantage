"use client";

import React from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { ArrowRight, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, convertTo } from "@/lib/currency-helper";

export function SubscriptionCarousel({ 
  data, 
  currency, 
  rates,
  onAdd 
}: { 
  data: any[], 
  currency: string, 
  rates: any,
  onAdd?: () => void 
}) {
  const sorted = [...data]
    .filter(sub => !sub.isTrial)
    .sort((a, b) => {
      const getMonthlyVal = (sub: any) => {
         const amount = Number(sub.cost);
         const converted = convertTo(amount, sub.currency, currency, rates);
         return sub.frequency === "YEARLY" ? converted / 12 : converted;
      };
      return getMonthlyVal(b) - getMonthlyVal(a);
    })
    .slice(0, 8);

  return (
    <div className="w-full space-y-4 font-sans mt-10 relative">
      
      <style dangerouslySetInnerHTML={{ __html: `
        .hide-horizontal-scroll::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
          -webkit-appearance: none !important;
        }
      `}} />

      <div className="flex items-center justify-between px-1">
        <h3 className="text-xl font-bold tracking-tight text-foreground">Top Subscriptions</h3>
        {data.length > 0 && (
          <Link 
            href="/subscriptions" 
            className="group flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
          >
            View All <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>

      <div 
        className="hide-horizontal-scroll flex gap-4 overflow-x-auto pt-2 pb-8 px-1 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        
        {sorted.length === 0 && (
           <button 
             onClick={onAdd} 
             className="w-full sm:w-auto min-w-[300px] snap-center text-left"
           >
             <Card className="group relative h-full overflow-hidden border border-dashed border-primary/30 bg-primary/5 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 cursor-pointer">
               <CardContent className="p-6 flex flex-col items-center justify-center h-[180px] gap-4 text-primary/70 group-hover:text-primary">
                 <div className="rounded-full bg-background p-4 shadow-sm border border-primary/20 transition-transform duration-300 group-hover:scale-110">
                   <Plus className="h-6 w-6" />
                 </div>
                 <span className="font-semibold tracking-wide text-sm">
                   {data.length > 0 ? "No active paid subscriptions" : "Add your first subscription"}
                 </span>
               </CardContent>
             </Card>
           </button>
        )}

        {sorted.map((sub, i) => {
          const startDate = dayjs(sub.startDate);
          const today = dayjs();
          const isFuture = startDate.isAfter(today, "day");

          let nextRenewal = dayjs(sub.nextRenewalDate);
          const cycleUnit = sub.frequency === "MONTHLY" ? "month" : "year";

          if (isFuture) {
            nextRenewal = startDate;
          } else {
            if (nextRenewal.isBefore(today, "day")) {
              const diff = today.diff(nextRenewal, cycleUnit);
              nextRenewal = nextRenewal.add(diff, cycleUnit);
              if (nextRenewal.isBefore(today, "day")) {
                nextRenewal = nextRenewal.add(1, cycleUnit);
              }
            }
          }

          return (
            <Link href={`/subscriptions/${sub.id}`} key={sub.id} className="min-w-[250px] sm:min-w-[280px] snap-center">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -6 }}
                className="h-full"
              >
                <Card className="group relative h-full overflow-hidden border border-border/60 bg-gradient-to-br from-background to-secondary/10 shadow-sm transition-all duration-300 hover:border-primary/50 cursor-pointer">
                  <CardContent className="p-7 flex flex-col justify-between h-[180px]">
                    <div>
                      <h4 className="font-extrabold text-foreground tracking-tight truncate text-xl mb-3 transition-colors duration-300 group-hover:text-primary">
                        {sub.vendor.name}
                      </h4>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/60">
                          {formatCurrency(sub.cost, sub.currency)}
                        </span>
                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
                          {sub.frequency === "MONTHLY" ? "/mo" : "/yr"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between text-xs font-semibold border-t border-border/50 pt-4">
                      <span className="text-muted-foreground uppercase tracking-wider text-[10px]">Next Renewal</span>
                      <span className="text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                        {nextRenewal.format("MMM D")}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          );
        })}
        
        {sorted.length > 0 && (
          <Link href="/subscriptions" className="min-w-[80px] flex items-center justify-center snap-center px-2">
             <motion.div 
               whileHover={{ scale: 1.1 }} 
               whileTap={{ scale: 0.95 }}
               className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-card hover:bg-primary hover:border-transparent hover:text-primary-foreground text-muted-foreground transition-colors duration-300 shadow-sm"
             >
                <ArrowRight className="h-6 w-6" />
             </motion.div>
          </Link>
        )}
      </div>
    </div>
  );
}