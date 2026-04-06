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

      // 1. Basic Auth Check for internal pages
      if (isOnDashboard && !isLoggedIn) {
        return false; 
      }

      // 2. Keep logged-in users away from the login/signup pages
      if (isAuthRoute && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      // 3. Allow public routes
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;