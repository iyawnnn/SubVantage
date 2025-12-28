"use client";

import React from "react";
import dayjs from "dayjs";
import { MoreHorizontal, Edit, Archive, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/lib/currency-helper";

interface CardListProps {
  data: any[];
  onEdit: (sub: any) => void;
  onArchive: (id: string) => void;
}

export function SubscriptionCardList({ data, onEdit, onArchive }: CardListProps) {
  const router = useRouter();

  if (data.length === 0) {
    return <div className="text-center py-10 text-muted-foreground">No subscriptions found.</div>;
  }

  return (
    <div className="flex flex-col space-y-4">
      {data.map((sub) => {
        const isTrial = sub.isTrial;
        const daysLeft = dayjs(sub.nextRenewalDate).diff(dayjs(), "day");

        return (
          <Card 
            key={sub.id} 
            // 👇 FIX: Whole card is clickable
            onClick={() => router.push(`/subscriptions/${sub.id}`)}
            className="group border-border bg-card shadow-sm active:scale-[0.99] transition-all cursor-pointer hover:border-primary/30"
          >
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                {/* Left: Vendor & Category */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    {sub.vendor.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-foreground truncate pr-2 flex items-center gap-2">
                      {sub.vendor.name}
                      {/* 👇 FIX: Subtle Chevron indicates navigation */}
                      <ChevronRight className="h-3 w-3 text-muted-foreground opacity-50" />
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">{sub.category}</p>
                  </div>
                </div>

                {/* Right: Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      // 👇 FIX: Stop propagation here too
                      onClick={(e) => e.stopPropagation()}
                      className="h-8 w-8 -mr-2 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(sub); }} className="cursor-pointer">
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onArchive(sub.id); }} className="text-destructive cursor-pointer">
                      <Archive className="mr-2 h-4 w-4" /> Archive
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-end justify-between mt-auto">
                {/* Cost */}
                <div>
                   <p className="text-xs text-muted-foreground uppercase font-semibold">Cost</p>
                   <p className="text-xl font-bold text-foreground">
                     {formatCurrency(sub.cost, sub.currency)}
                     <span className="text-xs font-normal text-muted-foreground">/{sub.frequency === "MONTHLY" ? "mo" : "yr"}</span>
                   </p>
                </div>

                {/* Status / Due Date */}
                <div className="text-right">
                  <Badge variant={isTrial ? "secondary" : "outline"} className="mb-1">
                    {isTrial ? "Trial" : "Active"}
                  </Badge>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">
                    Due {dayjs(sub.nextRenewalDate).format("MMM D")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}