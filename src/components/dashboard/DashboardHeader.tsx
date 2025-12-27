"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SubscriptionModal } from "./SubscriptionModal";

export function DashboardHeader() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Financial Overview</h2>
        <p className="text-muted-foreground">
          Track your recurring expenses in one place.
        </p>
      </div>
      
      <Button onClick={() => setOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" />
        Add Subscription
      </Button>

      <SubscriptionModal 
        opened={open} 
        close={() => setOpen(false)} 
        subToEdit={null} 
      />
    </div>
  );
}