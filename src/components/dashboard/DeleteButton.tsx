"use client";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteSubscription } from "@/actions/subscription-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function DeleteButton({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if(!confirm("Permanently delete this record? This cannot be undone.")) return;
    
    const res = await deleteSubscription(id);
    if (res.success) {
      toast.success("Deleted", { description: "Record permanently removed." });
      router.refresh();
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={handleDelete} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50">
            <Trash2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Delete Permanently</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}