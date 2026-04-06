"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2, 
  Moon, 
  Sun, 
  Bell, 
  Rocket,
  ShieldCheck,
  Globe
} from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { finishOnboarding } from "@/actions/onboarding-actions";
import { setupTwoFactor, verifyAndEnableTwoFactor, disableTwoFactor } from "@/actions/settings-actions";
import { cn } from "@/lib/utils";

export function OnboardingFlow({ isOpen }: { isOpen: boolean }) {
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(isOpen);
  const { setTheme, theme } = useTheme();
  const [loading, setLoading] = useState(false);

  // General Settings
  const [currency, setCurrency] = useState("USD");
  const [notifications, setNotifications] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Interactive 2FA Setup State
  const [isSettingUp2FA, setIsSettingUp2FA] = useState(false);
  const [loading2FA, setLoading2FA] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const totalSteps = 4;

  const handleFinish = async () => {
    setLoading(true);
    const result = await finishOnboarding({ currency, notifications, twoFactorEnabled });
    
    if (result.success) {
      toast.success("System initialized. Welcome to SubVantage.");
      setOpen(false);
    } else {
      toast.error("Something went wrong saving your settings.");
    }
    setLoading(false);
  };

  const handleToggle2FA = async (checked: boolean) => {
    if (checked) {
      setLoading2FA(true);
      try {
        const result = await setupTwoFactor();
        
        if (result?.qrCodeDataUrl) {
          setQrCodeUrl(result.qrCodeDataUrl);
          setIsSettingUp2FA(true);
        } else {
          toast.error("Failed to generate QR sequence.");
          setTwoFactorEnabled(false);
        }
      } catch (error) {
        toast.error("System error during 2FA setup.");
        setTwoFactorEnabled(false);
      }
      setLoading2FA(false);
    } else {
      setLoading2FA(true);
      try {
        await disableTwoFactor();
        setTwoFactorEnabled(false);
        setIsSettingUp2FA(false);
        setVerificationCode("");
        setQrCodeUrl("");
      } catch (error) {
        toast.error("Failed to disable 2FA.");
      }
      setLoading2FA(false);
    }
  };

  const handleVerify2FA = async () => {
    setLoading2FA(true);
    try {
      const result = await verifyAndEnableTwoFactor(verificationCode);
      if (result?.success) {
        toast.success("Two-Factor Authentication secured.");
        setTwoFactorEnabled(true);
        setIsSettingUp2FA(false);
      } else {
        toast.error(result?.message || "Invalid authentication code.");
      }
    } catch (error) {
      toast.error("System error verifying code.");
    }
    setLoading2FA(false);
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="[&>button]:hidden sm:max-w-[500px] p-0 overflow-y-auto overflow-x-hidden max-h-[90vh] bg-background border-primary/20 shadow-xl font-satoshi [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-zinc-700"
        onInteractOutside={(e) => e.preventDefault()} 
        onEscapeKeyDown={(e) => e.preventDefault()}
        aria-describedby="onboarding-description"
      >
        <DialogTitle className="sr-only">System Initialization</DialogTitle>
        <div id="onboarding-description" className="sr-only">
          Configure initial system parameters.
        </div>

        <div className="relative p-8 min-h-[440px] flex flex-col">
          
          <div className="absolute top-0 left-0 w-full flex gap-1 px-2 pt-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-all duration-300",
                  step >= i + 1 ? "bg-primary" : "bg-primary/20"
                )}
              />
            ))}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            
            {/* STEP 1: WELCOME & CURRENCY */}
            {step === 1 && (
              <motion.div
                key="step1"
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col gap-6 mt-4"
              >
                <div className="space-y-2">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 mb-4">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">Welcome to SubVantage</h2>
                  <p className="text-muted-foreground">
                    Let us configure your baseline parameters. This will only take a moment.
                  </p>
                </div>

                <div className="space-y-4 pt-4">
                  <Label>Primary Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="h-12 bg-secondary/50 border-border/50 cursor-pointer">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD" className="cursor-pointer">USD ($) - US Dollar</SelectItem>
                      <SelectItem value="EUR" className="cursor-pointer">EUR (€) - Euro</SelectItem>
                      <SelectItem value="GBP" className="cursor-pointer">GBP (£) - British Pound</SelectItem>
                      <SelectItem value="JPY" className="cursor-pointer">JPY (¥) - Japanese Yen</SelectItem>
                      <SelectItem value="PHP" className="cursor-pointer">PHP (₱) - Philippine Peso</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Foreign subscriptions will be automatically converted to this base currency.
                  </p>
                </div>
              </motion.div>
            )}

            {/* STEP 2: THEME */}
            {step === 2 && (
              <motion.div
                key="step2"
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col gap-6 mt-4"
              >
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Interface Configuration</h2>
                  <p className="text-muted-foreground">
                    Select your preferred visual environment.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button
                    onClick={() => setTheme("light")}
                    className={cn(
                      "relative flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all hover:bg-secondary/50 cursor-pointer",
                      theme === "light" 
                        ? "border-primary bg-primary/5 text-foreground" 
                        : "border-border bg-transparent text-muted-foreground opacity-60 hover:opacity-100"
                    )}
                  >
                    <Sun className="h-8 w-8" />
                    <span className="font-medium">Light Mode</span>
                    {theme === "light" && (
                      <div className="absolute top-3 right-3 text-primary">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                    )}
                  </button>

                  <button
                    onClick={() => setTheme("dark")}
                    className={cn(
                      "relative flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all hover:bg-secondary/50 cursor-pointer",
                      theme === "dark" 
                        ? "border-primary bg-primary/5 text-foreground" 
                        : "border-border bg-transparent text-muted-foreground opacity-60 hover:opacity-100"
                    )}
                  >
                    <Moon className="h-8 w-8" />
                    <span className="font-medium">Dark Mode</span>
                    {theme === "dark" && (
                      <div className="absolute top-3 right-3 text-primary">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: ALERTS */}
            {step === 3 && (
              <motion.div
                key="step3"
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col gap-6 mt-4"
              >
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Telemetry & Alerts</h2>
                  <p className="text-muted-foreground">
                    Get notified before your subscriptions renew so you are never charged unexpectedly.
                  </p>
                </div>

                <div className="pt-4">
                  <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 p-5">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-primary/20 p-2 text-primary">
                        <Bell className="h-5 w-5" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="font-bold text-foreground">Renewal Alerts</p>
                        <p className="text-xs text-muted-foreground">Dispatch email 3 days prior to renewal.</p>
                      </div>
                    </div>
                    <Switch 
                      checked={notifications} 
                      onCheckedChange={setNotifications} 
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: SECURITY (2FA) */}
            {step === 4 && (
              <motion.div
                key="step4"
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col gap-6 mt-4"
              >
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Account Protection</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Financial data requires strict security protocols. We strongly recommend enabling Two-Factor Authentication.
                  </p>
                </div>

                <div className="pt-2">
                  <div className="flex items-start justify-between rounded-xl border border-primary/20 bg-primary/5 p-4">
                    <div className="flex gap-4">
                      <div className="mt-0.5">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-foreground">Enable 2FA</p>
                        <p className="text-xs text-muted-foreground leading-relaxed max-w-[220px]">
                          Require secondary verification from an authenticator app.
                        </p>
                      </div>
                    </div>
                    <Switch 
                      checked={twoFactorEnabled || isSettingUp2FA} 
                      onCheckedChange={handleToggle2FA} 
                      disabled={loading2FA}
                      className="mt-1 cursor-pointer" 
                    />
                  </div>

                  <AnimatePresence>
                    {isSettingUp2FA && qrCodeUrl && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="rounded-xl border border-border/50 bg-secondary/10 p-5 overflow-hidden"
                      >
                        <div className="flex flex-col items-center gap-4">
                          <p className="text-sm font-semibold text-center text-foreground">
                            Scan with Google Authenticator or Authy
                          </p>
                          <div className="bg-white p-3 rounded-xl border-4 border-white shadow-sm">
                            <img src={qrCodeUrl} alt="2FA QR Code" className="w-32 h-32" />
                          </div>
                          <div className="w-full space-y-2 mt-2">
                            <Label className="text-xs text-muted-foreground text-center block">Enter the 6-digit code to verify</Label>
                            <div className="flex gap-2">
                              <Input 
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="000000"
                                className="text-center tracking-widest text-lg h-11 bg-background border-border/50"
                                maxLength={6}
                              />
                              <Button 
                                onClick={handleVerify2FA} 
                                disabled={verificationCode.length !== 6 || loading2FA}
                                className="h-11 cursor-pointer px-6"
                              >
                                {loading2FA ? "..." : "Verify"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between pt-6 mt-auto border-t border-border/50">
            {step > 1 ? (
              <Button 
                variant="ghost"
                onClick={prevStep}
                disabled={loading || isSettingUp2FA}
                className="px-0 text-muted-foreground hover:bg-transparent hover:text-foreground cursor-pointer"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
            ) : (
              <div /> 
            )}

            <Button 
              onClick={step === totalSteps ? handleFinish : nextStep}
              disabled={loading || loading2FA || isSettingUp2FA} 
              className={cn(
                "gap-2 rounded-full px-6 transition-all group cursor-pointer",
                step === totalSteps && !isSettingUp2FA ? "font-bold" : ""
              )}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full border-2 border-background/50 border-t-background animate-spin" />
                  Initializing...
                </span>
              ) : step === totalSteps ? (
                <>Complete Setup <Rocket className="h-4 w-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" /></>
              ) : (
                <>Next <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}