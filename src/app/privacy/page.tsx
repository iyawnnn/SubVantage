"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Shield, Database, Lock, Mail, EyeOff } from "lucide-react";

export default function PrivacyPolicy() {
  const router = useRouter();
  const [backPath, setBackPath] = useState("/");

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((session) => {
        if (session && Object.keys(session).length > 0) {
          setBackPath("/dashboard");
        }
      })
      .catch(() => {});
  }, []);

  const handleBack = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push(backPath);
  };

  return (
    <div className="min-h-[calc(100vh-81px)] bg-black text-white font-satoshi selection:bg-violet-500/30 overflow-hidden flex flex-col relative">
      <div className="fixed inset-0 z-0 pointer-events-none transform-gpu">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_1.5px,transparent_1.5px)] bg-[length:32px_32px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_40%,#000_70%,transparent_100%)]" />
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-[80%] bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.1)_0%,transparent_60%)]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 max-w-4xl pt-24 pb-32 flex-grow">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <a 
            href="#" 
            onClick={handleBack}
            className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
            Return
          </a>

          <div className="mb-16 border-b border-zinc-800 pb-10">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-500">
              Privacy Policy
            </h1>
            <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">
              Effective Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          <div className="space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Database className="h-5 w-5 text-violet-500" />
                <h2 className="text-2xl font-bold text-zinc-100">1. Data Collection Architecture</h2>
              </div>
              <div className="pl-8 space-y-4 text-zinc-400 leading-relaxed text-lg">
                <p>
                  SubVantage is engineered with a principle of data minimization. We only collect the data explicitly required to provide the tracking and notification services.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong className="text-zinc-300">Account Credentials:</strong> Email address and authentication tokens utilized strictly for secure access.</li>
                  <li><strong className="text-zinc-300">Ledger Data:</strong> Subscription names, costs, billing cycles, and categories that you manually input into the system.</li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <EyeOff className="h-5 w-5 text-violet-500" />
                <h2 className="text-2xl font-bold text-zinc-100">2. The Zero-Knowledge Promise</h2>
              </div>
              <div className="pl-8 space-y-4 text-zinc-400 leading-relaxed text-lg">
                <p>
                  We employ a strict manual-entry model. We do not integrate with banking APIs (such as Plaid), we do not scrape your credit card statements, and we do not store your financial institution credentials. 
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Mail className="h-5 w-5 text-violet-500" />
                <h2 className="text-2xl font-bold text-zinc-100">3. Infrastructure & Third Parties</h2>
              </div>
              <div className="pl-8 space-y-4 text-zinc-400 leading-relaxed text-lg">
                <p>
                  To operate the application efficiently, we utilize select industry-standard infrastructure providers. Your data is never sold to advertisers or data brokers.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong className="text-zinc-300">Hosting & Database:</strong> Securely hosted on modern cloud infrastructure.</li>
                  <li><strong className="text-zinc-300">Transactional Emails:</strong> We use secure mail transfer agents exclusively to deliver renewal alerts and authentication links.</li>
                </ul>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Lock className="h-5 w-5 text-violet-500" />
                <h2 className="text-2xl font-bold text-zinc-100">4. Security & Data Retention</h2>
              </div>
              <div className="pl-8 space-y-4 text-zinc-400 leading-relaxed text-lg">
                <p>
                  All data transmitted between your client and our servers is encrypted via TLS. Passwords are securely hashed using modern cryptographic algorithms. You retain the right to delete your account and purge all associated ledger data from our databases at any time via the settings dashboard.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-5 w-5 text-violet-500" />
                <h2 className="text-2xl font-bold text-zinc-100">5. Contact Configuration</h2>
              </div>
              <div className="pl-8 space-y-4 text-zinc-400 leading-relaxed text-lg">
                <p>
                  For security reports, data deletion requests, or privacy inquiries, please initialize a request to the system administrator via our secure <Link href="/support" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">Support Channel</Link>.
                </p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}