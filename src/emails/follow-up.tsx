import { Text } from "@react-email/components";
import * as React from "react";
import { EmailShell, PrimaryButton } from "@/emails/shared";

type FollowUpEmailProps = {
  clientName: string;
  serviceName: string;
  reviewUrl: string;
  bookingUrl: string;
};

export function FollowUpEmail({
  clientName,
  serviceName,
  reviewUrl,
  bookingUrl,
}: FollowUpEmailProps) {
  return (
    <EmailShell
      preview="Thank you for choosing Sanaa Glam"
      heading="Thank You For Choosing Sanaa Glam"
    >
      <Text style={{ color: "#3D2B3A", fontSize: "14px", margin: "0 0 14px" }}>
        Hi {clientName}, thank you for trusting us with your {serviceName} look.
      </Text>
      <PrimaryButton href={reviewUrl}>Leave A Review</PrimaryButton>
      <PrimaryButton href={bookingUrl}>Book Again</PrimaryButton>
    </EmailShell>
  );
}
