import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: process.env.SESSION_MAX_AGE ? parseInt(process.env.SESSION_MAX_AGE, 10) : 30 * 24 * 60 * 60,
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard") ||
        nextUrl.pathname.startsWith("/archive") ||
        nextUrl.pathname.startsWith("/settings");

      const isAuthRoute = nextUrl.pathname.startsWith("/auth");
      const isVerifyRoute = nextUrl.pathname.startsWith("/auth/verify-2fa");

      // 1. Protect Dashboard Routes (Basic Auth Check)
      if (isOnDashboard) {
        if (!isLoggedIn) return false; 
        return true; 
      }

      // 2. Manage Auth Routes
      if (isAuthRoute) {
        if (isVerifyRoute) return true; // Always allow access to the 2FA verify page
        
        if (isLoggedIn) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }

      // 3. Allow public routes
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;