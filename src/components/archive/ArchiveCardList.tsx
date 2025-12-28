"use client";

import React from "react";
import dayjs from "dayjs";
import { MoreHorizontal, RotateCcw, Trash2 } from "lucide-react";
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

interface ArchiveCardListProps {
  data: any[];
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ArchiveCardList({ data, onRestore, onDelete }: ArchiveCardListProps) {
  return (
    <div className="flex flex-col space-y-4">
      {data.map((sub) => (
        <Card key={sub.id} className="border-border bg-card/50 shadow-sm opacity-80 hover:opacity-100 transition-opacity">
          <CardContent className="p-5">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold text-lg shrink-0 grayscale">
                  {sub.vendor.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-foreground truncate pr-2">{sub.vendor.name}</h3>
                  <p className="text-xs text-muted-foreground truncate">{sub.category}</p>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground hover:text-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onRestore(sub.id)}>
                    <RotateCcw className="mr-2 h-4 w-4" /> Restore
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(sub.id)} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-end justify-between mt-auto">
              <div>
                 <p className="text-xs text-muted-foreground uppercase font-semibold">Previous Cost</p>
                 <p className="text-lg font-medium text-muted-foreground line-through decoration-border/50">
                   {formatCurrency(sub.cost, sub.currency)}
                 </p>
              </div>

              <div className="text-right">
                <Badge variant="secondary" className="mb-1 bg-muted text-muted-foreground">
                  {sub.status}
                </Badge>
                <p className="text-xs text-muted-foreground whitespace-nowrap">
                  Ended {sub.endDate ? dayjs(sub.endDate).format("MMM D, YYYY") : "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}