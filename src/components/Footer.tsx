"use client";

import React from "react";
import { Rocket } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Footer() {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  // Hide Footer on Auth pages
  if (pathname?.startsWith("/auth")) {
    return null;
  }

  return (
    <footer 
      className={cn(
        "relative border-t transition-colors",
        isLandingPage 
          ? "bg-[#050505] border-white/10 text-zinc-400" 
          : "bg-background/80 border-border/40 text-muted-foreground backdrop-blur-xl"
      )}
    >
      {/* Stylish Top Gradient Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />

      <div className="container mx-auto flex flex-col items-center justify-between gap-3 py-6 px-4 sm:px-6 lg:px-8 md:h-16 md:flex-row md:py-0">
        
        {/* Left: Copyright */}
        <p className={cn(
          "text-xs text-center md:text-left",
          isLandingPage ? "text-zinc-500" : "text-muted-foreground"
        )}>
          &copy; {new Date().getFullYear()} <span className={cn(
            "font-semibold", 
            isLandingPage ? "text-white" : "text-foreground"
          )}>SubVantage</span>. All rights reserved.
        </p>

        {/* Right: Credits */}
        <div className={cn(
          "flex items-center gap-1.5 text-xs",
          isLandingPage ? "text-zinc-500" : "text-muted-foreground"
        )}>
          <span>Designed & Developed by</span>
          <a 
            href="https://iansebastian.dev" 
            target="_blank" 
            rel="noreferrer"
            className="group relative flex items-center gap-1 font-bold transition-colors hover:text-primary"
          >
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent group-hover:opacity-80">
              Ian Macabulos
            </span>
            <Rocket className="h-3 w-3 text-violet-500 opacity-0 transition-all group-hover:opacity-100 group-hover:rotate-12" />
          </a>
        </div>
      </div>
    </footer>
  );
}