import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/Footer"; 

// Font Setup
const satoshi = localFont({
  src: "./fonts/Satoshi-Variable.ttf",
  variable: "--font-satoshi",
  weight: "300 900",
});

// Domain Configuration
const DOMAIN = "https://subvantage.iansebastian.dev";

// SEO Metadata Configuration
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
        alt: "SubVantage Dashboard Preview",
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
      <body className={`${satoshi.variable} font-satoshi antialiased bg-background text-foreground min-h-screen flex flex-col`}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* Main Content Area */}
            <main className="flex-1">
              {children}
            </main>
            
            {/* Global Footer */}
            <Footer />
            
            <Toaster position="top-right" richColors closeButton />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}