"use client";

import React from "react";
import dayjs from "dayjs";
import { MoreHorizontal, Edit, Archive } from "lucide-react";
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
  if (data.length === 0) {
    return <div className="text-center py-10 text-muted-foreground">No subscriptions found.</div>;
  }

  return (
    // 👇 FIX: Changed from 'space-y-4' to a Grid Layout
    // - grid-cols-1: Default (Mobile)
    // - sm:grid-cols-2: Tablet (640px+) - Puts cards in a row
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {data.map((sub) => {
        const isTrial = sub.isTrial;
        const daysLeft = dayjs(sub.nextRenewalDate).diff(dayjs(), "day");

        return (
          <Card key={sub.id} className="border-border bg-card shadow-sm active:scale-[0.99] transition-transform h-full flex flex-col justify-between">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                {/* Left: Vendor & Category */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                    {sub.vendor.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-foreground truncate pr-2">{sub.vendor.name}</h3>
                    <p className="text-xs text-muted-foreground truncate">{sub.category}</p>
                  </div>
                </div>

                {/* Right: Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground hover:text-foreground">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(sub)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onArchive(sub.id)} className="text-destructive">
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