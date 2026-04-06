"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { verifyOAuthTwoFactorAction } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Verify2FAPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { update } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await verifyOAuthTwoFactorAction(code);
      if (result.success) {
        // Triggers the jwt update trigger we built in Step 1
        await update({ twoFactorVerified: true });
        toast.success("Identity verified");
        router.push("/dashboard");
      } else {
        toast.error(result.message || "Invalid code");
        setCode("");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white p-4 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white/5 p-8 rounded-3xl border border-white/10 shadow-xl">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">Two-Factor Auth</h2>
          <p className="text-muted-foreground text-sm">
            Enter your 6-digit authenticator code to continue.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label className="text-center block text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Authentication Code
            </Label>
            <Input
              type="text"
              placeholder="000000"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
              disabled={loading}
              className="bg-[#050505] border-white/10 focus:border-primary/50 text-center text-3xl tracking-[0.4em] font-mono h-16 rounded-xl"
            />
          </div>
          <Button 
            type="submit" 
            disabled={code.length !== 6 || loading} 
            className="w-full h-12 text-base font-bold rounded-xl cursor-pointer"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : "Verify & Continue"}
          </Button>
        </form>
      </div>
    </div>
  );
}