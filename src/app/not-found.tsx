import Link from "next/link";
import { FileQuestion, ArrowLeft, LayoutDashboard, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Page Not Found | SubTrack",
};

export default function NotFound() {
  return (
    <div className="fixed inset-0 z-[999] flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#050505] text-white font-satoshi selection:bg-primary/20">
      
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,_#3b82f6_0%,_transparent_40%)] opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_100%,_#6366f1_0%,_transparent_40%)] opacity-10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-md mx-auto p-6 animate-in fade-in slide-in-from-bottom-10 duration-700">
        
        <div className="mb-8 flex items-center gap-4 rounded-full bg-white/5 border border-white/10 p-2 pr-6 backdrop-blur-md shadow-2xl shadow-black/50">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-blue-600 shadow-lg shadow-primary/30">
               <AlertTriangle className="h-7 w-7 text-white" />
            </div>
            <div className="text-left">
                <div className="text-xs font-bold text-primary uppercase tracking-wider">System Status</div>
                <div className="text-2xl font-extrabold tracking-tight text-white leading-none mt-0.5">
                  Error 404
                </div>
            </div>
        </div>

        {/* Text Content */}
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          You've found a dead end.
        </h2>
        <p className="mt-4 text-base text-muted-foreground/80 max-w-[90%] leading-relaxed">
          Sorry, the page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button 
            asChild 
            className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white shadow-lg shadow-primary/25 h-11 px-8 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Link href="/dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Go to Dashboard
            </Link>
          </Button>
          
          <Button 
            asChild 
            variant="outline" 
            className="border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white h-11 px-8 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

      </div>
    </div>
  );
}