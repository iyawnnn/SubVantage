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
  Layers,
  BarChart3,
  Globe,
  Mail,
  Plus,
  Minus,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";

export default function LandingPage() {
  // 🚀 SEO: Structured Data for Google Rich Results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SubVantage",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "A free financial dashboard to track recurring expenses, manage subscriptions, and receive billing alerts.",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "1024",
    },
    featureList:
      "Subscription tracking, Renewal alerts, Currency conversion, Spending analytics",
  };

  const scrollToProblem = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const elem = document.getElementById("problem");
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  function TelemetryRow({
    service,
    id,
    conversion,
    status,
    statusColor,
    delay,
  }: any) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4, delay: delay }}
        className="grid grid-cols-12 gap-4 p-4 border-b border-zinc-800/60 hover:bg-[#111111] transition-colors items-center transform-gpu"
      >
        <div className="col-span-5 sm:col-span-4">
          <div className="text-zinc-200 font-sans font-medium">{service}</div>
          <div className="text-zinc-600 text-xs mt-0.5">{id}</div>
        </div>
        <div className="col-span-4 sm:col-span-4 hidden sm:flex items-center text-zinc-400">
          {conversion}
        </div>
        <div className="col-span-7 sm:col-span-4 flex justify-end items-center gap-2">
          <span className={statusColor}>{status}</span>
          {/* Pulsing dot for active status */}
          <div
            className={`h-1.5 w-1.5 rounded-full ${statusColor === "text-zinc-500" ? "bg-zinc-700" : statusColor.replace("text-", "bg-")}`}
          />
        </div>
      </motion.div>
    );
  }

  function FeatureRow({
    num,
    icon,
    title,
    description,
  }: {
    num: string;
    icon: React.ReactNode;
    title: string;
    description: string;
  }) {
    return (
      <div className="group flex flex-col md:flex-row md:items-center justify-between py-8 md:py-10 border-b border-zinc-900 hover:bg-[#050505] transition-colors duration-300 px-4 md:px-8 -mx-4 md:-mx-8 cursor-default transform-gpu">
        {/* Icon and Title */}
        <div className="flex items-center gap-6 md:gap-8 w-full md:w-5/12 mb-4 md:mb-0">
          <div className="text-zinc-800 font-mono text-sm md:text-base font-bold group-hover:text-zinc-600 transition-colors">
            {num}
          </div>
          <div className="flex items-center gap-5">
            <div className="text-zinc-500 group-hover:text-violet-500 transition-colors duration-300 transform group-hover:scale-110">
              {icon}
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-zinc-100 group-hover:text-white transition-colors">
              {title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <div className="w-full md:w-6/12 md:pl-8">
          <p className="text-zinc-400 text-base md:text-lg leading-relaxed group-hover:text-zinc-300 transition-colors">
            {description}
          </p>
        </div>
      </div>
    );
  }

  function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="py-6 overflow-hidden transform-gpu">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full text-left group cursor-pointer"
        >
          <span className="text-lg md:text-xl font-medium text-zinc-300 group-hover:text-white transition-colors duration-200">
            {question}
          </span>

          {/* Dynamic Rotating Icon */}
          <div
            className={`ml-6 flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full border transition-all duration-300 ${
              isOpen
                ? "border-violet-500 bg-violet-500/10"
                : "border-zinc-800 bg-zinc-900/50 group-hover:border-zinc-700"
            }`}
          >
            <Plus
              className={`h-4 w-4 transition-transform duration-300 ${
                isOpen
                  ? "rotate-45 text-violet-500"
                  : "text-zinc-500 group-hover:text-zinc-300"
              }`}
            />
          </div>
        </button>

        {/* Smooth Content Reveal */}
        {isOpen && (
          <div className="pt-4 pr-12 text-zinc-400 text-base md:text-lg leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
            {answer}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white font-satoshi selection:bg-violet-500/30 overflow-x-hidden">
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
          className="w-full max-w-4xl rounded-2xl border border-white/10 bg-[#0A0A0A] px-4 md:px-6 py-3 shadow-2xl transition-colors mx-4"
        >
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center bg-transparent overflow-hidden transition-transform group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="SubVantage Logo"
                  width={44}
                  height={44}
                  className="object-cover"
                  priority
                />
              </div>
              <span className="hidden sm:block font-bold tracking-tight text-white/90 text-lg">
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
        <section className="relative min-h-screen flex flex-col justify-center items-center px-4 md:px-6 pt-32 pb-20 overflow-hidden bg-black transform-gpu">
          {/* ZERO-LAG BACKGROUND: Custom Data Matrix Pattern */}
          <div className="absolute inset-0 z-0 pointer-events-none transform-gpu">
            {/* Dot Matrix Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_1.5px,transparent_1.5px)] bg-[length:32px_32px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_40%,#000_70%,transparent_100%)]" />

            {/* High-Performance Ambient Light */}
            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-[80%] bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.12)_0%,transparent_60%)]" />
          </div>

          <div className="relative z-10 w-full max-w-[1200px] flex flex-col items-center text-center mt-10">
            {/* High-Contrast Typography */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-4xl mx-auto mb-8"
            >
              <h1 className="text-5xl sm:text-7xl lg:text-[5.5rem] font-bold tracking-tight text-white leading-[1.05] mb-6">
                Take command of your <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-400 to-zinc-600">
                  recurring expenses.
                </span>
              </h1>
              <p className="max-w-2xl mx-auto text-lg sm:text-xl text-zinc-400 leading-relaxed font-medium">
                A high-performance financial dashboard engineered to track
                subscriptions, normalize multiple currencies, and prevent
                unwanted renewals before they hit your bank.
              </p>
            </motion.div>

            {/* Precision CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center mb-20"
            >
              <Link href="/auth/signup" className="w-full sm:w-auto group">
                <Button className="w-full sm:w-auto h-12 px-8 rounded-lg bg-white text-black hover:bg-zinc-200 font-semibold text-sm transition-all shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:shadow-[0_0_50px_rgba(255,255,255,0.15)] transform-gpu hover:-translate-y-0.5 cursor-pointer">
                  Start tracking for free
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <a
                href="#problem"
                onClick={scrollToProblem}
                className="w-full sm:w-auto"
              >
                <Button
                  variant="outline"
                  className="w-full sm:w-auto h-12 px-8 rounded-lg border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-300 hover:text-white font-semibold text-sm transition-colors cursor-pointer"
                >
                  See how it works
                </Button>
              </a>
            </motion.div>

            {/* Optimized Visual Mockup */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[1100px] perspective-[2000px] transform-gpu"
            >
              <div className="relative rounded-2xl md:rounded-[2rem] border border-white/10 bg-[#0a0a0a] p-2 sm:p-4 shadow-2xl overflow-hidden transform-gpu transform rotate-x-[8deg] scale-100 hover:rotate-x-[0deg] hover:scale-[1.02] transition-all duration-700 ease-out">
                <div className="relative aspect-video w-full rounded-xl md:rounded-2xl overflow-hidden border border-zinc-800/80 bg-black">
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent z-20" />

                  <Image
                    src="/3d-dashboard.png"
                    alt="SubVantage Dashboard Interface"
                    fill
                    className="object-cover object-top opacity-90 transition-opacity duration-500 hover:opacity-100"
                    priority
                    unoptimized
                  />

                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* -----------------------------------------------------------------------------------------
            SOCIAL PROOF
        ----------------------------------------------------------------------------------------- */}
        <section className="py-24 border-y border-zinc-900 bg-black relative overflow-hidden transform-gpu">
          {/* ZERO-LAG AMBIENT LIGHT: Replaces blur-[100px] */}
          <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.06)_0%,transparent_50%)] pointer-events-none transform-gpu" />

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              {/* Text Context */}
              <div className="w-full lg:w-5/12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-bold tracking-widest uppercase mb-6 shadow-sm">
                  <Globe className="h-3.5 w-3.5 text-violet-400" />
                  Universal Recognition
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                  Compatible with your entire digital life.
                </h2>
                <p className="text-zinc-400 text-lg leading-relaxed">
                  Our recognition engine automatically normalizes pricing,
                  standardizes billing cycles, and identifies your essential
                  global services instantly.
                </p>
              </div>

              {/* The "Telemetry" Data Feed */}
              <div className="w-full lg:w-7/12 relative transform-gpu">
                {/* Fade masks for the top and bottom of the list */}
                <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />

                {/* ZERO-LAG CONTAINER: Solid bg-[#0A0A0A] instead of backdrop-blur */}
                <div className="rounded-xl border border-zinc-800 bg-[#0A0A0A] overflow-hidden flex flex-col font-mono text-sm shadow-2xl">
                  {/* Header */}
                  <div className="grid grid-cols-12 gap-4 p-4 border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-wider bg-[#050505]">
                    <div className="col-span-5 sm:col-span-4">Service</div>
                    <div className="col-span-4 sm:col-span-4 hidden sm:block">
                      Normalization
                    </div>
                    <div className="col-span-7 sm:col-span-4 text-right">
                      Status
                    </div>
                  </div>

                  {/* Simulated Data Rows */}
                  <div className="flex flex-col bg-[#0A0A0A]">
                    <TelemetryRow
                      service="Netflix Premium"
                      id="SUB_NX_892"
                      conversion="¥1,490 → $9.99"
                      status="Normalized"
                      statusColor="text-emerald-400"
                      delay={0.1}
                    />
                    <TelemetryRow
                      service="Spotify Duo"
                      id="SUB_SP_104"
                      conversion="€14.99 → $16.30"
                      status="Currency Converted"
                      statusColor="text-violet-400"
                      delay={0.2}
                    />
                    <TelemetryRow
                      service="Vercel Pro"
                      id="SUB_VC_092"
                      conversion="$20.00 → $20.00"
                      status="Active"
                      statusColor="text-zinc-300"
                      delay={0.3}
                    />
                    <TelemetryRow
                      service="Adobe Creative Cloud"
                      id="SUB_AD_441"
                      conversion="$54.99"
                      status="Renews in 2 Days"
                      statusColor="text-violet-400"
                      delay={0.4}
                    />
                    <TelemetryRow
                      service="AWS Cloud Services"
                      id="SUB_AW_993"
                      conversion="Variable"
                      status="Tracking..."
                      statusColor="text-zinc-500"
                      delay={0.5}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* -----------------------------------------------------------------------------------------
            THE TRAP SECTION
        ----------------------------------------------------------------------------------------- */}
{/* --- THE VULNERABILITY SECTION (Visual Left, Text Right) --- */}
        <section id="problem" className="py-24 md:py-32 relative bg-black border-t border-zinc-900 overflow-hidden transform-gpu">
          
          {/* ZERO-LAG AMBIENT LIGHT: Positioned behind the visual mockup */}
          <div className="absolute top-1/2 left-[20%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.06)_0%,transparent_50%)] pointer-events-none transform-gpu" />

          <div className="container mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">

              {/* Left Side: Engineered Visual Mockup */}
              <div className="order-2 md:order-1 relative w-full perspective-[2000px] transform-gpu group cursor-default">
                <div className="relative rounded-2xl md:rounded-[2rem] border border-zinc-800 bg-[#0A0A0A] p-6 md:p-8 shadow-2xl transform-gpu transform rotate-y-[8deg] scale-100 group-hover:rotate-y-[0deg] group-hover:scale-[1.02] transition-all duration-700 ease-out">
                  
                  {/* Mockup Header */}
                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800/60">
                    <div className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
                      Recent Transactions
                    </div>
                    <div className="h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
                  </div>

                  {/* Transaction 1 */}
                  <div className="flex items-center justify-between p-4 md:p-5 rounded-2xl bg-[#111111] border border-zinc-800 mb-4 transition-colors group-hover:border-zinc-700">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-black border border-zinc-800 flex items-center justify-center">
                        <span className="font-bold text-lg text-zinc-300">N</span>
                      </div>
                      <div>
                        <p className="font-bold text-base md:text-lg text-zinc-200">
                          Netflix Premium
                        </p>
                        <p className="text-xs md:text-sm text-zinc-500 font-medium">
                          Auto-renewed yesterday
                        </p>
                      </div>
                    </div>
                    <p className="font-mono font-bold text-lg md:text-xl text-zinc-300">
                      -$19.99
                    </p>
                  </div>

                  {/* Transaction 2 */}
                  <div className="flex items-center justify-between p-4 md:p-5 rounded-2xl bg-[#111111] border border-zinc-800 opacity-70 transition-colors group-hover:border-zinc-700">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-black border border-zinc-800 flex items-center justify-center">
                        <span className="font-bold text-lg text-zinc-300">A</span>
                      </div>
                      <div>
                        <p className="font-bold text-base md:text-lg text-zinc-200">
                          Adobe Creative Cloud
                        </p>
                        <p className="text-xs md:text-sm text-zinc-500 font-medium">
                          Auto-renewed 2 days ago
                        </p>
                      </div>
                    </div>
                    <p className="font-mono font-bold text-lg md:text-xl text-zinc-300">
                      -$54.99
                    </p>
                  </div>
                  
                  {/* Bottom fade out overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none rounded-b-[2rem]" />
                </div>
              </div>

              {/* Right Side: Text Context */}
              <div className="order-1 md:order-2 flex flex-col items-start">
                
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-bold tracking-widest uppercase mb-6 shadow-sm">
                  <AlertTriangle className="h-3.5 w-3.5 text-violet-400" />
                  Financial Leak Detected
                </div>
                
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 md:mb-8 leading-[1.1] tracking-tight">
                  The "Free Trial" <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 to-zinc-600">
                    trap is highly effective.
                  </span>
                </h2>
                
                <p className="text-lg text-zinc-400 leading-relaxed mb-8 md:mb-10 font-medium">
                  Service providers rely on you forgetting. That 7-day trial inevitably turns into a recurring monthly charge. Before you realize it, you have paid for a year of service you never utilized.
                </p>
                
                <ul className="space-y-5 w-full">
                  <li className="flex items-center gap-4 text-base md:text-lg text-zinc-300 font-medium">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full border border-zinc-800 bg-zinc-900 shrink-0">
                      <div className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                    </div>
                    <span>Forgetting to cancel free trials</span>
                  </li>
                  <li className="flex items-center gap-4 text-base md:text-lg text-zinc-300 font-medium">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full border border-zinc-800 bg-zinc-900 shrink-0">
                      <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                    </div>
                    <span>Paying for duplicate services</span>
                  </li>
                  <li className="flex items-center gap-4 text-base md:text-lg text-zinc-300 font-medium">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full border border-zinc-800 bg-zinc-900 shrink-0">
                      <div className="h-1.5 w-1.5 rounded-full bg-zinc-500" />
                    </div>
                    <span>Ignoring mystery charges on statements</span>
                  </li>
                </ul>
                
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
        {/* --- THE ENGINEERED LEDGER (Features) --- */}
        <section className="py-24 md:py-32 px-4 sm:px-6 bg-black relative transform-gpu">
          <div className="container mx-auto max-w-5xl">
            {/* Minimalist Header */}
            <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-900 pb-10">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                  Your Financial <br className="hidden md:block" /> Defense
                  System.
                </h2>
                <p className="text-lg md:text-xl text-zinc-400 font-medium">
                  We stripped away the spreadsheet clutter. What remains is
                  high-definition clarity.
                </p>
              </div>
              <div className="text-zinc-600 font-mono text-sm uppercase tracking-widest hidden md:block pb-2">
                Core Specifications
              </div>
            </div>

            {/* The Ledger List */}
            <div className="flex flex-col">
              <FeatureRow
                num="01"
                icon={<Globe className="h-6 w-6" />}
                title="Multi-Currency Engine"
                description="Pay in USD, EUR, JPY, or PHP? We automatically convert everything to your base currency using real-time exchange rates."
              />
              <FeatureRow
                num="02"
                icon={<Mail className="h-6 w-6" />}
                title="Pre-Charge Alerts"
                description="Receive a precise digest of upcoming bills straight to your inbox. Never get hit with a surprise overdraft fee again."
              />
              <FeatureRow
                num="03"
                icon={<Shield className="h-6 w-6" />}
                title="Zero-Knowledge Privacy"
                description="We don't sell data. We don't connect to your bank. Your financial credentials stay 100% offline, isolated, and secure."
              />
              <FeatureRow
                num="04"
                icon={<TrendingUp className="h-6 w-6" />}
                title="Velocity Analytics"
                description="Visualize your spending trends over a 6-month horizon. See instantly if you are cutting costs or inflating your lifestyle."
              />
              <FeatureRow
                num="05"
                icon={<Layers className="h-6 w-6" />}
                title="Smart Categorization"
                description="Sort your life by cost, name, category, or renewal date. Filter by active or paused subscriptions with zero latency."
              />
              <FeatureRow
                num="06"
                icon={<CreditCard className="h-6 w-6" />}
                title="Manual Override"
                description="Perfect for cash payments, split shared plans, or irregular gym bills that automated bank connectors consistently miss."
              />
            </div>
          </div>
        </section>

        {/* -----------------------------------------------------------------------------------------
            FAQ SECTION
        ----------------------------------------------------------------------------------------- */}
        {/* --- ENGINEERED FAQ --- */}
        <section className="py-24 md:py-32 bg-black border-t border-zinc-900 overflow-hidden transform-gpu">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col md:flex-row gap-16 md:gap-24">
              {/* Left Column: Sticky Header Context */}
              <div className="w-full md:w-1/3">
                <div className="sticky top-32">
                  <div className="text-zinc-600 font-mono text-xs uppercase tracking-widest mb-4">
                    Knowledge Base
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                    System <br /> Queries.
                  </h2>
                  <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                    Technical and operational specifics regarding the SubVantage
                    tracking engine.
                  </p>

                  <div className="h-px w-12 bg-zinc-800 mb-8" />
                </div>
              </div>

              {/* Right Column: Borderless Accordion */}
              <div className="w-full md:w-2/3">
                <div className="divide-y divide-zinc-900/80 border-t border-zinc-900/80">
                  <FAQItem
                    question="Is the tracking engine truly free?"
                    answer="Yes. The core tracking and notification infrastructure is completely free for individual use. You can track unlimited subscriptions and receive automated email alerts without ever providing a credit card."
                  />
                  <FAQItem
                    question="How does the Zero-Knowledge architecture work?"
                    answer="We operate on a manual-entry model. This means we never connect to your bank account, scrape your credit card statements, or store your financial credentials. Your data is isolated and controlled entirely by you."
                  />
                  <FAQItem
                    question="Does it support international subscription billing?"
                    answer="Absolutely. You can enter a subscription in JPY, EUR, GBP, or other major global currencies. The engine automatically normalizes it to your base currency using real-time exchange rates for precise aggregate tracking."
                  />
                  <FAQItem
                    question="What is the latency on email alerts?"
                    answer="Our system monitors your billing cycles continuously. Notifications are dispatched exactly 3 days prior to your scheduled renewal date, ensuring you have ample time to pause or cancel the service before a charge occurs."
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* -----------------------------------------------------------------------------------------
            CTA: "Bottom Line"
        ----------------------------------------------------------------------------------------- */}
        {/* --- HIGH-PERFORMANCE CTA --- */}
{/* --- HIGH-PERFORMANCE CTA --- */}
        <section className="py-32 px-4 sm:px-6 text-center bg-black relative overflow-hidden transform-gpu border-t border-zinc-900">
          
          {/* ZERO-LAG AMBIENT LIGHT: Strict Violet/Indigo Scheme */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.12)_0%,transparent_70%)] pointer-events-none" />

          <div className="container mx-auto max-w-4xl relative z-10 flex flex-col items-center">
            
            {/* Relatable Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/20 bg-violet-500/10 text-violet-300 text-xs font-bold tracking-widest uppercase mb-8">
              <Zap className="h-3.5 w-3.5" />
              Take back control
            </div>

            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 tracking-tight leading-[1.05]">
              Initialize your <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                tracking engine.
              </span>
            </h2>
            
            <p className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
              Join the users who are optimizing their cash flow. Set up your dashboard in minutes and never pay for an unwanted renewal again.
            </p>

            <div className="flex flex-col items-center gap-8 w-full">
              <Link href="/auth/signup" className="w-full sm:w-auto group">
                <Button className="w-full sm:w-auto h-14 px-10 rounded-lg bg-white text-black hover:bg-zinc-200 text-base font-bold shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:shadow-[0_0_50px_rgba(255,255,255,0.15)] transition-all transform-gpu hover:-translate-y-0.5 cursor-pointer">
                  Create Free Account
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              {/* Centered Trust Indicators without the bullet point */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 w-full text-sm text-zinc-500 font-medium">
                <span className="flex items-center gap-2.5">
                  <CreditCard className="h-4 w-4 text-violet-500" /> 
                  No credit card required
                </span>
                <span className="flex items-center gap-2.5">
                  <Lock className="h-4 w-4 text-indigo-500" /> 
                  Zero-knowledge architecture
                </span>
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}