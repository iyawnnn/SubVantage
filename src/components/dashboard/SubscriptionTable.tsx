"use client";

import React from "react";
import dayjs from "dayjs";
import { MoreHorizontal, Info, Edit, Archive, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { formatCurrency, convertTo } from "@/lib/currency-helper";

interface TableProps {
  data: any[];
  rates: any;
  baseCurrency: string;
  onEdit: (sub: any) => void;
  onArchive: (id: string) => void;
}

export function SubscriptionTable({ data, rates, baseCurrency, onEdit, onArchive }: TableProps) {
  const router = useRouter();

  if (data.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-muted-foreground">
        No matching subscriptions found.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent border-border bg-muted/20">
          <TableHead>Vendor</TableHead>
          <TableHead>Cost</TableHead>
          <TableHead>Next Renewal</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[100px] text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((sub) => {
          const isDifferentCurrency = sub.currency !== baseCurrency;
          const convertedCost = isDifferentCurrency
            ? convertTo(sub.cost, sub.currency, baseCurrency, rates)
            : null;

          const badgeVariant = sub.isTrial ? "secondary" : "outline";

          return (
            <TableRow
              key={sub.id}
              // 👇 FIX: Whole row is clickable
              onClick={() => router.push(`/subscriptions/${sub.id}`)}
              className="group border-b border-border hover:bg-muted/50 transition-all cursor-pointer relative"
            >
              <TableCell>
                <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {sub.vendor.name}
                </div>
                <div className="text-xs text-muted-foreground">{sub.category}</div>
              </TableCell>
              
              <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">
                      {formatCurrency(sub.cost, sub.currency)}
                      <span className="text-xs text-muted-foreground ml-1 font-normal">/ {sub.frequency === "MONTHLY" ? "mo" : "yr"}</span>
                    </span>
                    
                    {isDifferentCurrency && convertedCost && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <span>≈ {formatCurrency(convertedCost, baseCurrency)}</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-3 w-3 opacity-50 hover:opacity-100" />
                            </TooltipTrigger>
                            <TooltipContent>
                              Converted to {baseCurrency}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    )}
                  </div>
              </TableCell>
              
              <TableCell className="text-muted-foreground text-sm">
                  {dayjs(sub.nextRenewalDate).format("MMM D, YYYY")}
                  <div className="text-[10px] opacity-70">
                    {dayjs(sub.nextRenewalDate).diff(dayjs(), "day")} days left
                  </div>
              </TableCell>
              
              <TableCell>
                <Badge variant={badgeVariant}>
                  {sub.isTrial ? "Trial" : "Active"}
                </Badge>
              </TableCell>
              
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {/* 👇 FIX: Chevron appears on hover to indicate 'Click me' */}
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        // 👇 FIX: stopPropagation prevents row click when opening menu
                        onClick={(e) => e.stopPropagation()} 
                        className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(sub); }} className="cursor-pointer">
                        <Edit className="mr-2 h-4 w-4" /> Edit Subscription
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onArchive(sub.id); }} className="text-destructive focus:text-destructive cursor-pointer">
                        <Archive className="mr-2 h-4 w-4" /> Archive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}