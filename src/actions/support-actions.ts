"use server";

import { resend } from "@/lib/resend";
import SupportTicketEmail from "@/components/emails/SupportTicket";

export async function sendSupportTicket(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !subject || !message) {
    return { error: "All telemetry fields are required to initialize a ticket." };
  }

  try {
    await resend.emails.send({
      from: "SubVantage Support <onboarding@resend.dev>", 
      to: "iannmacabulos@gmail.com",
      subject: `[SubVantage Support] ${subject}`,
      replyTo: email,
      react: SupportTicketEmail({ name, email, subject, message }),
    });

    return { success: true };
  } catch (error) {
    console.error("Support Email Error:", error);
    return { error: "Failed to dispatch message to the server. Please try again." };
  }
}