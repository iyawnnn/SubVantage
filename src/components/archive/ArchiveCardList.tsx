"use client";

import React from "react";
import dayjs from "dayjs";
import { MoreHorizontal, RotateCcw, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/lib/currency-helper";

interface ArchiveCardListProps {
  data: any[];
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ArchiveCardList({ data, onRestore, onDelete }: ArchiveCardListProps) {
  return (
    <div className="flex flex-col space-y-4">
      {data.map((sub) => (
        <Card key={sub.id} className="relative overflow-hidden border-border/40 bg-secondary/10 shadow-sm transition-all hover:bg-secondary/20 hover:border-border/60">
          <CardContent className="p-5">
            
            {/* Top Row: Icon, Context, & Actions */}
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold text-xl shrink-0 grayscale opacity-80 border border-border/50">
                  {sub.vendor.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-foreground leading-tight">{sub.vendor.name}</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[11px] font-semibold text-muted-foreground opacity-80 bg-background/60 px-2 py-0.5 rounded border border-border/40">
                      {sub.category}
                    </span>
                    <span className="text-[11px] font-semibold text-muted-foreground opacity-80 bg-background/60 px-2 py-0.5 rounded border border-border/40">
                      {sub.frequency === 'MONTHLY' ? 'Monthly' : 'Yearly'}
                    </span>
                  </div>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground hover:text-foreground cursor-pointer">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background border-border/50 shadow-xl">
                  <DropdownMenuItem onClick={() => onRestore(sub.id)} className="cursor-pointer font-medium py-2">
                    <RotateCcw className="mr-2 h-4 w-4 text-emerald-500" /> Restore Record
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(sub.id)} className="cursor-pointer text-red-500 font-medium hover:bg-red-500/10 hover:text-red-500 focus:text-red-500 focus:bg-red-500/10 py-2">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Permanently
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Bottom Row: Advanced Pricing & Status */}
            <div className="mt-6 flex items-end justify-between pt-4 border-t border-border/20">
              <div className="flex flex-col gap-0.5">
                 <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Previous Rate</p>
                 <div className="flex items-baseline gap-1">
                   <p className="text-2xl font-black text-muted-foreground/60 line-through decoration-muted-foreground/40">
                     {formatCurrency(sub.cost, sub.currency)}
                   </p>
                   <span className="text-xs font-bold text-muted-foreground/50 line-through">
                     /{sub.frequency === 'MONTHLY' ? 'mo' : 'yr'}
                   </span>
                 </div>
              </div>

              <div className="flex flex-col items-end gap-2.5">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  <span className="text-[10px] text-red-500 uppercase font-bold tracking-widest">
                    {sub.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-semibold">
                  Ended: {sub.updatedAt ? dayjs(sub.updatedAt).format("MMM D, YYYY") : "-"}
                </p>
              </div>
            </div>

          </CardContent>
        </Card>
      ))}
    </div>
  );
}