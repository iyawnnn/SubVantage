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
  session: { strategy: "jwt" },
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
          const user = await prisma.user.findUnique({ where: { email } });

          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) return null;

          if (user.isTwoFactorEnabled && user.twoFactorSecret) {
            if (!code) return null;
            const result = await verify({ token: code, secret: user.twoFactorSecret });
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

        const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
        
        if (dbUser?.isTwoFactorEnabled) {
          if (account?.provider === "credentials") {
            token.is2faVerified = true;
          } else {
            // Google OAuth users get flagged as strictly unverified right here
            token.is2faVerified = false; 
          }
        } else {
          token.is2faVerified = true;
        }
      }

      if (trigger === "update" && session?.twoFactorVerified) {
        token.is2faVerified = true;
      }
      
      return token;
    },
    // The Node.js server maps the flag safely
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = (token.id as string) || (token.sub as string);
        (session.user as any).is2faVerified = token.is2faVerified;
      }
      return session;
    },
  },
});