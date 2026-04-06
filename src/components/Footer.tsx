"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

export function Footer() {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  // Hide on authentication routes
  if (pathname?.startsWith("/auth")) {
    return null;
  }

  return (
    <footer
      className={cn(
        "relative border-t py-6 md:py-8 transition-colors mt-auto",
        isLandingPage
          ? "bg-[#050505] border-white/10 text-zinc-400"
          : "bg-background/80 border-border/40 text-muted-foreground backdrop-blur-xl"
      )}
    >
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

      {/* UI FIX: Exactly matches the classes used in DashboardShell.tsx for perfect vertical alignment */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-medium">
          
          <div className="flex items-center order-3 md:order-1">
            <span>&copy; {new Date().getFullYear()} SubVantage. All rights reserved.</span>
          </div>

          <nav className="flex items-center gap-6 order-1 md:order-2">
            <Link 
              href="/privacy" 
              className={cn(
                "transition-colors", 
                isLandingPage ? "hover:text-white" : "hover:text-foreground"
              )}
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms" 
              className={cn(
                "transition-colors", 
                isLandingPage ? "hover:text-white" : "hover:text-foreground"
              )}
            >
              Terms of Service
            </Link>
            <Link 
              href="/support" 
              className={cn(
                "transition-colors", 
                isLandingPage ? "hover:text-white" : "hover:text-foreground"
              )}
            >
              Contact Support
            </Link>
          </nav>

          <div className="flex items-center order-2 md:order-3">
            <span className="mr-1.5">Developed by</span>
            <a
              href="https://iansebastian.dev"
              target="_blank"
              rel="noreferrer"
              className="group relative flex items-center pr-6" // Added pr-6 to give the absolute rocket room to fly in
            >
              <span className="font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent transition-opacity group-hover:opacity-80 relative z-10">
                Ian Macabulos
              </span>
              {/* Smooth Rocket Animation */}
              <Rocket className="absolute right-0 h-4 w-4 text-violet-500 opacity-0 -translate-x-4 translate-y-4 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0 group-hover:-translate-y-0.5" />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}