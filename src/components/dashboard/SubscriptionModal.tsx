"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { createSubscription, updateSubscription } from "@/actions/subscription-actions";

const formSchema = z.object({
  vendorName: z.string().min(2, "Name is too short"),
  cost: z.coerce.number().min(0),
  splitCost: z.coerce.number().min(0).optional(),
  currency: z.string(),
  frequency: z.string(),
  category: z.string(),
  status: z.string(),
  startDate: z.date(),
  isTrial: z.boolean().default(false),
});

export function SubscriptionModal({ opened, close, subToEdit }: { opened: boolean; close: () => void; subToEdit?: any }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vendorName: "",
      cost: 0,
      splitCost: 0,
      currency: "PHP",
      frequency: "MONTHLY",
      category: "Personal",
      status: "ACTIVE",
      startDate: new Date(),
      isTrial: false,
    },
  });

  React.useEffect(() => {
    if (subToEdit) {
      form.reset({
        vendorName: subToEdit.vendor.name,
        cost: Number(subToEdit.cost),
        splitCost: subToEdit.splitCost ? Number(subToEdit.splitCost) : 0,
        currency: subToEdit.currency,
        frequency: subToEdit.frequency,
        category: subToEdit.category,
        status: subToEdit.status || "ACTIVE",
        startDate: new Date(subToEdit.startDate),
        isTrial: subToEdit.isTrial,
      });
    } else {
      form.reset({
        vendorName: "",
        cost: 0,
        splitCost: 0,
        currency: "PHP",
        frequency: "MONTHLY",
        category: "Personal",
        status: "ACTIVE",
        startDate: new Date(),
        isTrial: false,
      });
    }
  }, [subToEdit, opened, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const payload = { ...values, name: values.vendorName };
    try {
      const result = subToEdit 
        ? await updateSubscription(subToEdit.id, payload)
        : await createSubscription(payload);

      if (result.success) {
        toast.success(subToEdit ? "Subscription Updated" : "Subscription Added");
        close();
        router.refresh();
      } else {
        toast.error("Error", { description: typeof result.message === "string" ? result.message : "Failed to save." });
      }
    } catch (error) {
      toast.error("Unexpected Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={opened} onOpenChange={(val) => !val && close()}>
      <DialogContent className="sm:max-w-[500px] bg-background border-border text-foreground">
        <DialogHeader>
          <DialogTitle>{subToEdit ? "Edit Subscription" : "Add Subscription"}</DialogTitle>
          <DialogDescription>
            {subToEdit 
              ? "Modify the details of your existing subscription." 
              : "Enter the details for your new subscription."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="vendorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendor Name</FormLabel>
                  <FormControl><Input placeholder="e.g. Netflix" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Price</FormLabel>
                    <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="splitCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>My Share (Optional)</FormLabel>
                    <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        {["PHP", "USD", "EUR", "GBP", "JPY"].map((c) => (
                           <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cycle</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="MONTHLY">Monthly</SelectItem>
                        <SelectItem value="YEARLY">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          {["Entertainment", "Personal", "Work", "Utilities", "Health"].map(c => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="ACTIVE">Active</SelectItem>
                          <SelectItem value="PAUSED">Paused</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
            </div>

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "MMM d, yyyy") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isTrial"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>This is a Free Trial</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={close}>Cancel</Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {subToEdit ? "Save Changes" : "Add Subscription"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}