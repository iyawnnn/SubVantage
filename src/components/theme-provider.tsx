"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { useSession } from "next-auth/react";

// Inner component to strictly enforce dark mode for logged-out users
function ThemeEnforcer({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const { setTheme, theme } = useTheme();

  React.useEffect(() => {
    // If the user is definitively logged out or their session expires, force dark mode.
    if (status === "unauthenticated" && theme !== "dark") {
      setTheme("dark");
    }
  }, [status, theme, setTheme]);

  return <>{children}</>;
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      <ThemeEnforcer>{children}</ThemeEnforcer>
    </NextThemesProvider>
  );
}