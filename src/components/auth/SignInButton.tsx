"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function SignInButton() {
  return (
    <Button 
      size="lg" 
      onClick={() => signIn(undefined, { callbackUrl: "/dashboard" })}
      className="gap-2"
    >
      Start Tracking Free
      <ArrowRight className="h-4 w-4" />
    </Button>
  );
}