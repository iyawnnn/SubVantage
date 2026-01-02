import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { TrialReminderEmail } from "@/components/emails/TrialReminder";
import dayjs from "dayjs";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = dayjs();
    const twoDaysFromNow = now.add(2, "day").toDate();

    // 👇 UPDATE 1: Check BOTH startDate and nextRenewalDate
    const expiringTrials = await prisma.subscription.findMany({
      where: {
        isTrial: true,
        OR: [
          // Case A: Standard Trial (Renewal is approaching)
          { 
            nextRenewalDate: { 
              gte: now.toDate(), 
              lte: twoDaysFromNow 
            } 
          },
          // Case B: Future Start Trial (Start Date IS the trial end)
          { 
            startDate: { 
              gte: now.toDate(), 
              lte: twoDaysFromNow 
            } 
          }
        ]
      },
      include: { user: true, vendor: true },
    });

    if (expiringTrials.length === 0) {
      return NextResponse.json({ message: "No trials found", count: 0 });
    }

    const emailPromises = expiringTrials.map(async (sub) => {
      if (!sub.user.email) return null;

      // 👇 UPDATE 2: Calculate correct target date
      // If the subscription hasn't technically started yet, the "End Date" is the Start Date.
      const startDate = dayjs(sub.startDate);
      const isFutureStart = startDate.isAfter(now);
      
      const targetDate = isFutureStart ? startDate : dayjs(sub.nextRenewalDate);
      const daysLeft = targetDate.diff(now, "day");

      const { data, error } = await resend.emails.send({
        from: "SubVantage <updates@subvantage.iansebastian.dev>",
        to: sub.user.email,
        subject: `⚠️ Action Required: ${sub.vendor.name} trial ending`,
        react: TrialReminderEmail({
          userName: sub.user.name || "User",
          vendorName: sub.vendor.name,
          daysLeft: Math.max(0, daysLeft),
          renewalCost: formatCurrency(Number(sub.cost), sub.currency), // Helper for nice currency
        }),
      });

      if (error) throw new Error(error.message);
      return data;
    });

    await Promise.all(emailPromises);

    return NextResponse.json({
      success: true,
      processed: expiringTrials.length,
    });
  } catch (error: any) {
    console.error("Cron Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Simple helper to format currency inside the cron job
function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
}