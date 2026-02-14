import { Text } from "@react-email/components";
import * as React from "react";
import { EmailShell, LabelValue, PrimaryButton } from "@/emails/shared";

type CancellationEmailProps = {
  clientName: string;
  serviceName: string;
  dateLabel: string;
  timeLabel: string;
  bookingUrl: string;
};

export function CancellationEmail({
  clientName,
  serviceName,
  dateLabel,
  timeLabel,
  bookingUrl,
}: CancellationEmailProps) {
  return (
    <EmailShell
      preview="Your appointment has been cancelled"
      heading="Appointment Cancelled"
    >
      <Text style={{ color: "#3D2B3A", fontSize: "14px", margin: "0 0 14px" }}>
        Hi {clientName}, your appointment has been cancelled.
      </Text>
      <LabelValue label="Service" value={serviceName} />
      <LabelValue label="Date" value={dateLabel} />
      <LabelValue label="Time" value={timeLabel} />
      <PrimaryButton href={bookingUrl}>Book A New Appointment</PrimaryButton>
    </EmailShell>
  );
}
