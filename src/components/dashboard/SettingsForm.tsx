"use client";

import { useState, useEffect } from "react";
import { updateUserSettings } from "@/actions/user-actions";
import { toast } from "sonner";
import { Loader2, Save, Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "next-themes"; // 👈 Import useTheme

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const CURRENCIES = ["USD", "PHP", "EUR", "GBP", "AUD", "CAD", "JPY"];

export function SettingsForm({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState(user?.preferredCurrency || "USD");
  
  // 👇 Theme Hooks
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const result = await updateUserSettings({ preferredCurrency: currency });
      
      if (result.success) {
        toast.success("Settings Saved", {
          description: "Your preferences have been updated.",
        });
      } else {
        toast.error("Update Failed", {
          description: "Could not save your changes. Please try again.",
        });
      }
    } catch (error) {
      toast.error("System Error", {
        description: "An unexpected error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border bg-card text-card-foreground">
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>
          Customize appearance and financial defaults.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* 👇 THEME SETTING */}
        <div className="grid gap-2">
          <Label htmlFor="theme">Appearance</Label>
          <div className="flex items-center gap-4">
            <div className="w-[180px]">
              <Select 
                value={mounted ? theme : "system"} 
                onValueChange={setTheme}
              >
                <SelectTrigger id="theme">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" /> Light
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" /> Dark
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center gap-2">
                      <Laptop className="h-4 w-4" /> System
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-muted-foreground">
              Select your preferred display mode.
            </p>
          </div>
        </div>

        {/* CURRENCY SETTING */}
        <div className="grid gap-2">
          <Label htmlFor="currency">Preferred Currency</Label>
          <div className="flex items-center gap-4">
            <div className="w-[180px]">
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((curr) => (
                    <SelectItem key={curr} value={curr}>
                      {curr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-muted-foreground">
              Calculations will be based on this currency.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <Button onClick={handleSave} disabled={loading} className="gap-2">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}