import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { TrialReminderEmail } from "@/components/emails/TrialReminder";

export async function GET() {
  try {
    // Just checking if the client initialized
    if (!resend.apiKeys) {
      throw new Error("Resend Client not initialized");
    }

    return NextResponse.json({ 
      status: "Ready", 
      message: "Resend SDK initialized successfully." 
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}