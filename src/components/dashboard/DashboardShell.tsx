"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Archive,
  Search,
  AlignRight,
  CreditCard,
  Settings,
  LogOut,
  X, // 👈 Added X icon for the custom close button
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

const listContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const listItemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

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
    <div className="flex min-h-screen flex-col bg-background text-foreground font-sans selection:bg-primary/20">
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-200",
          scrolled
            ? "bg-background border-b border-border shadow-sm"
            : "bg-background border-b border-transparent",
        )}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 lg:gap-8">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="flex h-9 w-9 items-center justify-center bg-transparent transition-transform duration-300 group-hover:scale-105 overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="SubVantage primary application logo"
                  width={36}
                  height={36}
                  className="object-cover"
                />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                SubVantage
              </span>
            </Link>

            <nav className="hidden items-center gap-2 lg:flex relative">
              {navLinks.map((item) => {
                const isActive = pathname === item.link;
                return (
                  <Link
                    key={item.link}
                    href={item.link}
                    className={cn(
                      "relative px-4 py-2 text-sm font-semibold transition-colors z-10 rounded-full",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="desktop-nav-indicator"
                        className="absolute inset-0 rounded-full bg-primary/10 -z-10"
                        transition={{
                          type: "spring",
                          stiffness: 400,
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

          <div className="flex items-center justify-end gap-3 sm:gap-4">
            <button
              onClick={openSpotlight}
              className="group hidden h-10 w-64 items-center justify-between rounded-full border border-border bg-secondary/30 px-4 text-sm text-muted-foreground transition-all hover:bg-secondary/60 hover:border-border/80 lg:flex cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                <span className="opacity-70 group-hover:opacity-100 transition-opacity">
                  Search...
                </span>
              </div>
              <kbd className="pointer-events-none hidden h-5 select-none items-center justify-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>

            <Button
              variant="ghost"
              size="icon"
              onClick={openSpotlight}
              className="lg:hidden h-10 w-10 text-muted-foreground hover:text-foreground cursor-pointer rounded-full"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Open search spotlight</span>
            </Button>

            <div className="hidden sm:flex h-10 items-center justify-center">
              <UserMenu
                image={user?.image}
                name={user?.name}
                email={user?.email}
              />
            </div>

            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden h-10 w-10 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer rounded-full"
                  suppressHydrationWarning
                >
                  <AlignRight className="h-6 w-6" />
                  <span className="sr-only">Open mobile navigation menu</span>
                </Button>
              </SheetTrigger>
              
              <SheetContent
                side="right"
                // Using [&>button]:hidden to remove the default absolute close button
                className="bg-background border-l border-border w-full sm:w-[350px] p-0 [&>button]:hidden overflow-y-auto"
              >
                <div className="flex flex-col h-full p-6 sm:p-8 min-h-screen">
                  
                  {/* Custom Header Container for Perfect Alignment */}
                  <div className="flex items-center justify-between pb-6 border-b border-border">
                    <SheetTitle className="flex items-center gap-3 text-2xl font-bold text-foreground">
                      <div className="flex h-10 w-10 items-center justify-center bg-transparent overflow-hidden">
                        <Image
                          src="/logo.png"
                          alt="SubVantage primary application logo"
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      SubVantage
                    </SheetTitle>
                    
                    {/* Custom Close Button */}
                    <button
                      onClick={() => setIsMobileOpen(false)}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                    >
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close navigation menu</span>
                    </button>
                  </div>

                  <SheetDescription className="sr-only">
                    Mobile navigation menu
                  </SheetDescription>

                  <div className="mt-6 mb-2">
                    <button
                      onClick={() => {
                        setIsMobileOpen(false);
                        openSpotlight();
                      }}
                      className="flex w-full items-center gap-3 rounded-xl border border-border bg-secondary/30 px-4 py-3 text-left text-base font-medium text-muted-foreground transition-all hover:bg-secondary/60 hover:text-foreground cursor-pointer"
                    >
                      <Search className="h-5 w-5 opacity-70" />
                      <span>Search applications...</span>
                    </button>
                  </div>

                  <motion.div 
                    variants={listContainerVariants}
                    initial="hidden"
                    animate="show"
                    className="flex flex-col gap-3 mt-4 flex-1"
                  >
                    {navLinks.map((item) => {
                      const isActive = pathname === item.link;
                      return (
                        <motion.div key={item.link} variants={listItemVariants}>
                          <Link
                            href={item.link}
                            onClick={() => setIsMobileOpen(false)}
                            className={cn(
                              "group flex items-center gap-4 rounded-xl px-4 py-4 text-base font-semibold transition-all duration-200 border",
                              isActive
                                ? "bg-primary/10 border-primary/20 text-primary"
                                : "bg-transparent border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                            )}
                          >
                            <item.icon className={cn(
                              "h-5 w-5 transition-transform duration-200",
                              !isActive && "group-hover:scale-110"
                            )} />
                            {item.label}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </motion.div>

                  <div className="mt-auto pt-6 border-t border-border flex flex-col gap-2">
                    <Link
                      href="/settings"
                      onClick={() => setIsMobileOpen(false)}
                      className="group flex items-center gap-4 rounded-xl px-4 py-4 text-base font-semibold text-muted-foreground transition-all duration-200 hover:bg-muted/50 hover:text-foreground"
                    >
                      <Settings className="h-5 w-5 transition-transform duration-200 group-hover:rotate-45" />
                      Settings
                    </Link>
                    
                    <button
                      onClick={() => signOut({ callbackUrl: "/auth/login" })}
                      className="group flex w-full items-center gap-4 rounded-xl px-4 py-4 text-base font-semibold text-red-500 transition-all duration-200 hover:bg-red-500/10 cursor-pointer text-left"
                    >
                      <LogOut className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-1" />
                      Log out
                    </button>

                    <div className="flex items-center gap-4 p-4 mt-2 rounded-2xl bg-muted/40 border border-border">
                      {user?.image ? (
                        <img 
                          src={user.image} 
                          alt={`User profile picture for ${user?.name || "current user"}`} 
                          className="h-10 w-10 rounded-full object-cover border border-border/50" 
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-lg">
                          {user?.name?.charAt(0) || "U"}
                        </div>
                      )}
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-bold text-foreground truncate">
                          {user?.name || "Account User"}
                        </span>
                        <span className="text-xs font-medium text-muted-foreground truncate">
                          {user?.email || "No email provided"}
                        </span>
                      </div>
                    </div>
                  </div>
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