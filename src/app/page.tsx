"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Zap,
  Shield,
  LayoutDashboard,
  AlertTriangle,
  CreditCard,
  Lock,
  Sparkles,
  BarChart3,
  Globe,
  Mail,
  Plus,
  Minus,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

export default function LandingPage() {
  // 🚀 SEO: Structured Data for Google Rich Results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "SubVantage",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "A free financial dashboard to track recurring expenses, manage subscriptions, and receive billing alerts.",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1024"
    },
    "featureList": "Subscription tracking, Renewal alerts, Currency conversion, Spending analytics"
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white font-satoshi selection:bg-violet-500/30 overflow-x-hidden">
      
      {/* 👇 SEO: Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* -----------------------------------------------------------------------------------------
          NAVIGATION
      ----------------------------------------------------------------------------------------- */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6">
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          // 👇 OPTIMIZATION: Solid background, no backdrop-blur for 60fps
          className="w-full max-w-4xl rounded-2xl border border-white/10 bg-[#0A0A0A] px-4 md:px-6 py-3 shadow-2xl transition-colors mx-4"
        >
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 shadow-inner border border-white/5 overflow-hidden group-hover:bg-white/10 transition-colors">
                <Image
                  src="/logo.png"
                  alt="SubVantage Logo"
                  width={32}
                  height={32}
                  className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <span className="hidden sm:block font-bold tracking-tight text-white/90">
                SubVantage
              </span>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3 md:gap-4">
              <Link
                href="/auth/login"
                className="text-xs font-medium text-zinc-400 hover:text-white transition-colors uppercase tracking-wider"
              >
                Log in
              </Link>
              <Link href="/auth/signup">
                <Button className="bg-white text-black hover:bg-zinc-200 rounded-lg px-4 md:px-5 h-8 md:h-9 text-[10px] md:text-xs font-bold uppercase tracking-wide transition-transform hover:scale-105">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </motion.nav>
      </header>

      <main>
        {/* -----------------------------------------------------------------------------------------
            HERO SECTION: "THE MONOLITH"
        ----------------------------------------------------------------------------------------- */}
        <section className="relative min-h-screen flex flex-col justify-center md:justify-end items-center text-center overflow-hidden">
          {/* Dynamic Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

          {/* Ambient Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] md:w-[800px] h-[500px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />

          {/* Content Container */}
          <div className="relative z-10 w-full max-w-7xl px-4 md:px-6 pb-0 pt-5 md:pt-48 flex flex-col items-center">
            {/* Massive Typography */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative mb-6 md:mb-10"
            >
              <h1 className="text-5xl sm:text-[11vw] md:text-[10vw] leading-[0.9] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-zinc-600 select-none">
                RECURRING
              </h1>
              <h1 className="text-5xl sm:text-[11vw] md:text-[10vw] leading-[0.9] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-400 to-zinc-800 select-none opacity-90">
                CHAOS.
              </h1>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full">
                <p className="text-xs md:text-xl font-medium text-violet-500 tracking-[0.3em] md:tracking-[0.5em] uppercase mix-blend-difference">
                  Terminated
                </p>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="max-w-xl text-zinc-400 text-sm md:text-xl leading-relaxed mb-8 md:mb-12 px-4"
            >
              Your subscriptions are bleeding you dry.{" "}
              <br className="hidden md:block" />
              <strong className="text-white">SubVantage</strong> is the
              intelligent dashboard to track, manage, and cancel unwanted
              expenses.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center gap-6 mb-12 md:mb-24 w-full justify-center px-6"
            >
              <Link href="/auth/signup" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto h-12 md:h-14 px-8 md:px-10 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm md:text-base shadow-xl transition-all hover:scale-105">
                  Take Control - It's Free
                </Button>
              </Link>
            </motion.div>

            {/* THE MONOLITH DASHBOARD IMAGE */}
            <motion.div
              initial={{ y: 200, opacity: 0, rotateX: 20 }}
              animate={{ y: 0, opacity: 1, rotateX: 0 }}
              transition={{ duration: 1.2, delay: 0.2, ease: "circOut" }}
              className="relative w-full perspective-[1000px] group"
            >
              <div className="relative rounded-t-2xl md:rounded-t-3xl border-t border-x border-white/10 bg-[#050505] shadow-2xl overflow-hidden transform-gpu transition-all duration-1000 group-hover:border-violet-500/20">
                {/* Glass Reflection */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                <div className="relative aspect-video w-full bg-[#0A0A0A]">
                  <Image
                    src="/3d-dashboard.png"
                    alt="SubVantage Dashboard Interface"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                    className="object-cover object-top opacity-90 group-hover:opacity-100 transition-opacity duration-700"
                    priority
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#020202] z-10" />
                </div>
              </div>

              {/* Bottom Glow */}
              <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[80%] h-[100px] bg-violet-600/30 blur-[100px] rounded-full pointer-events-none" />
            </motion.div>
          </div>
        </section>

        {/* -----------------------------------------------------------------------------------------
            SOCIAL PROOF
        ----------------------------------------------------------------------------------------- */}
        <section className="py-12 border-y border-white/5 bg-[#050505]">
          <div className="container mx-auto px-6 text-center">
            <p className="text-xs md:text-sm font-medium text-zinc-500 mb-8 uppercase tracking-widest">
              Compatible with 150+ Services & Currencies
            </p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-20 opacity-40 grayscale mix-blend-screen">
              <span className="text-lg md:text-xl font-bold font-mono">
                NETFLIX
              </span>
              <span className="text-lg md:text-xl font-bold font-mono">
                SPOTIFY
              </span>
              <span className="text-lg md:text-xl font-bold font-mono">
                ADOBE
              </span>
              <span className="text-lg md:text-xl font-bold font-mono">
                AWS
              </span>
              <span className="text-lg md:text-xl font-bold font-mono">
                OPENAI
              </span>
              <span className="text-lg md:text-xl font-bold font-mono">
                VERCEL
              </span>
            </div>
          </div>
        </section>

        {/* -----------------------------------------------------------------------------------------
            THE TRAP SECTION
        ----------------------------------------------------------------------------------------- */}
        <section id="problem" className="py-20 md:py-32 relative bg-[#020202]">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
              <div>
                <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-red-500/10 text-red-500 mb-6 md:mb-8 shadow-inner shadow-red-500/10 border border-red-500/20">
                  <AlertTriangle className="h-6 w-6 md:h-8 md:w-8" />
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white mb-6 md:mb-8 leading-[1.1]">
                  The "Free Trial" <br />
                  <span className="text-red-500">Trap is Real.</span>
                </h2>
                <p className="text-lg md:text-xl text-zinc-400 leading-relaxed mb-8 md:mb-10">
                  Companies bank on you forgetting. That 7-day trial turns into
                  a $50 monthly charge, and before you know it, you've paid for
                  a year of service you never used.
                </p>
                <ul className="space-y-4 md:space-y-6">
                  <li className="flex items-center gap-4 text-base md:text-lg text-zinc-300">
                    <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-violet-500 shrink-0" />
                    <span>Forgot to cancel free trials</span>
                  </li>
                  <li className="flex items-center gap-4 text-base md:text-lg text-zinc-300">
                    <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-violet-500 shrink-0" />
                    <span>Duplicate subscriptions (Spotify + Apple Music)</span>
                  </li>
                  <li className="flex items-center gap-4 text-base md:text-lg text-zinc-300">
                    <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-violet-500 shrink-0" />
                    <span>Mystery charges on your bank statement</span>
                  </li>
                </ul>
              </div>

              {/* Visual Mockup */}
              <div className="relative group cursor-default">
                <div className="absolute inset-0 bg-gradient-to-r from-red-900/20 to-orange-900/20 blur-[80px] rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative rounded-3xl border border-white/10 bg-[#0A0A0A] p-6 md:p-10 shadow-2xl space-y-6 transform rotate-3 group-hover:rotate-0 transition-transform duration-500 hover:scale-105">
                  <div className="flex items-center justify-between p-4 md:p-5 rounded-2xl bg-red-900/10 border border-red-500/20">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-red-500/20 flex items-center justify-center shadow-inner shadow-red-500/10">
                        <span className="font-black text-lg md:text-xl text-red-500">
                          N
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-base md:text-lg text-white">
                          Netflix Premium
                        </p>
                        <p className="text-xs md:text-sm text-red-400 font-medium">
                          Charged yesterday
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-lg md:text-xl text-white">
                      -$19.99
                    </p>
                  </div>
                  <div className="flex items-center justify-between p-4 md:p-5 rounded-2xl bg-white/5 border border-white/5 opacity-60">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-white/10 flex items-center justify-center text-white text-lg md:text-xl font-bold">
                        A
                      </div>
                      <div>
                        <p className="font-bold text-base md:text-lg text-white">
                          Adobe Creative Cloud
                        </p>
                        <p className="text-xs md:text-sm text-zinc-500">
                          Charged 2 days ago
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-lg md:text-xl text-white">
                      -$54.99
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* -----------------------------------------------------------------------------------------
            HOW IT WORKS
        ----------------------------------------------------------------------------------------- */}
        <section className="py-20 md:py-32 bg-[#050505] border-y border-white/5">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="text-center mb-16 md:mb-20">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Master your finances in 3 steps
              </h2>
              <p className="text-zinc-400 text-lg">
                No bank connection required. Privacy first.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 relative">
              {/* Connecting Line (Hidden on Mobile) */}
              <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent border-t border-dashed border-white/20" />

              <div className="relative flex flex-col items-center text-center group">
                <div className="h-20 w-20 md:h-24 md:w-24 rounded-3xl bg-[#0A0A0A] border border-white/10 flex items-center justify-center z-10 mb-6 md:mb-8 shadow-2xl group-hover:border-violet-500/50 transition-colors">
                  <LayoutDashboard className="h-8 w-8 md:h-10 md:w-10 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                  1. Add Subscriptions
                </h3>
                <p className="text-zinc-400 leading-relaxed max-w-xs text-sm md:text-base">
                  Manually input your active subscriptions. Netflix, Spotify,
                  Gym, SaaS tools - track it all in one place.
                </p>
              </div>

              <div className="relative flex flex-col items-center text-center group">
                <div className="h-20 w-20 md:h-24 md:w-24 rounded-3xl bg-[#0A0A0A] border border-white/10 flex items-center justify-center z-10 mb-6 md:mb-8 shadow-2xl group-hover:border-violet-500/50 transition-colors">
                  <Zap className="h-8 w-8 md:h-10 md:w-10 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                  2. Set Alerts
                </h3>
                <p className="text-zinc-400 leading-relaxed max-w-xs text-sm md:text-base">
                  Configure renewal notifications. We'll email you before a
                  payment happens so you can decide to keep or cancel.
                </p>
              </div>

              <div className="relative flex flex-col items-center text-center group">
                <div className="h-20 w-20 md:h-24 md:w-24 rounded-3xl bg-[#0A0A0A] border border-white/10 flex items-center justify-center z-10 mb-6 md:mb-8 shadow-2xl group-hover:border-violet-500/50 transition-colors">
                  <BarChart3 className="h-8 w-8 md:h-10 md:w-10 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                  3. Analyze & Optimize
                </h3>
                <p className="text-zinc-400 leading-relaxed max-w-xs text-sm md:text-base">
                  See your monthly burn rate. Identify duplicate costs. Optimize
                  your spending velocity and save money.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* -----------------------------------------------------------------------------------------
            DETAILED FEATURES
        ----------------------------------------------------------------------------------------- */}
        <section className="py-20 md:py-32 px-6 bg-[#020202]">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16 md:mb-24">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Your Financial Defense System
              </h2>
              <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto">
                We replaced the spreadsheet clutter with high-definition
                clarity.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <div className="p-6 md:p-8 rounded-3xl bg-[#0A0A0A] border border-white/5 hover:border-violet-500/30 transition-all group">
                <div className="h-12 w-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-6 border border-violet-500/20 group-hover:bg-violet-500/20 transition-colors">
                  <Globe className="h-6 w-6 text-violet-400" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                  Multi-Currency Support
                </h3>
                <p className="text-zinc-400 leading-relaxed text-sm md:text-base">
                  Pay in USD, EUR, JPY, or PHP? We automatically convert
                  everything to your base currency using real-time exchange
                  rates.
                </p>
              </div>

              <div className="p-6 md:p-8 rounded-3xl bg-[#0A0A0A] border border-white/5 hover:border-emerald-500/30 transition-all group">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                  <Mail className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                  Email Notifications
                </h3>
                <p className="text-zinc-400 leading-relaxed text-sm md:text-base">
                  Receive a digest of upcoming bills straight to your inbox.
                  Never get hit with a surprise overdraft fee again.
                </p>
              </div>

              <div className="p-6 md:p-8 rounded-3xl bg-[#0A0A0A] border border-white/5 hover:border-indigo-500/30 transition-all group">
                <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
                  <Shield className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                  Zero-Knowledge Privacy
                </h3>
                <p className="text-zinc-400 leading-relaxed text-sm md:text-base">
                  We don't sell your data. We don't connect to your bank
                  account. Your financial credentials stay 100% offline and
                  secure.
                </p>
              </div>

              <div className="p-6 md:p-8 rounded-3xl bg-[#0A0A0A] border border-white/5 hover:border-pink-500/30 transition-all group">
                <div className="h-12 w-12 rounded-xl bg-pink-500/10 flex items-center justify-center mb-6 border border-pink-500/20 group-hover:bg-pink-500/20 transition-colors">
                  <TrendingUp className="h-6 w-6 text-pink-400" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                  Velocity Charts
                </h3>
                <p className="text-zinc-400 leading-relaxed text-sm md:text-base">
                  Visualize your spending trends over 6 months. See if you are
                  cutting costs or inflating your lifestyle.
                </p>
              </div>

              <div className="p-6 md:p-8 rounded-3xl bg-[#0A0A0A] border border-white/5 hover:border-orange-500/30 transition-all group">
                <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6 border border-orange-500/20 group-hover:bg-orange-500/20 transition-colors">
                  <Sparkles className="h-6 w-6 text-orange-400" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                  Smart Sorting
                </h3>
                <p className="text-zinc-400 leading-relaxed text-sm md:text-base">
                  Sort by cost, name, category, or renewal date. Filter by
                  active or paused subscriptions instantly.
                </p>
              </div>

              <div className="p-6 md:p-8 rounded-3xl bg-[#0A0A0A] border border-white/5 hover:border-cyan-500/30 transition-all group">
                <div className="h-12 w-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-6 border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-colors">
                  <CreditCard className="h-6 w-6 text-cyan-400" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                  Manual Control
                </h3>
                <p className="text-zinc-400 leading-relaxed text-sm md:text-base">
                  Perfect for cash payments, shared plans, or irregular bills
                  that bank connectors usually miss.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* -----------------------------------------------------------------------------------------
            FAQ SECTION
        ----------------------------------------------------------------------------------------- */}
        <section className="py-20 md:py-24 bg-[#050505] border-t border-white/5">
          <div className="container mx-auto max-w-4xl px-6">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <FAQItem
                question="Is SubVantage really free?"
                answer="Yes, SubVantage is 100% free for individual use. You can track unlimited subscriptions, set up email alerts, and access all dashboard features without paying a dime."
              />
              <FAQItem
                question="Is it safe? Do you connect to my bank?"
                answer="SubVantage is built with a 'Privacy-First' architecture. We do NOT connect to your bank account or read your credit card statements. You manually input the data you want to track, meaning your sensitive banking credentials remain completely offline and untouched."
              />
              <FAQItem
                question="Can I track international subscriptions?"
                answer="Absolutely. We support over 150 currencies. You can enter a subscription in JPY, EUR, or GBP, and we will automatically convert it to your main currency (like USD) using real-time exchange rates for accurate totals."
              />
              <FAQItem
                question="How do the email alerts work?"
                answer="Once you set a renewal date for a subscription, our system monitors it. 3 days before the billing cycle hits, we send a notification to your email, giving you time to cancel if you no longer need the service."
              />
            </div>
          </div>
        </section>

        {/* -----------------------------------------------------------------------------------------
            CTA: "Bottom Line"
        ----------------------------------------------------------------------------------------- */}
        <section className="py-20 md:py-32 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-violet-900/10 pointer-events-none" />

          <div className="container mx-auto max-w-4xl relative z-10">
            <h2 className="text-5xl md:text-7xl font-black text-white mb-6 md:mb-8 tracking-tighter leading-tight">
              Stop the bleeding. <br /> Start saving.
            </h2>
            <p className="text-lg md:text-xl text-zinc-400 mb-10 md:mb-12 max-w-2xl mx-auto">
              Join smart users who are saving an average of{" "}
              <strong>$460/year</strong> just by organizing their subscriptions.
            </p>

            <div className="flex flex-col items-center gap-8">
              <Link href="/auth/signup">
                <Button className="h-14 md:h-16 px-12 md:px-16 rounded-full bg-white text-black hover:bg-zinc-200 text-lg md:text-xl font-bold shadow-xl transition-transform hover:scale-105">
                  Create Free Account
                </Button>
              </Link>
              <div className="flex items-center gap-8 text-xs md:text-sm text-zinc-500 font-medium">
                <span className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" /> No credit card needed
                </span>
                <span className="flex items-center gap-2">
                  <Lock className="h-4 w-4" /> Private & Secure
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// Helper Component for FAQ Accordion
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-white/5 rounded-2xl bg-[#0A0A0A] overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-5 md:p-6 text-left hover:bg-white/5 transition-colors"
      >
        <span className="font-bold text-white text-base md:text-lg">
          {question}
        </span>
        {isOpen ? (
          <Minus className="h-5 w-5 text-zinc-500 shrink-0 ml-4" />
        ) : (
          <Plus className="h-5 w-5 text-zinc-500 shrink-0 ml-4" />
        )}
      </button>
      {isOpen && (
        <div className="px-5 md:px-6 pb-6 pt-0 text-zinc-400 leading-relaxed border-t border-white/5 pt-4 text-sm md:text-base animate-in fade-in slide-in-from-top-2">
          {answer}
        </div>
      )}
    </div>
  );
}