import React from "react";
import {
  Html,
  Body,
  Head,
  Heading,
  Hr,
  Container,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface SupportTicketProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function SupportTicketEmail({
  name,
  email,
  subject,
  message,
}: SupportTicketProps) {
  return (
    <Html>
      <Head />
      <Preview>New Support Request: {subject}</Preview>
      <Body style={main}>
        <Container style={container}>
          
          <Section style={header}>
            <Text style={companyName}>SubVantage Support</Text>
          </Section>

          <Section style={content}>
            <Heading style={heading}>New Support Ticket</Heading>
            <Text style={paragraph}>
              A new support request has been submitted via the SubVantage web dashboard. Here are the details:
            </Text>

            <Section style={detailsBox}>
              <Text style={detailItem}><strong>Name:</strong> {name}</Text>
              <Text style={detailItem}><strong>Email:</strong> {email}</Text>
              <Text style={detailItem}><strong>Subject:</strong> {subject}</Text>
            </Section>

            <Text style={messageLabel}>Message:</Text>
            <Text style={messageText}>
              {message}
            </Text>
          </Section>

          <Hr style={divider} />

          <Section style={footer}>
            <Text style={footerText}>
              This is an automated notification from SubVantage. Reply directly to this email to respond to {name}.
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "40px auto",
  padding: "0",
  borderRadius: "8px",
  border: "1px solid #e6ebf1",
  maxWidth: "600px",
};

const header = {
  padding: "24px 32px",
  borderBottom: "1px solid #e6ebf1",
};

const companyName = {
  fontSize: "20px",
  fontWeight: "bold",
  color: "#111827",
  margin: "0",
};

const content = {
  padding: "32px",
};

const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#111827",
  margin: "0 0 16px 0",
};

const paragraph = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#4b5563",
  margin: "0 0 24px 0",
};

const detailsBox = {
  backgroundColor: "#f9fafb",
  padding: "16px",
  borderRadius: "6px",
  marginBottom: "24px",
  border: "1px solid #f3f4f6",
};

const detailItem = {
  fontSize: "14px",
  color: "#374151",
  margin: "0 0 8px 0",
};

const messageLabel = {
  fontSize: "14px",
  fontWeight: "bold",
  color: "#111827",
  margin: "0 0 8px 0",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const messageText = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#374151",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
};

const divider = {
  borderTop: "1px solid #e6ebf1",
  margin: "0",
};

const footer = {
  padding: "24px 32px",
  backgroundColor: "#f9fafb",
  borderBottomLeftRadius: "8px",
  borderBottomRightRadius: "8px",
};

const footerText = {
  fontSize: "13px",
  lineHeight: "20px",
  color: "#6b7280",
  margin: "0",
};