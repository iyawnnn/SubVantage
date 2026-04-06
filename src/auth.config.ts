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
      
      const requiresTwoFactor = isLoggedIn && (auth?.user as any)?.is2faVerified === false;

      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard") ||
        nextUrl.pathname.startsWith("/archive") ||
        nextUrl.pathname.startsWith("/settings");

      const isAuthRoute = nextUrl.pathname.startsWith("/auth");
      const isVerifyRoute = nextUrl.pathname.startsWith("/auth/verify-2fa");

      // 1. Unverified users are strictly trapped in the verify route until they pass
      if (requiresTwoFactor) {
        if (isVerifyRoute) return true;
        return Response.redirect(new URL("/auth/verify-2fa", nextUrl));
      }

      // 2. Fully verified users should not be able to access the login/signup pages
      if (isAuthRoute) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true; 
      }

      // 3. Protect all internal application routes from unauthenticated users
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Returning false automatically redirects to pages.signIn
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;