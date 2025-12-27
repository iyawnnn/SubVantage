"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Archive, 
  Search, 
  Menu, 
  Command 
} from "lucide-react";
import { UserMenu } from "./UserMenu";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetTitle,
  SheetDescription 
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function DashboardShell({ children, user }: { children: React.ReactNode; user: any }) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navLinks = [
    { link: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { link: "/archive", label: "Archive", icon: Archive },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* SOLID HEADER - No transparency/glass effect */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          
          <div className="flex items-center gap-8">
            <span className="text-xl font-bold tracking-tight text-primary">SubTrack</span>
            <nav className="hidden items-center gap-1 sm:flex">
              {navLinks.map((item) => {
                const isActive = pathname === item.link;
                return (
                  <Link
                    key={item.link}
                    href={item.link}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Trigger */}
            <button className="hidden w-64 items-center justify-between rounded-md border border-input bg-secondary/50 px-3 py-1.5 text-sm text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground sm:flex">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 opacity-50" />
                <span>Search...</span>
              </div>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>

            <UserMenu image={user?.image} name={user?.name} email={user?.email} />

            {/* Mobile Menu */}
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="sm:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-background border-border">
                <SheetTitle className="text-lg font-bold text-foreground">Navigation</SheetTitle>
                <SheetDescription className="sr-only">
                  Mobile navigation menu
                </SheetDescription>
                
                <div className="flex flex-col gap-4 mt-8">
                  {navLinks.map((item) => (
                    <Link
                      key={item.link}
                      href={item.link}
                      onClick={() => setIsMobileOpen(false)}
                      className="flex items-center gap-2 text-lg font-medium text-foreground hover:text-primary"
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 sm:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}