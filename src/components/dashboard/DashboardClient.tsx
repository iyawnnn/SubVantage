"use client";

import React, { useState, useOptimistic } from "react";
import { SubscriptionCarousel } from "./SubscriptionCarousel";
import { SubscriptionModal } from "./SubscriptionModal";

interface DashboardClientProps {
  initialSubs: any[];
  baseCurrency: string;
  rates: any;
}

export function DashboardClient({ initialSubs, baseCurrency, rates }: DashboardClientProps) {
  const [modalOpen, setModalOpen] = useState(false);
  
  const [optimisticSubs, addOptimisticSub] = useOptimistic(
    initialSubs,
    (state: any[], newSub: any) => [newSub, ...state],
  );

  return (
    <>
      <div className="w-full pb-8">
        <SubscriptionCarousel
          data={optimisticSubs}
          currency={baseCurrency}
          rates={rates}
          onAdd={() => setModalOpen(true)} 
        />
      </div>

      <SubscriptionModal
        opened={modalOpen}
        close={() => setModalOpen(false)}
        subToEdit={null}
        addOptimisticSub={addOptimisticSub}
      />
    </>
  );
}