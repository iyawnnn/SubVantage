"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; // 👈 Added Import
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Archive,
  Search,
  AlignRight,
  CreditCard,
} from "lucide-react";
import { motion } from "framer-motion";

import { UserMenu } from "./UserMenu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function DashboardShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: any;
}) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { link: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { link: "/subscriptions", label: "Subscriptions", icon: CreditCard },
    { link: "/archive", label: "Archive", icon: Archive },
  ];

  const openSpotlight = () => {
    const event = new KeyboardEvent("keydown", {
      key: "k",
      metaKey: true,
      ctrlKey: true,
      bubbles: true,
    });
    document.dispatchEvent(event);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/20">
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          "bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60",
          scrolled
            ? "border-b border-border/40 shadow-sm"
            : "border-b border-transparent"
        )}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* LEFT: Logo & Desktop Nav */}
          <div className="flex items-center gap-4 lg:gap-8">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              {/* 👇 FIX: Replaced SVG with logo.png */}
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-blue-600 shadow-lg shadow-primary/20 transition-all group-hover:shadow-primary/40 group-hover:scale-105 overflow-hidden">
                <Image 
                  src="/logo.png" 
                  alt="SubVantage Logo" 
                  width={36} 
                  height={36} 
                  className="object-cover"
                />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                SubVantage
              </span>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex relative">
              {navLinks.map((item) => {
                const isActive = pathname === item.link;
                return (
                  <Link
                    key={item.link}
                    href={item.link}
                    data-testid={`nav-${item.label.toLowerCase()}`}
                    className={cn(
                      "relative px-4 py-1.5 text-sm font-medium transition-colors z-10",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-primary/10 -z-10"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                    <div className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* RIGHT: Search & Actions */}
          <div className="flex items-center justify-end gap-2 sm:gap-4">
            <button
              onClick={openSpotlight}
              data-testid="btn-search-trigger"
              className="group hidden w-60 items-center justify-between rounded-full border border-border/50 bg-secondary/30 px-4 py-2 text-sm text-muted-foreground transition-all hover:bg-secondary/80 hover:border-border lg:flex cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 opacity-50 group-hover:opacity-100" />
                <span className="opacity-70 group-hover:opacity-100">
                  Search...
                </span>
              </div>
              <kbd className="pointer-events-none hidden h-5 select-none items-center justify-center gap-1 rounded border border-border bg-background/50 px-1.5 font-mono text-[10px] font-medium opacity-100 sm:inline-flex">
                <span className="text-xs relative top-[1px]">⌘</span>K
              </kbd>
            </button>

            <Button
              variant="ghost"
              size="icon"
              onClick={openSpotlight}
              className="lg:hidden text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <Search className="h-5 w-5" />
            </Button>

            <UserMenu
              image={user?.image}
              name={user?.name}
              email={user?.email}
            />

            {/* Mobile Menu Trigger */}
            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  data-testid="btn-mobile-menu"
                  className="lg:hidden text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                  suppressHydrationWarning
                >
                  <AlignRight className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="bg-background/95 backdrop-blur-2xl border-l border-border/50 w-[300px] sm:w-[400px]"
              >
                <SheetTitle className="flex items-center gap-2 text-lg font-bold text-foreground pb-4 border-b border-border/50">
                  {/* 👇 FIX: Replaced SVG in Mobile Menu with logo.png */}
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-blue-600 shadow-md overflow-hidden">
                    <Image 
                      src="/logo.png" 
                      alt="SubVantage Logo" 
                      width={32} 
                      height={32} 
                      className="object-cover"
                    />
                  </div>
                  Navigation
                </SheetTitle>
                <SheetDescription className="sr-only">
                  Mobile navigation
                </SheetDescription>

                <div className="flex flex-col gap-2 mt-6">
                  {navLinks.map((item) => {
                    const isActive = pathname === item.link;
                    return (
                      <Link
                        key={item.link}
                        href={item.link}
                        onClick={() => setIsMobileOpen(false)}
                        data-testid={`mobile-nav-${item.label.toLowerCase()}`}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all duration-200",
                          isActive
                            ? "bg-primary/10 text-primary shadow-sm"
                            : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}