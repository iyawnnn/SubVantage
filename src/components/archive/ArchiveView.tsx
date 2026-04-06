"use client";

import React, { useState, useEffect, useOptimistic } from "react";
import { Search, ArrowUpDown, Wallet, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ArchiveHeader } from "./ArchiveHeader";
import { ArchiveTable } from "./ArchiveTable";
import { ArchiveCardList } from "./ArchiveCardList";
import { EmptyArchiveState } from "./EmptyArchiveState";
import { deleteSubscription, restoreSubscription } from "@/actions/subscription-actions";
import { formatCurrency } from "@/lib/currency-helper";

const ITEMS_PER_PAGE = 6;

interface ArchiveViewProps {
  initialData: any[];
  currency: string;
}

export default function ArchiveView({ initialData, currency }: ArchiveViewProps) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("RECENT");
  const [currentPage, setCurrentPage] = useState(1);

  const [optimisticSubs, setOptimisticSubs] = useOptimistic(
    initialData,
    (state: any[], idToRemove: string) => state.filter((sub) => sub.id !== idToRemove)
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sort]);

  const filteredData = React.useMemo(() => {
    let result = optimisticSubs.filter((sub) =>
      sub.vendor.name.toLowerCase().includes(search.toLowerCase())
    );

    result.sort((a, b) => {
      if (sort === "COST") {
        return b.cost - a.cost;
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    return result;
  }, [optimisticSubs, search, sort]);

  useEffect(() => {
    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [filteredData.length, currentPage]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleRestore = async (id: string) => {
    setOptimisticSubs(id);
    toast.promise(restoreSubscription(id), {
      loading: 'Restoring to active subscriptions...',
      success: 'Subscription successfully restored!',
      error: 'Failed to restore subscription.'
    });
  };

  const handleDelete = async (id: string) => {
    setOptimisticSubs(id);
    toast.promise(deleteSubscription(id), {
      loading: 'Permanently deleting...',
      success: 'Record permanently deleted.',
      error: 'Failed to delete record.'
    });
  };

  const totalSaved = optimisticSubs.reduce((acc, sub) => acc + sub.cost, 0);

  const categoryCounts = optimisticSubs.reduce((acc, sub) => {
    acc[sub.category] = (acc[sub.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topCategory = Object.keys(categoryCounts).length > 0 
    ? (Object.entries(categoryCounts) as [string, number][]).sort((a, b) => b[1] - a[1])[0][0] 
    : "-";

  return (
    <div className="space-y-8 pb-2">
      <ArchiveHeader />

      {/* UI FIX: Removed the optimisticSubs.length > 0 check so KPI cards always show, even when 0 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 pt-2">
        <div className="flex flex-col gap-1 rounded-2xl border border-border/40 bg-secondary/10 p-5 shadow-sm transition-all hover:bg-secondary/20">
          <span className="text-sm font-medium text-muted-foreground">Total Cancelled</span>
          <span className="text-3xl font-extrabold text-foreground">{optimisticSubs.length}</span>
        </div>

        <div className="flex flex-col gap-1 rounded-2xl border border-border/40 bg-secondary/10 p-5 shadow-sm transition-all hover:bg-secondary/20">
          <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Wallet className="h-4 w-4 text-emerald-500" />
            Monthly Savings
          </span>
          <span className="text-3xl font-extrabold text-emerald-500">
            {formatCurrency(totalSaved, currency)}
          </span>
        </div>

        <div className="flex flex-col gap-1 rounded-2xl border border-border/40 bg-secondary/10 p-5 shadow-sm transition-all hover:bg-secondary/20">
          <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Tag className="h-4 w-4 text-primary" />
            Top Cancelled Category
          </span>
          <span className="text-3xl font-extrabold text-foreground truncate">
            {topCategory}
          </span>
        </div>
      </div>

      <div className="sticky top-16 z-40 bg-background py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 border-b border-border/40 transition-all">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between w-full">
          <div className="relative w-full max-w-md mx-auto sm:mx-0 sm:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search archive..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-secondary/30 border-transparent focus:bg-background focus:border-primary/50 transition-all w-full"
            />
          </div>

          <div className="flex w-full max-w-md mx-auto sm:mx-0 sm:w-auto">
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-full sm:w-[220px] bg-secondary/30 border-transparent focus:ring-0 cursor-pointer">
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="h-4 w-4 opacity-50" />
                  <SelectValue placeholder="Sort Archive" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="RECENT">Recently Cancelled</SelectItem>
                <SelectItem value="COST">Highest Cost</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {filteredData.length === 0 ? (
        <EmptyArchiveState />
      ) : (
        <>
          <div className="hidden md:block rounded-xl border border-border/60 bg-card overflow-hidden">
            <ArchiveTable 
              data={paginatedData} 
              onRestore={handleRestore} 
              onDelete={handleDelete} 
            />
          </div>

          <div className="md:hidden">
            <ArchiveCardList 
              data={paginatedData} 
              onRestore={handleRestore} 
              onDelete={handleDelete} 
            />
          </div>

          {totalPages > 1 && (
            <div className="pt-2">
               <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(currentPage - 1)} 
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                     if (
                       totalPages > 7 && 
                       page !== 1 && 
                       page !== totalPages && 
                       (page < currentPage - 1 || page > currentPage + 1)
                     ) {
                       if (page === 2 || page === totalPages - 1) return <PaginationItem key={page}><PaginationEllipsis /></PaginationItem>;
                       return null;
                     }

                     return (
                      <PaginationItem key={page}>
                        <PaginationLink 
                          isActive={currentPage === page}
                          onClick={() => handlePageChange(page)}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                     );
                  })}

                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}