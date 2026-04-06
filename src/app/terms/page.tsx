"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Scale, AlertTriangle, Terminal, Code2, Gavel } from "lucide-react";

export default function TermsOfService() {
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
    <div className="min-h-[calc(100vh-81px)] bg-background text-foreground font-satoshi selection:bg-primary/30 overflow-hidden flex flex-col relative transition-colors duration-300">
      <div className="fixed inset-0 z-0 pointer-events-none transform-gpu">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(150,150,150,0.15)_1.5px,transparent_1.5px)] bg-[length:32px_32px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_40%,#000_70%,transparent_100%)]" />
        <div className="absolute top-[80%] left-1/2 -translate-x-1/2 w-[80%] h-[80%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
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
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-8 group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
            Return
          </a>

          <div className="mb-16 border-b border-border/50 pb-10">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-foreground to-muted-foreground">
              Terms of Service
            </h1>
            <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest">
              System Initialization: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          <div className="space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Terminal className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">1. Acceptance of Parameters</h2>
              </div>
              <div className="pl-8 space-y-4 text-muted-foreground leading-relaxed text-lg">
                <p>
                  By authenticating and utilizing the SubVantage software ("Service"), you agree to be bound by these Terms of Service. If you do not accept these terms in their entirety, you must terminate your session and cease use of the Service immediately.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Code2 className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">2. Nature of the Software</h2>
              </div>
              <div className="pl-8 space-y-4 text-muted-foreground leading-relaxed text-lg">
                <p>
                  SubVantage operates as a manual tracking dashboard engineered for personal organization. We are not a financial institution, fiduciary, or automated billing processor. The integrity and accuracy of the notifications, analytics, and currency conversions are entirely dependent upon the accuracy of the inputs you manually provide.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <h2 className="text-2xl font-bold text-foreground">3. Limitation of Liability (Strict)</h2>
              </div>
              <div className="pl-8 space-y-4 text-muted-foreground leading-relaxed text-lg">
                <p className="font-bold text-foreground uppercase tracking-wide text-sm">Please read carefully:</p>
                <p>
                  The Service is provided on an <strong className="text-foreground/90">"AS IS"</strong> and <strong className="text-foreground/90">"AS AVAILABLE"</strong> basis. SubVantage and its developers explicitly disclaim all warranties, express or implied.
                </p>
                <p>
                  Under no circumstances shall the developers, maintainers, or hosting providers of SubVantage be held liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the service. This includes, but is not limited to: missed subscription cancellations, unexpected auto-renewal charges, bank overdraft fees, or data loss due to server latency or email delivery failure.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Scale className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">4. User Accountability</h2>
              </div>
              <div className="pl-8 space-y-4 text-muted-foreground leading-relaxed text-lg">
                <p>
                  You are solely responsible for maintaining the confidentiality of your authentication credentials. You are responsible for executing the actual cancellation of your subscriptions on the respective providers' platforms. SubVantage cannot and does not cancel subscriptions on your behalf.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <Gavel className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">5. Right to Terminate</h2>
              </div>
              <div className="pl-8 space-y-4 text-muted-foreground leading-relaxed text-lg">
                <p>
                  We reserve the right to suspend or terminate accounts, databases, or the entire Service at any time, with or without cause or notice, and without liability to you.
                </p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}