import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { TrialReminderEmail } from "@/components/emails/TrialReminder";
import { UpcomingBillEmail } from "@/components/emails/UpcomingBill";

export async function GET() {
  try {
    // 1. Send the "Trial Ending" Design
    const trialEmail = await resend.emails.send({
      from: "SubVantage Support <updates@subvantage.iansebastian.dev>",
      to: "ianmacabulos0@gmail.com", // ⚠️ YOUR REAL EMAIL
      subject: "Test: Trial Ending Design (Light Mode)",
      react: TrialReminderEmail({
        userName: "Ian",
        vendorName: "Adobe Creative Cloud",
        daysLeft: 2,
        renewalCost: "$54.99",
      }),
    });

    // 2. Send the "Upcoming Bill" Design
    const billEmail = await resend.emails.send({
      from: "SubVantage Support <updates@subvantage.iansebastian.dev>",
      to: "ianmacabulos0@gmail.com",
      subject: "Test: Upcoming Bill Design (Light Mode)",
      react: UpcomingBillEmail({
        userName: "Ian",
        vendorName: "Netflix Premium",
        amount: "$19.99",
        renewalDate: "Jan 25, 2024",
      }),
    });

    return NextResponse.json({ 
      status: "Designs sent!", 
      trialId: trialEmail.data?.id, 
      billId: billEmail.data?.id 
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}