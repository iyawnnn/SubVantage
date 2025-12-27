"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { SubscriptionTable } from "@/components/dashboard/SubscriptionTable";
import { SubscriptionModal } from "@/components/dashboard/SubscriptionModal";
import { SubscriptionsHeader } from "./SubscriptionsHeader";
import { SubscriptionStats } from "./SubscriptionStats";
import { SubscriptionCardList } from "./SubscriptionCardList";
import { archiveSubscription } from "@/actions/subscription-actions";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 6;

export function SubscriptionsView({ initialData, rates, baseCurrency }: any) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [sort, setSort] = useState("RENEWAL"); 
  const [currentPage, setCurrentPage] = useState(1);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, sort]);

  const handleEdit = (sub: any) => {
    setEditingSub(sub);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingSub(null);
    setModalOpen(true);
  };

  const handleArchive = async (id: string) => {
    toast.promise(archiveSubscription(id), {
       loading: 'Archiving...',
       success: 'Subscription archived',
       error: 'Failed to archive'
    });
  };

  const filteredData = React.useMemo(() => {
    let result = [...initialData];

    if (search) {
      result = result.filter(s => 
        s.vendor.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "ALL") {
      result = result.filter(s => s.category === category);
    }

    result.sort((a, b) => {
      if (sort === "COST") {
        return b.cost - a.cost;
      }
      return new Date(a.nextRenewalDate).getTime() - new Date(b.nextRenewalDate).getTime();
    });

    return result;
  }, [initialData, search, category, sort]);

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

  return (
    <div className="space-y-8">
      <SubscriptionsHeader onAdd={handleAdd} />

      <SubscriptionStats subs={initialData} rates={rates} baseCurrency={baseCurrency} />

      {/* Controls */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-xl py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 border-b border-border/40 transition-all">
         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
             
             {/* Search */}
             <div className="relative w-full sm:flex-1 sm:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search subscriptions..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-secondary/30 border-transparent focus:bg-background focus:border-primary/50 transition-all"
                />
             </div>

             {/* Filters */}
             <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Select value={category} onValueChange={setCategory}>
                  {/* 👇 FIX: Added 'cursor-pointer' to SelectTrigger */}
                  <SelectTrigger className="w-full sm:w-[180px] bg-secondary/30 border-transparent focus:ring-0 cursor-pointer">
                     <div className="flex items-center gap-2 truncate">
                       <Filter className="h-4 w-4 opacity-50 flex-shrink-0" />
                       <span className="truncate"><SelectValue placeholder="Category" /></span>
                     </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Categories</SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                    <SelectItem value="Personal">Personal</SelectItem>
                    <SelectItem value="Work">Work</SelectItem>
                    <SelectItem value="Utilities">Utilities</SelectItem>
                    <SelectItem value="Health">Health</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Dev Tools">Dev Tools</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sort} onValueChange={setSort}>
                   {/* 👇 FIX: Added 'cursor-pointer' to SelectTrigger */}
                  <SelectTrigger className="w-full sm:w-[160px] bg-secondary/30 border-transparent focus:ring-0 cursor-pointer">
                     <div className="flex items-center gap-2">
                       <ArrowUpDown className="h-4 w-4 opacity-50" />
                       <SelectValue placeholder="Sort" />
                     </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RENEWAL">Next Bill</SelectItem>
                    <SelectItem value="COST">Highest Cost</SelectItem>
                  </SelectContent>
                </Select>
             </div>
         </div>
      </div>

      <div className="hidden md:block rounded-xl border border-border/60 bg-card/50 shadow-sm overflow-hidden">
        <SubscriptionTable 
          data={paginatedData} 
          rates={rates} 
          baseCurrency={baseCurrency} 
          onEdit={handleEdit}
          onArchive={handleArchive}
        />
      </div>

      <div className="md:hidden">
        <SubscriptionCardList 
          data={paginatedData} 
          onEdit={handleEdit} 
          onArchive={handleArchive} 
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

      <SubscriptionModal 
        opened={modalOpen} 
        close={() => setModalOpen(false)} 
        subToEdit={editingSub} 
      />
    </div>
  );
}