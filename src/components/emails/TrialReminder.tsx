import * as React from "react";

interface TrialReminderProps {
  userName: string;
  vendorName: string;
  daysLeft: number;
  renewalCost: string;
}

export const TrialReminderEmail: React.FC<TrialReminderProps> = ({
  userName,
  vendorName,
  daysLeft,
  renewalCost,
}) => (
  <div style={{ fontFamily: "sans-serif", color: "#333", padding: "20px" }}>
    <h2 style={{ color: "#228be6" }}>SubTrack Alert</h2>
    <p>Hello {userName},</p>
    <p>
      Your trial for <strong>{vendorName}</strong> is ending in{" "}
      <span style={{ color: "#fa5252", fontWeight: "bold" }}>
        {daysLeft} days
      </span>
      .
    </p>
    <div
      style={{
        background: "#f8f9fa",
        padding: "15px",
        borderRadius: "8px",
        margin: "20px 0",
        border: "1px solid #e9ecef",
      }}
    >
      <p style={{ margin: 0, fontSize: "14px", color: "#868e96" }}>
        Estimated Renewal Cost:
      </p>
      <p style={{ margin: 0, fontSize: "24px", fontWeight: "bold" }}>
        {renewalCost}
      </p>
    </div>
    <p style={{ fontSize: "14px", color: "#868e96" }}>
      Please log in to SubTrack to cancel or approve this subscription.
    </p>
  </div>
);