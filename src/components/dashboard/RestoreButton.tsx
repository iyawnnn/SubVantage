"use client";

import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { restoreSubscription } from "@/actions/subscription-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function RestoreButton({ id }: { id: string }) {
  const router = useRouter();
  
  const handleRestore = async () => {
    try {
      const res = await restoreSubscription(id);
      
      if (res.success) {
        // ✅ Success
        toast.success("Subscription Restored", { 
          description: "This subscription is now active." 
        });
        router.refresh();
      } else {
        // ❌ Error
        toast.error("Restore Failed", { 
          description: typeof res.message === 'string' ? res.message : "Could not restore subscription." 
        });
      }
    } catch (err) {
      toast.error("System Error", { description: "Something went wrong." });
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRestore} 
            className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Restore to Active</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}