import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/Footer"; 

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
});

const geist = localFont({
  src: "./fonts/GeistVF.woff2",
  variable: "--font-geist",
});

// Fallback prevents metadata initialization failure in local environments
const DOMAIN = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(DOMAIN),
  title: {
    default: "SubVantage - The Intelligent Subscription Tracker",
    template: "%s | SubVantage",
  },
  description: "Stop losing money on forgotten subscriptions. Track recurring expenses, get billing alerts, and optimize your financial health with SubVantage.",
  keywords: [
    "subscription tracker", 
    "recurring expense manager", 
    "finance dashboard", 
    "cancel subscriptions", 
    "money saver app", 
    "bill reminders", 
    "free trial tracker"
  ],
  authors: [{ name: "SubVantage Team" }],
  creator: "SubVantage",
  applicationName: "SubVantage",
  openGraph: {
    title: "SubVantage - Master Your Recurring Life",
    description: "The intelligent operating system that finds, tracks, and kills your forgotten subscriptions before they renew.",
    url: DOMAIN,
    siteName: "SubVantage",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SubVantage dashboard showing subscription analytics and upcoming renewal alerts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SubVantage - Stop the Bleeding",
    description: "Track and manage your subscriptions automatically.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${instrumentSans.variable} ${geist.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col`}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark" 
            enableSystem={false}
            disableTransitionOnChange
          >
            <main className="flex-1">
              {children}
            </main>
            
            <Footer />
            
            <Toaster position="bottom-right" richColors closeButton />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}