"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Archive, Info } from "lucide-react";
import dayjs from "dayjs";
import { toast } from "sonner"; // Using Sonner
import { motion, AnimatePresence } from "framer-motion";

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

import { SubscriptionModal } from "./SubscriptionModal";
import { formatCurrency, convertTo } from "@/lib/currency-helper";
import { archiveSubscription } from "@/actions/subscription-actions";

export function SubscriptionTable({
  data,
  rates,
  baseCurrency
}: {
  data: any[],
  rates: any,
  baseCurrency: string
}) {
  const router = useRouter();
  const [editingSub, setEditingSub] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleArchive = async (id: string) => {
    try {
      const result = await archiveSubscription(id);
      if (result.success) {
        toast.success("Subscription archived", {
          description: "Moved to graveyard."
        });
        router.refresh();
      } else {
        toast.error("Failed to archive");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleEdit = (sub: any) => {
    setEditingSub(sub);
    setModalOpen(true);
  };

  if (data.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
        No subscriptions found
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vendor</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Next Renewal</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {data.map((sub) => {
                const now = dayjs().startOf('day');
                const renewal = dayjs(sub.nextRenewalDate).startOf('day');
                const daysLeft = renewal.diff(now, "day");

                // Badge Logic
                let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "default";
                let badgeLabel = "Active";
                let badgeClass = "bg-green-500/15 text-green-700 dark:text-green-400 hover:bg-green-500/25";

                if (sub.isTrial) {
                   if (daysLeft < 0) {
                      badgeLabel = "Expired";
                      badgeClass = "bg-gray-500/15 text-gray-700 dark:text-gray-400";
                   } else if (daysLeft <= 3) {
                      badgeLabel = daysLeft === 0 ? "Expires Today" : `Expiring: ${daysLeft}d`;
                      badgeVariant = "destructive";
                      badgeClass = "";
                   } else {
                      badgeLabel = `Trial: ${daysLeft}d`;
                      badgeClass = "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400";
                   }
                }

                const isDifferentCurrency = sub.currency !== baseCurrency;
                const convertedCost = isDifferentCurrency
                  ? convertTo(sub.cost, sub.currency, baseCurrency, rates)
                  : null;

                return (
                  <motion.tr
                    key={sub.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <TableCell>
                      <Link href={`/subscriptions/${sub.id}`} className="font-medium hover:underline block">
                        {sub.vendor.name}
                      </Link>
                      <span className="text-xs text-muted-foreground">{sub.category}</span>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {formatCurrency(sub.cost, sub.currency)} / {sub.frequency === "MONTHLY" ? "mo" : "yr"}
                        </span>
                        {isDifferentCurrency && convertedCost && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            ≈ {formatCurrency(convertedCost, baseCurrency)}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger><Info className="h-3 w-3 opacity-50" /></TooltipTrigger>
                                <TooltipContent>Converted to {baseCurrency}</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>{dayjs(sub.nextRenewalDate).format("MMM D, YYYY")}</TableCell>
                    
                    <TableCell>
                      <Badge variant={badgeVariant} className={badgeClass}>{badgeLabel}</Badge>
                    </TableCell>

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(sub)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleArchive(sub.id)} className="text-red-600 focus:text-red-600">
                            <Archive className="mr-2 h-4 w-4" /> Archive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      <SubscriptionModal
        opened={modalOpen}
        close={() => { setModalOpen(false); setEditingSub(null); }}
        subToEdit={editingSub}
      />
    </>
  );
}