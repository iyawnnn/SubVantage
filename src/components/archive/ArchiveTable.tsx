"use client";

import React from "react";
import dayjs from "dayjs";
import { MoreHorizontal, RotateCcw, Trash2 } from "lucide-react";
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
import { formatCurrency } from "@/lib/currency-helper";

interface ArchiveTableProps {
  data: any[];
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ArchiveTable({ data, onRestore, onDelete }: ArchiveTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent border-border bg-muted/20">
          <TableHead>Vendor</TableHead>
          <TableHead>Previous Cost</TableHead>
          <TableHead>Ended On</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((sub) => (
          <TableRow key={sub.id} className="border-b border-border hover:bg-muted/50 transition-colors">
            <TableCell>
              <div className="font-medium text-foreground">{sub.vendor.name}</div>
              <div className="text-xs text-muted-foreground">{sub.category}</div>
            </TableCell>
            
            <TableCell>
               <span className="font-medium text-muted-foreground decoration-border">
                  {formatCurrency(sub.cost, sub.currency)}
               </span>
               <span className="text-xs text-muted-foreground ml-1">/ {sub.frequency === "MONTHLY" ? "mo" : "yr"}</span>
            </TableCell>
            
            <TableCell className="text-muted-foreground text-sm">
                {sub.endDate ? dayjs(sub.endDate).format("MMM D, YYYY") : "N/A"}
            </TableCell>
            
            <TableCell>
              <Badge variant="secondary" className="bg-muted text-muted-foreground hover:bg-muted">
                {sub.status}
              </Badge>
            </TableCell>
            
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onRestore(sub.id)} className="cursor-pointer">
                    <RotateCcw className="mr-2 h-4 w-4" /> Restore
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(sub.id)} className="text-red-500 focus:text-red-500 cursor-pointer">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Forever
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}