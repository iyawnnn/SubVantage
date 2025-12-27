"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Archive,
  Plus,
  CreditCard,
  Search,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { SubscriptionModal } from "./dashboard/SubscriptionModal";

interface SimpleSub {
  id: string;
  vendorName: string;
}

export function GlobalSpotlight({ subscriptions }: { subscriptions: SimpleSub[] }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);

  // Toggle with CMD+K
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={() => runCommand(() => router.push("/dashboard"))}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/archive"))}>
              <Archive className="mr-2 h-4 w-4" />
              <span>Archive</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setModalOpen(true))}>
              <Plus className="mr-2 h-4 w-4" />
              <span>Add Subscription</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Subscriptions">
            {subscriptions.map((sub) => (
              <CommandItem
                key={sub.id}
                onSelect={() => runCommand(() => router.push(`/subscriptions/${sub.id}`))}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                <span>{sub.vendorName}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <SubscriptionModal 
        opened={modalOpen} 
        close={() => setModalOpen(false)} 
        subToEdit={null} 
      />
    </>
  );
}