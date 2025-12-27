"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-border/40 bg-background/80 backdrop-blur-xl">
       {/* Stylish Top Gradient Line */}
       <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />

      {/* 👇 FIX: Added 'px-4 sm:px-6 lg:px-8' to match DashboardShell exactly */}
      <div className="container mx-auto flex flex-col items-center justify-between gap-3 py-6 px-4 sm:px-6 lg:px-8 md:h-16 md:flex-row md:py-0">
        
        {/* Left: Copyright */}
        <p className="text-xs text-muted-foreground text-center md:text-left">
          &copy; {new Date().getFullYear()} <span className="font-semibold text-foreground">SubTrack</span>. All rights reserved.
        </p>

        {/* Right: Credits */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>Designed & Developed by</span>
          <a 
            href="https://github.com/iyawnnn" 
            target="_blank" 
            rel="noreferrer"
            className="group relative flex items-center gap-1 font-bold transition-colors hover:text-primary"
          >
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent group-hover:opacity-80">
              Ian Macabulos
            </span>
            <Sparkles className="h-3 w-3 text-violet-500 opacity-0 transition-all group-hover:opacity-100 group-hover:rotate-12" />
          </a>
        </div>
      </div>
    </footer>
  );
}