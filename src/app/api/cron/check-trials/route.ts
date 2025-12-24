import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { TrialReminderEmail } from "@/components/emails/TrialReminder";
import dayjs from "dayjs";

export const dynamic = "force-dynamic"; // Defaults to auto, force dynamic for cron

export async function GET(req: Request) {
  try {
    // 1. Security Check
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: "Unauthorized: Bad Secret" },
        { status: 401 }
      );
    }

    // 2. Calculate Date Range (Next 48 Hours)
    const now = dayjs();
    const twoDaysFromNow = now.add(2, "day").toDate();

    console.log(
      "🔍 Checking for trials expiring between",
      now.format(),
      "and",
      dayjs(twoDaysFromNow).format()
    );

    // 3. Find Expiring Trials
    const expiringTrials = await prisma.subscription.findMany({
      where: {
        isTrial: true,
        nextRenewalDate: {
          gte: now.toDate(),
          lte: twoDaysFromNow,
        },
      },
      include: {
        user: true,
        vendor: true,
      },
    });

    console.log(`Found ${expiringTrials.length} expiring trials.`);

    if (expiringTrials.length === 0) {
      return NextResponse.json({
        message: "No trials expiring soon",
        count: 0,
      });
    }

    // 4. Send Emails
    const emailPromises = expiringTrials.map(async (sub) => {
      if (!sub.user.email) return null;

      const daysLeft = dayjs(sub.nextRenewalDate).diff(now, "day");

      // Attempt to send email
      const { data, error } = await resend.emails.send({
        from: "SubTrack <onboarding@resend.dev>",

        // ⛔️ OLD: to: sub.user.email,
        // ✅ NEW: Force it to the only allowed email for now
        to: "substrack.dev@gmail.com",

        subject: `⚠️ Action Required: ${sub.vendor.name} trial ending`,
        react: TrialReminderEmail({
          userName: sub.user.name || "User",
          vendorName: sub.vendor.name,
          daysLeft: Math.max(0, daysLeft),
          renewalCost: `$${Number(sub.cost).toFixed(2)}`,
        }),
      });

      if (error) {
        throw new Error(`Resend API Error: ${error.message}`);
      }

      return data;
    });

    await Promise.all(emailPromises);

    return NextResponse.json({
      success: true,
      processed: expiringTrials.length,
    });
  } catch (error: any) {
    // THIS is the fix: It returns the actual error message to Postman
    console.error("❌ CRON ERROR:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error.message || String(error),
      },
      { status: 500 }
    );
  }
}
