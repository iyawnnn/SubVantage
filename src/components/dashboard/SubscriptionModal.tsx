"use client";

import * as React from "react";
// Import startTransition
import { startTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import {
  CalendarIcon,
  Loader2,
  CreditCard,
  Tag,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import {
  createSubscription,
  updateSubscription,
} from "@/actions/subscription-actions";

// Schema Validation
const formSchema = z.object({
  vendorName: z.string().min(2, "Name is too short"),
  cost: z.coerce.number().min(0),
  splitCost: z.coerce.number().min(0).optional(),
  currency: z.string(),
  frequency: z.enum(["MONTHLY", "YEARLY"]),
  category: z.string(),
  status: z.enum(["ACTIVE", "PAUSED", "CANCELLED"]),
  startDate: z.date(),
  isTrial: z.boolean().default(false),
});

export function SubscriptionModal({
  opened,
  close,
  subToEdit,
  addOptimisticSub,
}: {
  opened: boolean;
  close: () => void;
  subToEdit?: any;
  addOptimisticSub?: (sub: any) => void;
}) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const form = useForm({
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
      // @ts-ignore
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
      if (
        subToEdit.splitCost > 0 ||
        subToEdit.isTrial ||
        subToEdit.status !== "ACTIVE"
      ) {
        setShowAdvanced(true);
      }
    } else {
      // @ts-ignore
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
      setShowAdvanced(false);
    }
  }, [subToEdit, opened, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const payload = {
      ...values,
      name: values.vendorName,
      frequency: values.frequency as "MONTHLY" | "YEARLY",
      status: values.status as "ACTIVE" | "PAUSED" | "CANCELLED",
    };

    // Construct the optimistic item
    const optimisticData = {
      id: Math.random().toString(),
      cost: values.cost,
      currency: values.currency,
      frequency: values.frequency,
      category: values.category,
      status: values.status,
      startDate: values.startDate,
      nextRenewalDate: new Date(),
      isTrial: values.isTrial,
      vendor: { name: values.vendorName },
    };

    // WRAP EVERYTHING IN ASYNC TRANSITION
    startTransition(async () => {
      // 1. Show Optimistic Update immediately
      if (!subToEdit && addOptimisticSub) {
        addOptimisticSub(optimisticData);
        toast.success("Subscription Added");
        close(); // Close immediately for "instant" feel
      }

      try {
        // 2. Perform actual Server Action
        const result = subToEdit
          ? await updateSubscription(subToEdit.id, payload)
          : await createSubscription(payload);

        if (result.success) {
          if (subToEdit) {
            toast.success("Subscription Updated");
            close();
          }
          // 3. Refresh data (this replaces optimistic state with real data)
          router.refresh();
        } else {
          toast.error("Error", {
            description:
              typeof result.message === "string"
                ? result.message
                : "Failed to save.",
          });
        }
      } catch (error) {
        toast.error("Unexpected Error");
      } finally {
        setLoading(false);
      }
    });
  }

  return (
    <Dialog open={opened} onOpenChange={(val) => !val && close()}>
      <DialogContent className="w-[90vw] sm:max-w-[420px] max-h-[85vh] overflow-y-auto bg-card border-border shadow-2xl p-0 gap-0">
        <DialogHeader className="p-6 pb-2 border-b border-border/40">
          <DialogTitle className="flex items-center gap-2 text-xl">
            {subToEdit ? (
              <Sparkles className="h-5 w-5 text-primary" />
            ) : (
              <CreditCard className="h-5 w-5 text-primary" />
            )}
            {subToEdit ? "Edit Subscription" : "New Subscription"}
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 pt-4">
          <Form {...form}>
            {/* Note: onSubmit is now sync wrapper around async transition */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* 1. VENDOR NAME */}
              <FormField
                control={form.control}
                name="vendorName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          data-testid="input-vendor-name"
                          placeholder="Subscription Name (e.g. Netflix)"
                          {...field}
                          className="pl-3 h-12 text-lg font-medium placeholder:font-normal bg-background/50 border-input"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 2. COST ROW */}
              <div className="flex gap-3">
                <div className="flex-[2]">
                  <FormField
                    control={form.control}
                    name="cost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                          Cost
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center rounded-md border border-input bg-background/50 ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                            <Input
                              data-testid="input-cost"
                              type="number"
                              step="0.01"
                              {...field}
                              value={field.value as number}
                              className="border-0 focus-visible:ring-0 shadow-none h-10 rounded-r-none pr-1 bg-transparent"
                              placeholder="0.00"
                            />
                            <FormField
                              control={form.control}
                              name="currency"
                              render={({ field: currencyField }) => (
                                <Select
                                  onValueChange={currencyField.onChange}
                                  value={currencyField.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="h-10 w-[4.5rem] border-0 border-l border-border rounded-l-none bg-muted/20 focus:ring-0 shadow-none text-xs font-bold text-muted-foreground hover:bg-muted/40">
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {["PHP", "USD", "EUR", "GBP", "JPY"].map(
                                      (c) => (
                                        <SelectItem key={c} value={c}>
                                          {c}
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="frequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                          Cycle
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-background/50 border-input h-10">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="MONTHLY">Monthly</SelectItem>
                            <SelectItem value="YEARLY">Yearly</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* 3. DETAILS ROW */}
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                        Category
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-background/50 border-input h-10">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[
                            "Entertainment",
                            "Personal",
                            "Work",
                            "Utilities",
                            "Health",
                            "Education",
                            "Dev Tools",
                          ].map((c) => (
                            <SelectItem key={c} value={c}>
                              <div className="flex items-center gap-2">
                                <Tag className="h-3 w-3 opacity-50" />
                                {c}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                        First Bill
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal bg-background/50 border-input h-10",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "MMM d, yyyy")
                              ) : (
                                <span>Pick date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date("1900-01-01")}
                            captionLayout="dropdown"
                            fromYear={2010}
                            toYear={new Date().getFullYear() + 5}
                            initialFocus
                            className="p-3"
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
              </div>

              {/* 4. ADVANCED TOGGLE */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-xs font-medium text-primary hover:underline transition-all"
                >
                  {showAdvanced ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                  {showAdvanced
                    ? "Hide Advanced Options"
                    : "More Options (Trial, Split Cost)"}
                </button>

                {showAdvanced && (
                  <div className="mt-3 space-y-4 rounded-lg border border-border/50 bg-secondary/20 p-4 animate-in slide-in-from-top-2 fade-in duration-200">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="splitCost"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">
                              My Share (If Split)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                {...field}
                                value={field.value as number}
                                className="bg-background h-9 border-input"
                                placeholder="0.00"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Status</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="bg-background h-9 border-input">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="PAUSED">Paused</SelectItem>
                                <SelectItem value="CANCELLED">
                                  Cancelled
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="isTrial"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border border-border/60 bg-background p-3">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-medium">
                              This is a Free Trial
                            </FormLabel>
                            <p className="text-[10px] text-muted-foreground">
                              Calculations will treat this as $0.00 until it
                              converts.
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>

              {/* FOOTER */}
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={close}
                  className="hover:bg-muted"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  data-testid="btn-save-subscription"
                  className="px-6 bg-gradient-to-r from-primary to-violet-600 text-white font-medium hover:shadow-lg hover:shadow-primary/20 transition-all"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {subToEdit ? "Save Changes" : "Add Subscription"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
