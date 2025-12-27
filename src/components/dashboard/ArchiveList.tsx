"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RestoreButton } from "./RestoreButton";
import { DeleteButton } from "./DeleteButton";
import { formatCurrency, convertTo } from "@/lib/currency-helper";
import dayjs from "dayjs";

interface ArchiveListProps {
  data: any[];
  rates: any;
  baseCurrency: string;
}

export function ArchiveList({ data, rates, baseCurrency }: ArchiveListProps) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
        <p>No archived subscriptions found.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Vendor</TableHead>
          <TableHead>Previous Cost</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Cancelled Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((sub) => {
           const isDifferent = sub.currency !== baseCurrency;
           const converted = isDifferent 
             ? convertTo(sub.cost, sub.currency, baseCurrency, rates) 
             : sub.cost;

           return (
            <TableRow key={sub.id}>
              <TableCell className="font-medium">
                {/* Fallback to sub.name if vendorName is missing */}
                {sub.vendorName || sub.vendor?.name || sub.name}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                    <span>{formatCurrency(sub.cost, sub.currency)}</span>
                    {isDifferent && (
                        <span className="text-xs text-muted-foreground">
                            ≈ {formatCurrency(converted, baseCurrency)}
                        </span>
                    )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{sub.category}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {dayjs(sub.updatedAt).format("MMM D, YYYY")}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <RestoreButton id={sub.id} />
                  <DeleteButton id={sub.id} />
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}