import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { verify } from "otplib";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  code: z.string().optional(),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig, 
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password, code } = validatedFields.data;

          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) return null;

          if (user.isTwoFactorEnabled && user.twoFactorSecret) {
            if (!code) return null;

            // otplib v13 requires asynchronous verification and returns an object
            const result = await verify({
              token: code,
              secret: user.twoFactorSecret,
            });

            if (!result.valid) return null;
          }

          return user;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks, 
    async jwt({ token, user, trigger, session, account }) {
      if (user) {
        token.id = user.id;
        token.picture = user.image;

        // Check the database to see if this user has 2FA turned on
        const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
        const has2FA = dbUser?.isTwoFactorEnabled || false;

        if (!has2FA) {
          // If 2FA is off, they are verified by default
          token.is2faVerified = true;
        } else {
          // If they logged in via email/password, our authorize function already checked the code
          if (account?.provider === "credentials") {
            token.is2faVerified = true;
          } else {
            // They logged in via Google (OAuth), and 2FA is enabled. Flag them as UNVERIFIED.
            token.is2faVerified = false;
          }
        }
      }

      // If the user submits the correct code on the verify page, this upgrades the session
      if (trigger === "update" && session?.twoFactorVerified) {
        token.is2faVerified = true;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string || token.sub as string;
        if (token.picture) {
          session.user.image = token.picture as string;
        }
        // Pass the verification status down to the client layout
        (session as any).is2faVerified = token.is2faVerified;
      }
      return session;
    },
  },
});