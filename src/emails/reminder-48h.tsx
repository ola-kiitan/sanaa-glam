import { Text } from "@react-email/components";
import * as React from "react";
import { EmailShell, LabelValue } from "@/emails/shared";

type Reminder48hEmailProps = {
  clientName: string;
  serviceName: string;
  dateLabel: string;
  timeLabel: string;
  locationLabel: string;
};

export function Reminder48hEmail({
  clientName,
  serviceName,
  dateLabel,
  timeLabel,
  locationLabel,
}: Reminder48hEmailProps) {
  return (
    <EmailShell
      preview="Reminder: Your appointment is in 2 days"
      heading="Reminder: Appointment In 2 Days"
    >
      <Text style={{ color: "#3D2B3A", fontSize: "14px", margin: "0 0 14px" }}>
        Hi {clientName}, this is a friendly reminder for your upcoming appointment.
      </Text>
      <LabelValue label="Service" value={serviceName} />
      <LabelValue label="Date" value={dateLabel} />
      <LabelValue label="Time" value={timeLabel} />
      <LabelValue label="Location" value={locationLabel} />
      <Text style={{ color: "#7A5478", fontSize: "13px", marginTop: "14px" }}>
        If you need to make changes, please contact us as early as possible.
      </Text>
    </EmailShell>
  );
}
