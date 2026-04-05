"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Archive,
  Plus,
  CreditCard,
  ArrowRight
} from "lucide-react";
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

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
      <CommandDialog 
        open={open} 
        onOpenChange={setOpen}
        // 👇 Transforms the default close button to match the sidebar's circular design
        className="w-[90vw] sm:max-w-lg border-primary/20 shadow-2xl shadow-primary/10 bg-popover/95 backdrop-blur-xl [&>button]:flex [&>button]:h-8 [&>button]:w-8 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:bg-muted/50 [&>button]:text-muted-foreground hover:[&>button]:bg-muted hover:[&>button]:text-foreground [&>button]:top-2 [&>button]:right-3 [&>button]:opacity-100 focus:[&>button]:ring-0"
      >
        <VisuallyHidden>
          <DialogTitle>Global Search</DialogTitle>
        </VisuallyHidden>
        
        {/* 👇 Added pr-12 to prevent typed text from hiding under the new button */}
        <CommandInput 
          placeholder="Type a command or search..." 
          className="h-12 text-base pr-12"
        />

        <CommandList className="max-h-[350px] overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
            No results found.
          </CommandEmpty>
          
          <CommandGroup heading="Suggestions" className="px-2 py-2 text-muted-foreground">
            <CommandItem 
              onSelect={() => runCommand(() => router.push("/dashboard"))}
              className="aria-selected:bg-primary/10 aria-selected:text-primary rounded-md my-1"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </CommandItem>
            
            <CommandItem 
              onSelect={() => runCommand(() => router.push("/archive"))}
              className="aria-selected:bg-primary/10 aria-selected:text-primary rounded-md my-1"
            >
              <Archive className="mr-2 h-4 w-4" />
              <span>Archive</span>
            </CommandItem>
            
            <CommandItem 
              onSelect={() => runCommand(() => setModalOpen(true))}
              className="aria-selected:bg-primary/10 aria-selected:text-primary rounded-md my-1"
            >
              <Plus className="mr-2 h-4 w-4" />
              <span>Add Subscription</span>
            </CommandItem>
          </CommandGroup>
          
          <CommandSeparator className="bg-border/50" />
          
          <CommandGroup heading="Subscriptions" className="px-2 py-2 text-muted-foreground">
            {subscriptions.map((sub) => (
              <CommandItem
                key={sub.id}
                onSelect={() => runCommand(() => router.push(`/subscriptions/${sub.id}`))}
                className="aria-selected:bg-primary/10 aria-selected:text-primary rounded-md my-1 group justify-between"
              >
                <div className="flex items-center">
                  <CreditCard className="mr-2 h-4 w-4 opacity-70 group-aria-selected:text-primary" />
                  <span>{sub.vendorName}</span>
                </div>
                <ArrowRight className="h-3 w-3 opacity-0 -translate-x-2 transition-all group-aria-selected:opacity-100 group-aria-selected:translate-x-0" />
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
        
        <div className="border-t border-border/40 px-4 py-2 text-[10px] text-muted-foreground flex justify-between items-center bg-muted/20">
           <span>Navigate with arrows</span>
           <span className="bg-background/50 px-1.5 py-0.5 rounded border border-border/50">↵ Enter</span>
        </div>

      </CommandDialog>

      <SubscriptionModal 
        opened={modalOpen} 
        close={() => setModalOpen(false)} 
        subToEdit={null} 
      />
    </>
  );
}