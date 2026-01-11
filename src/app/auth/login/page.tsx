"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image"; // 👈 Added Import
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, AlertCircle, ArrowLeft, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Form Validation Schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  
  // 👁️ Password Visibility State
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.title = "Login | SubVantage";
  }, []);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        toast.error("Login Failed");
      } else {
        toast.success("Welcome back!");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      toast.error("Could not connect to Google");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2 bg-[#050505] text-white font-satoshi">
      
      {/* 🖼️ LEFT SIDE: Premium Visuals */}
      <div className="hidden bg-black lg:flex relative overflow-hidden flex-col justify-between p-12 border-r border-white/5">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,_#3b82f6_0%,_transparent_40%)] opacity-20" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_100%,_#6366f1_0%,_transparent_40%)] opacity-20" />
        
        <div className="relative z-10 flex items-center gap-2">
            {/* 👇 FIX: Replaced SVG with logo.png */}
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-blue-600 shadow-lg shadow-primary/20 overflow-hidden">
               <Image 
                 src="/logo.png" 
                 alt="SubVantage" 
                 width={40} 
                 height={40} 
                 className="object-cover"
               />
            </div>
            <span className="text-xl font-bold tracking-tight">SubVantage</span>
        </div>

        <div className="relative z-10 max-w-lg">
           <h2 className="text-4xl font-extrabold tracking-tight mb-6 leading-tight">
             Master your <br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
               recurring life.
             </span>
           </h2>
           <div className="space-y-4 text-muted-foreground">
             <div className="flex items-center gap-3">
               <CheckCircle2 className="h-5 w-5 text-primary" />
               <span>Track unlimited subscriptions</span>
             </div>
             <div className="flex items-center gap-3">
               <CheckCircle2 className="h-5 w-5 text-primary" />
               <span>Get notified before renewals</span>
             </div>
             <div className="flex items-center gap-3">
               <CheckCircle2 className="h-5 w-5 text-primary" />
               <span>Visualize spending habits</span>
             </div>
           </div>
        </div>

        <div className="relative z-10 text-sm text-muted-foreground/60">
           © {new Date().getFullYear()} SubVantage. All rights reserved.
        </div>
      </div>

      {/* 📝 RIGHT SIDE: Login Form */}
      <div className="relative flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-12">
        <div className="absolute inset-0 bg-primary/5 lg:hidden pointer-events-none blur-3xl" />

        <Link 
          href="/" 
          className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors group cursor-pointer z-50"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span className="hidden sm:inline">Back to website</span>
          <span className="sm:hidden">Back</span>
        </Link>

        <div className="mx-auto w-full max-w-[380px] space-y-6 relative z-10">
          
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email to sign in to your account
            </p>
          </div>

          <div className="grid gap-6">
            {/* ✨ Dark Glass Google Button */}
            <Button 
              variant="outline" 
              className="w-full h-11 gap-3 bg-white/5 text-white border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20 font-medium cursor-pointer transition-all active:scale-[0.98]"
              onClick={handleGoogleLogin}
              disabled={googleLoading || loading}
            >
              {googleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <GoogleIcon className="h-5 w-5" />
              )}
              Sign in with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#050505] px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* 👇 FIX: Replaced Alert with Custom Flex Container */}
            {error && (
              <div className="flex items-center gap-3 rounded-lg border border-red-900/20 bg-red-900/10 p-3 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  disabled={loading}
                  className="bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 text-white placeholder:text-white/20 h-11"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-xs text-red-400">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* 🔒 Password Field with Toggle */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    disabled={loading}
                    className="bg-white/5 border-white/10 focus:border-primary/50 focus:ring-primary/20 text-white placeholder:text-white/20 h-11 pr-10"
                    {...form.register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-xs text-red-400">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 text-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]" 
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In with Email
              </Button>
            </form>

            <p className="px-8 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="hover:text-primary underline underline-offset-4 cursor-pointer transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple Google Icon Component
function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}