import { Text } from "@react-email/components";
import * as React from "react";
import { EmailShell, LabelValue } from "@/emails/shared";

type BookingConfirmationEmailProps = {
  clientName: string;
  serviceName: string;
  dateLabel: string;
  timeLabel: string;
  locationLabel: string;
  priceLabel: string;
};

export function BookingConfirmationEmail({
  clientName,
  serviceName,
  dateLabel,
  timeLabel,
  locationLabel,
  priceLabel,
}: BookingConfirmationEmailProps) {
  return (
    <EmailShell
      preview="Your Sanaa Glam appointment is confirmed"
      heading="Your Appointment Is Confirmed"
    >
      <Text style={{ color: "#3D2B3A", fontSize: "14px", margin: "0 0 14px" }}>
        Hi {clientName}, your appointment has been confirmed.
      </Text>
      <LabelValue label="Service" value={serviceName} />
      <LabelValue label="Date" value={dateLabel} />
      <LabelValue label="Time" value={timeLabel} />
      <LabelValue label="Location" value={locationLabel} />
      <LabelValue label="Price" value={priceLabel} />
      <Text style={{ color: "#7A5478", fontSize: "13px", marginTop: "14px" }}>
        Please arrive with clean, moisturized skin and avoid applying makeup before the appointment.
      </Text>
    </EmailShell>
  );
}
