"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
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

const ITEMS_PER_PAGE = 6;

export default function ArchiveView({ initialData }: { initialData: any[] }) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filteredData = initialData.filter((sub) =>
    sub.vendor.name.toLowerCase().includes(search.toLowerCase())
  );

  // 👇 FIX: Auto-redirect to previous page if current page becomes empty
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
    toast.promise(restoreSubscription(id), {
      loading: 'Restoring...',
      success: 'Subscription restored',
      error: 'Failed to restore'
    });
  };

  const handleDelete = async (id: string) => {
    toast.promise(deleteSubscription(id), {
      loading: 'Deleting...',
      success: 'Permanently deleted',
      error: 'Failed to delete'
    });
  };

  return (
    <div className="space-y-8">
      <ArchiveHeader />

      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-xl py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 border-b border-border/40 transition-all">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search archive..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-secondary/30 border-transparent focus:bg-background focus:border-primary/50 transition-all"
          />
        </div>
      </div>

      {filteredData.length === 0 ? (
        <EmptyArchiveState />
      ) : (
        <>
          <div className="hidden md:block rounded-xl border border-border/60 bg-card/50 shadow-sm overflow-hidden">
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
            <div className="pt-4 pb-8">
               <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(currentPage - 1)} 
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
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
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                     );
                  })}

                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
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