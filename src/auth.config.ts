import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/auth/login", // Redirect here if not logged in
    error: "/auth/error",  // Redirect here on auth errors
  },
  session: { strategy: "jwt" },
  callbacks: {
    // This logic runs in Middleware to protect routes
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard") ||
        nextUrl.pathname.startsWith("/archive") ||
        nextUrl.pathname.startsWith("/settings");

      const isAuthRoute = nextUrl.pathname.startsWith("/auth");

      // 1. If user is on an Auth page (Login/Signup) but is already logged in:
      // Redirect them to Dashboard.
      if (isAuthRoute) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true; // Allow access to auth pages if not logged in
      }

      // 2. If user is on a Protected Route (Dashboard, etc) but NOT logged in:
      // Redirect to Login.
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Triggers redirect to /auth/login
      }

      // 3. Allow access to public pages (Landing page /)
      return true;
    },
  },
  providers: [], // Providers are configured in auth.ts to avoid Edge errors
} satisfies NextAuthConfig;