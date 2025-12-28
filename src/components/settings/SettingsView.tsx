"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Bell,
  Shield,
  Download,
  LogOut,
  CreditCard,
  CheckCircle2,
  Mail,
  Sun,
  Moon,
  Laptop,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { updateCurrency, getExportData } from "@/actions/settings-actions";

export default function SettingsView({ user }: { user: any }) {
  const { setTheme, theme } = useTheme();
  const [currency, setCurrency] = useState(user?.preferredCurrency || "USD");
  const [loadingCurrency, setLoadingCurrency] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (user?.preferredCurrency) {
      setCurrency(user.preferredCurrency);
    }
  }, [user]);

  const handleSaveCurrency = async (value: string) => {
    setCurrency(value);
    setLoadingCurrency(true);
    try {
      await updateCurrency(value);
      toast.success(`Currency updated to ${value}`);
    } catch (error) {
      toast.error("Failed to update currency");
    } finally {
      setLoadingCurrency(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const data = await getExportData();

      if (!data || data.length === 0) {
        toast.error("No data to export");
        return;
      }

      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(","),
        ...data.map((row) =>
          headers
            .map((header) => JSON.stringify((row as any)[header]))
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `subtrack_export_${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Data exported successfully");
    } catch (error) {
      toast.error("Failed to export data");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* 👤 Profile Hero */}
      <div className="rounded-3xl border border-border/40 bg-secondary/30 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="h-20 w-20 md:h-24 md:w-24 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary">
            {user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt="Profile"
                className="h-full w-full rounded-2xl object-cover"
              />
            ) : (
              <span className="text-3xl font-bold">
                {user?.name?.charAt(0) || "U"}
              </span>
            )}
          </div>
          <div className="flex-1 space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {user?.name}
            </h1>
            <p className="text-muted-foreground">{user?.email}</p>
            <div className="flex gap-2 mt-3">
              <Badge
                variant="outline"
                className="bg-background/50 backdrop-blur"
              >
                Free Tier
              </Badge>
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary hover:bg-primary/20"
              >
                Early Adopter
              </Badge>
            </div>
          </div>
          <Button
            variant="outline"
            // 👇 FIX: Explicit redirect to home page
            onClick={() => signOut({ callbackUrl: "/" })}
            className="shrink-0 gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/30 dark:hover:bg-red-950/20 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* ⚙️ Settings Grid */}
      {/* Grid stretches items by default, so cards will be equal height */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. General Preferences */}
        <Card className="border-border/50 bg-card/50 backdrop-blur flex flex-col h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" /> General
            </CardTitle>
            <CardDescription>
              Customize your workspace experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Preferred Currency</Label>
              <Select
                value={currency}
                onValueChange={handleSaveCurrency}
                disabled={loadingCurrency}
              >
                <SelectTrigger className="bg-background/50 cursor-pointer">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD" className="cursor-pointer">
                    USD ($)
                  </SelectItem>
                  <SelectItem value="EUR" className="cursor-pointer">
                    EUR (€)
                  </SelectItem>
                  <SelectItem value="PHP" className="cursor-pointer">
                    PHP (₱)
                  </SelectItem>
                  <SelectItem value="GBP" className="cursor-pointer">
                    GBP (£)
                  </SelectItem>
                  <SelectItem value="JPY" className="cursor-pointer">
                    JPY (¥)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label>Appearance</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  onClick={() => setTheme("light")}
                  className="justify-start gap-2 h-auto py-3 cursor-pointer"
                >
                  <Sun className="h-4 w-4" /> Light
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  onClick={() => setTheme("dark")}
                  className="justify-start gap-2 h-auto py-3 cursor-pointer"
                >
                  <Moon className="h-4 w-4" /> Dark
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  onClick={() => setTheme("system")}
                  className="justify-start gap-2 h-auto py-3 cursor-pointer"
                >
                  <Laptop className="h-4 w-4" /> System
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Notifications */}
        <Card className="border-border/50 bg-card/50 backdrop-blur flex flex-col h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-amber-500" /> Notifications
            </CardTitle>
            <CardDescription>Manage how you receive updates.</CardDescription>
          </CardHeader>
          {/* 👇 FIX: Removed 'flex justify-between' to fix the gap issue */}
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-0.5">
                <Label className="text-base">Renewal Alerts</Label>
                <p className="text-xs text-muted-foreground">
                  Get notified via email when a bill is due.
                </p>
              </div>
              <Switch defaultChecked className="cursor-pointer" />
            </div>

            <Separator />

            <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-4 flex gap-3 items-start border border-blue-100 dark:border-blue-900/30">
              <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                Email notifications are powered by Resend. Alerts will be sent
                to: <strong>{user?.email}</strong>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 3. Data & Privacy */}
        <Card className="border-border/50 bg-card/50 backdrop-blur flex flex-col h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-500" /> Data & Privacy
            </CardTitle>
            <CardDescription>Manage your personal data.</CardDescription>
            <p className="text-xs text-muted-foreground">
              Download a copy of all your subscriptions, costs, and payment
              history.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 👇 FIX: Standard button size, removed huge padding */}
            <Button
              variant="outline"
              className="w-full justify-between cursor-pointer h-12 px-4"
              onClick={handleExport}
              disabled={exporting}
            >
              <span className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                {exporting ? "Preparing..." : "Export Data (CSV)"}
              </span>
            </Button>
          </CardContent>
        </Card>

        {/* 4. Plan Info */}
        <Card className="border-border/50 bg-card/50 backdrop-blur flex flex-col h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-violet-600 dark:text-violet-400">
              <CreditCard className="h-5 w-5" /> Current Plan
            </CardTitle>
            <CardDescription>You are on the Free Tier.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50">
              <div className="space-y-1">
                <p className="text-sm font-medium">Free Forever</p>
                <p className="text-xs text-muted-foreground">
                  Unlimited subscriptions
                </p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}