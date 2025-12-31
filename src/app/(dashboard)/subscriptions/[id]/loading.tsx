import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function SubscriptionDetailLoading() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* 🔙 Navigation Skeleton */}
      <div className="flex items-center gap-2">
        <ArrowLeft className="h-4 w-4 text-muted-foreground/50" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* ✨ Hero Header Skeleton */}
      <div className="rounded-3xl border border-border/40 bg-secondary/30 p-8 shadow-sm">
         <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
            <div className="flex items-center gap-4 md:gap-6">
               {/* Icon */}
               <Skeleton className="h-16 w-16 md:h-24 md:w-24 rounded-2xl" />
               <div className="min-w-0 flex-1 space-y-3">
                  {/* Title & Badge */}
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                  {/* Category */}
                  <Skeleton className="h-4 w-24" />
               </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2 mt-4 md:mt-0">
               {/* Cost Display */}
               <div className="flex flex-col items-start md:items-end space-y-2">
                   <Skeleton className="h-4 w-12" />
                   <div className="flex items-baseline gap-2">
                     <Skeleton className="h-10 w-32" />
                     <Skeleton className="h-6 w-8" />
                   </div>
               </div>
               {/* Actions */}
               <div className="flex gap-1 mt-2">
                  <Skeleton className="h-9 w-9 rounded-md" />
                  <Skeleton className="h-9 w-9 rounded-md" />
               </div>
            </div>
         </div>
      </div>

      {/* 📊 The Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Current Cycle Card */}
        <div className="col-span-1 md:col-span-2 rounded-xl border border-border/50 bg-card/50 p-6 space-y-4">
           <Skeleton className="h-4 w-32" />
           <div className="flex justify-between items-end">
              <div className="space-y-2">
                 <Skeleton className="h-8 w-40" />
                 <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
           </div>
           <Skeleton className="h-3 w-full rounded-full" />
           <div className="flex justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-16" />
           </div>
        </div>

        {/* Yearly Cost Card */}
        <div className="rounded-xl border border-border/50 bg-card/50 p-6 space-y-3">
           <Skeleton className="h-4 w-32" />
           <Skeleton className="h-8 w-32" />
           <Skeleton className="h-3 w-40" />
        </div>

        {/* Lifetime Spend Card */}
        <div className="rounded-xl border border-border/50 bg-card/50 p-6 space-y-3">
           <Skeleton className="h-4 w-32" />
           <Skeleton className="h-8 w-32" />
           <Skeleton className="h-3 w-40" />
        </div>

        {/* Details Card */}
        <div className="col-span-1 md:col-span-2 rounded-xl border border-border/50 bg-card/50 p-6 space-y-6">
           <Skeleton className="h-4 w-48" />
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                   <Skeleton className="h-3 w-24" />
                   <Skeleton className="h-6 w-32" />
                </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
}