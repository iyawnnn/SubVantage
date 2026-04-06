"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Send, Activity, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { sendSupportTicket } from "@/actions/support-actions";

export default function SupportPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [backPath, setBackPath] = useState("/");

  // Determine if the user is authenticated to route back properly
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const result = await sendSupportTicket(formData);

    setIsSubmitting(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Support ticket submitted successfully.");
      setIsSuccess(true);
      (event.target as HTMLFormElement).reset();
    }
  }

  return (
    // UI FIX: Precise height calculation removes the background gap while preventing desktop scrolling.
    <div className="min-h-[calc(100vh-81px)] bg-black text-white font-satoshi selection:bg-violet-500/30 overflow-x-hidden relative flex flex-col">
      
      <div className="fixed inset-0 z-0 pointer-events-none transform-gpu">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_1.5px,transparent_1.5px)] bg-[length:32px_32px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_40%,#000_70%,transparent_100%)]" />
        <div className="absolute top-1/4 left-[80%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.08)_0%,transparent_60%)] pointer-events-none" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 max-w-7xl pt-24 lg:pt-32 pb-12 lg:pb-16 flex-grow">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <a
            href="#"
            onClick={handleBack}
            className="inline-flex items-center text-sm font-medium text-zinc-500 hover:text-white transition-colors group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Return
          </a>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start w-full">
          
          <div className="flex flex-col gap-10 pr-0 lg:pr-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 text-white leading-[1.1]">
                How can we <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                  help you today?
                </span>
              </h1>
              <p className="text-lg text-zinc-400 max-w-xl font-medium">
                Whether you are experiencing a technical issue, have a billing question, or want to request a new feature, our team is ready to assist.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="flex flex-col gap-8"
            >
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/20 shrink-0">
                  <Activity className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Priority Routing</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    All support inquiries are escalated directly to our core engineering team. This ensures your issue is handled by the developers who built the system.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/20 shrink-0">
                  <ShieldCheck className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Security Reminder</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    We will never ask for your password or raw financial data. Please ensure you do not include sensitive credentials in your diagnostic message.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative rounded-2xl md:rounded-[2rem] border border-white/10 bg-[#0A0A0A] p-6 sm:p-8 shadow-2xl transform-gpu overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent z-20" />

              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in zoom-in duration-500">
                  <div className="h-20 w-20 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-6">
                    <CheckCircle2 className="h-10 w-10 text-violet-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Ticket Submitted</h3>
                  <p className="text-zinc-400 max-w-md mx-auto">
                    Your request has been successfully routed to our support queue. We will review the details and respond to your email address shortly.
                  </p>
                  <Button
                    onClick={() => setIsSuccess(false)}
                    variant="outline"
                    className="mt-8 border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-zinc-300 cursor-pointer"
                  >
                    Submit Another Query
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                        Full Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="w-full h-11 bg-[#111111] border border-zinc-800 rounded-lg px-4 text-white text-sm focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all placeholder:text-zinc-700"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                        Email Address
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="w-full h-11 bg-[#111111] border border-zinc-800 rounded-lg px-4 text-white text-sm focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all placeholder:text-zinc-700"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                      Subject
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      className="w-full h-11 bg-[#111111] border border-zinc-800 rounded-lg px-4 text-white text-sm focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all placeholder:text-zinc-700"
                      placeholder="e.g. Platform Bug, Account Inquiry"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                      Message Details
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4} 
                      className="w-full bg-[#111111] border border-zinc-800 rounded-lg p-4 text-white text-sm focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all placeholder:text-zinc-700 resize-none"
                      placeholder="Please detail the specifics of your issue..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-violet-600 text-white hover:bg-violet-700 font-bold text-sm shadow-[0_0_20px_rgba(139,92,246,0.15)] hover:shadow-[0_0_30px_rgba(139,92,246,0.25)] transition-all group cursor-pointer mt-2"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full border-2 border-white/50 border-t-white animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Dispatch Message
                        <Send className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}