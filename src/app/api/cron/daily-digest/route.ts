import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { TrialReminderEmail } from "@/components/emails/TrialReminder";
import { UpcomingBillEmail } from "@/components/emails/UpcomingBill";
import dayjs from "dayjs";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    // 1. Security Check
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = dayjs();
    const threeDaysFromNow = now.add(3, "day").endOf("day").toDate();
    const startOfToday = now.startOf("day").toDate();

    // 2. Fetch Subscriptions needing alerts
    // We look for subs renewing soon where we haven't sent an email TODAY.
    const subsToNotify = await prisma.subscription.findMany({
      where: {
        status: "ACTIVE",
        nextRenewalDate: {
          gte: now.toDate(),
          lte: threeDaysFromNow,
        },
        OR: [
          { lastNotifiedAt: null },
          { lastNotifiedAt: { lt: startOfToday } }, // Haven't notified today
        ],
      },
      include: { user: true, vendor: true },
      take: 20, // Rate Limit: Process only 20 emails per run to be safe
    });

    if (subsToNotify.length === 0) {
      return NextResponse.json({
        message: "No notifications needed",
        count: 0,
      });
    }

    const results = [];

    // 3. Process Emails
    for (const sub of subsToNotify) {
      if (!sub.user.email) continue;

      let emailComponent;
      let subject;

      // Logic: Different email for Trial vs Regular Bill
      if (sub.isTrial) {
        const daysLeft = dayjs(sub.nextRenewalDate).diff(now, "day");

        // 👇 UPDATE 1: Neutral Subject Line (Higher Deliverability)
        subject = `Trial ending soon for ${sub.vendor.name}`;

        emailComponent = TrialReminderEmail({
          userName: sub.user.name || "User",
          vendorName: sub.vendor.name,
          daysLeft: Math.max(0, daysLeft),
          renewalCost: `$${Number(sub.cost).toFixed(2)}`,
        });
      } else {
        // 👇 UPDATE 2: Neutral Subject Line
        subject = `Upcoming renewal for ${sub.vendor.name}`;

        emailComponent = UpcomingBillEmail({
          userName: sub.user.name || "User",
          vendorName: sub.vendor.name,
          amount: `$${Number(sub.cost).toFixed(2)}`,
          renewalDate: dayjs(sub.nextRenewalDate).format("MMM D, YYYY"),
        });
      }

      // Send Email
      const { error } = await resend.emails.send({
        from: "SubVantage Support <subvantage@iansebastian.dev>",
        to: sub.user.email,
        subject: subject,
        react: emailComponent,
      });

      if (!error) {
        // 4. Update Database (Mark as sent)
        await prisma.subscription.update({
          where: { id: sub.id },
          data: { lastNotifiedAt: new Date() },
        });
        results.push({ id: sub.id, status: "sent" });
      } else {
        results.push({ id: sub.id, status: "failed", error });
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    console.error("Cron Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
