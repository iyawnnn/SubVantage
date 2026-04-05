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
import { updateCurrency, getExportData, updateNotificationSettings } from "@/actions/settings-actions";

export default function SettingsView({ user }: { user: any }) {
  const { setTheme, theme } = useTheme();
  const [currency, setCurrency] = useState(user?.preferredCurrency || "USD");
  const [loadingCurrency, setLoadingCurrency] = useState(false);
  const [exporting, setExporting] = useState(false);
  
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState(user?.emailNotifications ?? true);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user?.preferredCurrency) {
      setCurrency(user.preferredCurrency);
    }
    if (user?.emailNotifications !== undefined) {
      setNotifications(user.emailNotifications);
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

  const handleToggleNotifications = async (checked: boolean) => {
    setNotifications(checked);
    setLoadingNotifications(true);
    try {
      await updateNotificationSettings(checked);
      toast.success(checked ? "Renewal alerts enabled" : "Renewal alerts disabled");
    } catch (error) {
      toast.error("Failed to update preferences");
      setNotifications(!checked);
    } finally {
      setLoadingNotifications(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 font-sans">
      
      <div className="rounded-3xl border border-border/40 bg-secondary/30 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-center md:items-center gap-6 text-center md:text-left">
          
          <div className="h-24 w-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary overflow-hidden shadow-inner">
            {user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-4xl font-bold">
                {user?.name?.charAt(0) || "U"}
              </span>
            )}
          </div>
          
          <div className="flex-1 space-y-2 flex flex-col items-center md:items-start w-full">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {user?.name}
            </h1>
            <p className="text-muted-foreground text-lg">{user?.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
              <Badge
                variant="outline"
                className="bg-background/50 px-3 py-1 text-sm font-medium"
              >
                Free Tier
              </Badge>
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1 text-sm font-medium"
              >
                Early Adopter
              </Badge>
            </div>
          </div>
          
          <Button
            variant="outline"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full md:w-auto mt-4 md:mt-0 shrink-0 gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/30 dark:hover:bg-red-950/20 cursor-pointer h-12 px-6 rounded-xl transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <Card className="border-border/50 bg-card/50 flex flex-col h-full shadow-sm">
          <CardHeader className="pb-5">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Settings className="h-5 w-5 text-primary" /> General
            </CardTitle>
            <CardDescription className="text-sm">
              Customize your workspace experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="space-y-2.5">
              <Label className="text-xs font-bold text-muted-foreground tracking-wider uppercase">Preferred Currency</Label>
              <Select
                value={currency}
                onValueChange={handleSaveCurrency}
                disabled={loadingCurrency}
              >
                <SelectTrigger className="h-12 bg-background/50 cursor-pointer rounded-xl">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD" className="cursor-pointer">USD ($)</SelectItem>
                  <SelectItem value="EUR" className="cursor-pointer">EUR (€)</SelectItem>
                  <SelectItem value="PHP" className="cursor-pointer">PHP (₱)</SelectItem>
                  <SelectItem value="GBP" className="cursor-pointer">GBP (£)</SelectItem>
                  <SelectItem value="JPY" className="cursor-pointer">JPY (¥)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator className="bg-border/50" />

            <div className="space-y-2.5">
              <Label className="text-xs font-bold text-muted-foreground tracking-wider uppercase">Appearance</Label>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant={mounted && theme === "light" ? "default" : "outline"}
                  onClick={() => setTheme("light")}
                  className="justify-center gap-2 h-auto py-3 cursor-pointer rounded-xl"
                >
                  <Sun className="h-4 w-4" /> Light
                </Button>
                <Button
                  variant={mounted && theme === "dark" ? "default" : "outline"}
                  onClick={() => setTheme("dark")}
                  className="justify-center gap-2 h-auto py-3 cursor-pointer rounded-xl"
                >
                  <Moon className="h-4 w-4" /> Dark
                </Button>
                <Button
                  variant={mounted && theme === "system" ? "default" : "outline"}
                  onClick={() => setTheme("system")}
                  className="justify-center gap-2 h-auto py-3 cursor-pointer rounded-xl"
                >
                  <Laptop className="h-4 w-4" /> System
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 flex flex-col h-full shadow-sm">
          <CardHeader className="pb-5">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Bell className="h-5 w-5 text-amber-500" /> Notifications
            </CardTitle>
            <CardDescription className="text-sm">Manage how you receive updates.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="flex items-center justify-between space-x-2">
              <div className="space-y-1">
                <Label className="text-base font-semibold">Renewal Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified via email when a bill is due.
                </p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={handleToggleNotifications}
                disabled={loadingNotifications}
                className="cursor-pointer data-[state=checked]:bg-primary"
              />
            </div>

            <Separator className="bg-border/50" />

            <div className="rounded-xl bg-blue-50 dark:bg-blue-950/20 p-4 flex gap-3 items-start border border-blue-100 dark:border-blue-900/30">
              <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                Email notifications are powered by Resend. Alerts will be sent
                to: <strong className="block mt-1 font-bold">{user?.email}</strong>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 flex flex-col h-full shadow-sm">
          <CardHeader className="pb-5">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Shield className="h-5 w-5 text-emerald-500" /> Data & Privacy
            </CardTitle>
            <CardDescription className="text-sm">Manage your personal data.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Download a complete copy of all your active subscriptions, costs, and historical payment data.
            </p>
            <Button
              variant="outline"
              className="w-full justify-between cursor-pointer h-12 px-5 rounded-xl border-border/80 hover:bg-secondary/50"
              onClick={handleExport}
              disabled={exporting}
            >
              <span className="flex items-center gap-3 font-semibold">
                <Download className="h-4 w-4" />
                {exporting ? "Preparing your data..." : "Export Data to CSV"}
              </span>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 flex flex-col h-full shadow-sm">
          <CardHeader className="pb-5">
            <CardTitle className="flex items-center gap-2 text-xl text-primary">
              <CreditCard className="h-5 w-5" /> Current Plan
            </CardTitle>
            <CardDescription className="text-sm">Your active billing tier.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div className="flex items-center justify-between p-5 rounded-xl border border-primary/20 bg-primary/5">
              <div className="space-y-1">
                <p className="text-lg font-bold text-foreground">Free Forever</p>
                <p className="text-sm text-muted-foreground font-medium">
                  Unlimited subscription tracking
                </p>
              </div>
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        
      </div>
    </div>
  );
}