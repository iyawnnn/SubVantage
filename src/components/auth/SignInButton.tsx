"use client"; // Must be client-side to use notifications

import { signIn } from "next-auth/react"; // Use client-side signIn for interactivity
import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconBrandGoogle } from "@tabler/icons-react";

export function SignInButton() {
  const handleLogin = async () => {
    notifications.show({
      title: "Connecting to Google",
      message: "Please wait while we redirect you...",
      color: "blue",
      loading: true,
    });
    
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <Button 
      onClick={handleLogin}
      variant="default" 
      size="md"
      leftSection={<IconBrandGoogle size={20} />}
    >
      Sign in with Google
    </Button>
  );
}