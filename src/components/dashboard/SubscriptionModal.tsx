"use client";

import * as React from "react";
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
  Check,
  ChevronsUpDown,
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import {
  createSubscription,
  updateSubscription,
} from "@/actions/subscription-actions";

// IMPORT THE GLOBAL SECURE SCHEMA
import { subscriptionSchema } from "@/lib/validations/subscription";

const PRESET_CATEGORIES = [
  "Entertainment",
  "Personal",
  "Work",
  "Utilities",
  "Health",
  "Education",
  "Dev Tools",
  "Finance",
  "Fitness",
  "Social",
  "Software",
  "Transportation",
  "Housing",
];

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

  const [openCombobox, setOpenCombobox] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");

  const form = useForm<z.infer<typeof subscriptionSchema>>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      name: "",
      cost: 0, // FIX: Set to 0 instead of empty string
      splitCost: 0, // FIX: Set to 0 instead of empty string
      currency: "PHP",
      frequency: "MONTHLY",
      category: "Personal",
      status: "ACTIVE",
      startDate: undefined as any,
      isTrial: false,
    },
  });

  React.useEffect(() => {
    if (!subToEdit && !form.getValues("startDate")) {
      form.setValue("startDate", new Date());
    }
  }, [subToEdit, form]);

  React.useEffect(() => {
    if (subToEdit) {
      form.reset({
        name: subToEdit.vendor.name, // Mapped accurately to the new 'name' field
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
      form.reset({
        name: "",
        cost: 0,                   
        splitCost: 0,             
        currency: "PHP",
        frequency: "MONTHLY",
        category: "Personal",
        status: "ACTIVE",
        startDate: undefined as any, 
        isTrial: false,
      });
      setShowAdvanced(false);
      setSearchValue("");
      setTimeout(() => form.setValue("startDate", new Date()), 0);
    }
  }, [subToEdit, opened, form]);

  function onSubmit(values: z.infer<typeof subscriptionSchema>) {
    setLoading(true);

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
      vendor: { name: values.name },
    };

    startTransition(async () => {
      const canRunOptimistic = !subToEdit && !!addOptimisticSub;

      if (canRunOptimistic && addOptimisticSub) {
        addOptimisticSub(optimisticData);
        toast.success("Subscription Added");
        close();
      }

      try {
        // Because we unified the schema, we can pass 'values' directly
        // to the server action without manipulating the payload object!
        const result = subToEdit
          ? await updateSubscription(subToEdit.id, values)
          : await createSubscription(values);

        if (result.success) {
          if (!canRunOptimistic) {
            toast.success(
              subToEdit ? "Subscription Updated" : "Subscription Added",
            );
            close();
          }
          router.refresh();
        } else {
          // Display the highly specific backend validation errors to the user if they bypassed the UI
          const errorMessage = result.errors
            ? Object.values(result.errors).flat()[0]
            : result.message;

          toast.error("Error", {
            description: errorMessage || "Failed to save.",
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* 1. VENDOR NAME */}
              <FormField
                control={form.control}
                name="name" // Updated to match schema
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
                              value={field.value as any}
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
                                      ),
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
                        <FormMessage />
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
                    <FormItem className="flex flex-col">
                      <FormLabel className="flex items-center gap-1.5 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                        Category
                      </FormLabel>
                      <Popover
                        open={openCombobox}
                        onOpenChange={setOpenCombobox}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openCombobox}
                              className={cn(
                                "w-full justify-between bg-background/50 border-input h-10 font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                <span className="flex items-center gap-2 truncate">
                                  <Tag className="h-3 w-3 opacity-50 shrink-0" />
                                  {field.value}
                                </span>
                              ) : (
                                "Select category"
                              )}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0" align="start">
                          <Command>
                            <CommandInput
                              placeholder="Search or create..."
                              value={searchValue}
                              onValueChange={setSearchValue}
                            />
                            <CommandList>
                              <CommandEmpty>
                                <div
                                  className="py-3 px-3 text-sm text-foreground cursor-pointer hover:bg-accent flex items-center gap-2"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                  onClick={() => {
                                    if (searchValue.trim()) {
                                      form.setValue(
                                        "category",
                                        searchValue.trim(),
                                      );
                                      setOpenCombobox(false);
                                      setSearchValue("");
                                    }
                                  }}
                                >
                                  <Sparkles className="h-3 w-3 text-primary" />
                                  Create "{searchValue}"
                                </div>
                              </CommandEmpty>
                              <CommandGroup>
                                {PRESET_CATEGORIES.map((category) => (
                                  <CommandItem
                                    key={category}
                                    value={category}
                                    onSelect={(currentValue) => {
                                      form.setValue("category", category);
                                      setOpenCombobox(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === category
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                    {category}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
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
                                !field.value && "text-muted-foreground",
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
                      <FormMessage />
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
                                value={field.value as any}
                                className="bg-background h-9 border-input"
                                placeholder="0.00"
                              />
                            </FormControl>
                            <FormMessage />
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
                            <FormMessage />
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
