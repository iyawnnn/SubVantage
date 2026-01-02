"use client";

import React from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { ArrowRight, CreditCard, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, convertTo } from "@/lib/currency-helper";

export function SubscriptionCarousel({ 
  data, 
  currency, 
  rates 
}: { 
  data: any[], 
  currency: string, 
  rates: any 
}) {
  // 👇 UPDATED: Filter out Trials first, then Sort by Normalized Monthly Cost
  const sorted = [...data]
    .filter(sub => !sub.isTrial) // 👈 HIDE TRIALS from Top List
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
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-lg font-bold text-foreground">Top Subscriptions</h3>
        {data.length > 0 && (
          <Link 
            href="/subscriptions" 
            className="group flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            View All <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>

      <div className="flex gap-4 overflow-x-auto pt-4 pb-6 px-1 snap-x snap-mandatory [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden">
        
        {/* EMPTY STATE (If no paid subs exist) */}
        {sorted.length === 0 && (
           <Link href="#" className="w-full sm:w-auto min-w-[300px] snap-center">
             <Card className="h-full border-dashed border-border bg-card/30 hover:border-primary/50 hover:bg-card/50 transition-all cursor-pointer group">
               <CardContent className="p-6 flex flex-col items-center justify-center h-[160px] gap-3 text-muted-foreground group-hover:text-primary">
                 <div className="rounded-full bg-primary/10 p-4 transition-transform group-hover:scale-110">
                   <Plus className="h-6 w-6" />
                 </div>
                 <span className="font-medium">
                   {data.length > 0 ? "No active paid subscriptions" : "Add your first subscription"}
                 </span>
               </CardContent>
             </Card>
           </Link>
        )}

        {/* CARDS */}
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
            <Link href={`/subscriptions/${sub.id}`} key={sub.id} className="min-w-[240px] sm:min-w-[280px] snap-center">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -8 }}
                className="h-full"
              >
                <Card className="h-full border-border bg-card shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/50 transition-all cursor-pointer">
                  <CardContent className="p-5 flex flex-col justify-between h-[170px]">
                    <div className="flex items-start justify-between">
                      <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      {/* Badge Removed: Since we filter trials, we don't need the trial badge here anymore */}
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-foreground truncate text-lg mb-1">{sub.vendor.name}</h4>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-extrabold text-foreground">
                          {formatCurrency(sub.cost, sub.currency)}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                          {sub.frequency === "MONTHLY" ? "/mo" : "/yr"}
                        </span>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Renewal</span>
                        <span className="font-semibold text-foreground bg-secondary/50 px-2 py-1 rounded-md">
                          {nextRenewal.format("MMM D")}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          );
        })}
        
        {/* VIEW ALL BUTTON */}
        {sorted.length > 0 && (
          <Link href="/subscriptions" className="min-w-[80px] flex items-center justify-center snap-center px-2">
             <motion.div 
               whileHover={{ scale: 1.1 }} 
               whileTap={{ scale: 0.95 }}
               className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-card hover:bg-primary hover:border-primary hover:text-white text-muted-foreground transition-all shadow-sm"
             >
                <ArrowRight className="h-6 w-6" />
             </motion.div>
          </Link>
        )}
      </div>
    </div>
  );
}