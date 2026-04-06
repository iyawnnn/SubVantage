import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Button,
  Hr,
} from "@react-email/components";
import * as React from "react";

interface UpcomingBillProps {
  userName: string;
  vendorName: string;
  amount: string;
  renewalDate: string;
}

export const UpcomingBillEmail = ({
  userName,
  vendorName,
  amount,
  renewalDate,
}: UpcomingBillProps) => {
  return (
    <Html>
      <Head />
      <Preview>Upcoming renewal: {vendorName}</Preview>
      <Body style={main}>
        <Container style={container}>
          
          {/* Main Card */}
          <Section style={card}>
            <Heading style={h1}>Upcoming Renewal</Heading>
            <Text style={text}>Hi {userName},</Text>
            <Text style={text}>
              Your subscription for <strong style={bold}>{vendorName}</strong> is scheduled to renew automatically on <span style={dateHighlight}>{renewalDate}</span>.
            </Text>

            <Hr style={divider} />

            {/* Invoice Details */}
            <Section style={detailsTable}>
              <Row style={tableRow}>
                <Column style={tableLabel}>Service</Column>
                <Column style={tableValue}>{vendorName}</Column>
              </Row>
              <Row style={tableRow}>
                <Column style={tableLabel}>Date</Column>
                <Column style={tableValue}>{renewalDate}</Column>
              </Row>
              <Row style={tableRow}>
                <Column style={tableLabel}>Payment Method</Column>
                <Column style={tableValue}>Default Card</Column>
              </Row>
              <Hr style={innerDivider} />
              <Row style={tableRow}>
                <Column style={tableLabel}>Total</Column>
                <Column style={tableValueLarge}>{amount}</Column>
              </Row>
            </Section>

            <Hr style={divider} />

            {/* Action */}
            <Section style={btnContainer}>
              <Button 
                style={button} 
                href="https://subvantage.iansebastian.dev/dashboard"
              >
                Manage Subscription
              </Button>
            </Section>
            
            <Text style={subtext}>
              If you want to keep this subscription, no action is needed. You can view your invoice history in your dashboard.
            </Text>
          </Section>

          {/* Footer */}
          <Text style={footer}>
            <Link href="https://subvantage.iansebastian.dev" style={footerLink}>SubVantage</Link> • 
            <Link href="https://subvantage.iansebastian.dev/dashboard" style={footerLink}> Dashboard</Link> • 
            {/* Changed 'Help Center' to 'Settings' */}
            <Link href="https://subvantage.iansebastian.dev/settings" style={footerLink}> Settings</Link>
          </Text>
          <Text style={footerCopyright}>
            © {new Date().getFullYear()} SubVantage Inc. <br />
            Designed for smart spenders.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  padding: "40px 0",
};

const container = {
  margin: "0 auto",
  padding: "0",
  maxWidth: "580px",
};

const card = {
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  border: "1px solid #e0e0e0",
  padding: "40px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.02)",
};

const h1 = {
  color: "#1a1b25",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "1.3",
  margin: "0 0 20px",
  textAlign: "left" as const,
};

const text = {
  color: "#4e5266",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 16px",
};

const bold = {
  color: "#1a1b25",
  fontWeight: "600",
};

const dateHighlight = {
  backgroundColor: "#f0f9ff",
  color: "#0284c7",
  padding: "2px 6px",
  borderRadius: "4px",
  fontWeight: "600",
};

const divider = {
  borderColor: "#e6ebf1",
  margin: "24px 0",
};

const innerDivider = {
  borderColor: "#f1f5f9",
  margin: "12px 0",
};

const detailsTable = {
  width: "100%",
};

const tableRow = {
  marginBottom: "8px",
};

const tableLabel = {
  color: "#8898aa",
  fontSize: "13px",
  fontWeight: "500",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  paddingBottom: "8px",
};

const tableValue = {
  color: "#1a1b25",
  fontSize: "15px",
  fontWeight: "500",
  textAlign: "right" as const,
  paddingBottom: "8px",
};

const tableValueLarge = {
  color: "#1a1b25",
  fontSize: "18px",
  fontWeight: "700",
  textAlign: "right" as const,
  paddingBottom: "8px",
};

const btnContainer = {
  textAlign: "center" as const,
  marginTop: "24px",
};

const button = {
  backgroundColor: "#6366f1",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "12px",
  boxShadow: "0 4px 6px -1px rgba(99, 102, 241, 0.2)",
};

const subtext = {
  color: "#8898aa",
  fontSize: "13px",
  lineHeight: "20px",
  marginTop: "24px",
  textAlign: "center" as const,
};

const footer = {
  textAlign: "center" as const,
  marginTop: "32px",
};

const footerLink = {
  color: "#8898aa",
  fontSize: "13px",
  textDecoration: "none",
  margin: "0 8px",
};

const footerCopyright = {
  color: "#b0bac9",
  fontSize: "12px",
  marginTop: "16px",
  textAlign: "center" as const,
  lineHeight: "20px",
};

export default UpcomingBillEmail;