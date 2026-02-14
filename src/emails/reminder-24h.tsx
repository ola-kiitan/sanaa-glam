import { Text } from "@react-email/components";
import * as React from "react";
import { EmailShell, LabelValue } from "@/emails/shared";

type Reminder24hEmailProps = {
  clientName: string;
  serviceName: string;
  dateLabel: string;
  timeLabel: string;
  locationLabel: string;
};

export function Reminder24hEmail({
  clientName,
  serviceName,
  dateLabel,
  timeLabel,
  locationLabel,
}: Reminder24hEmailProps) {
  return (
    <EmailShell
      preview="Tomorrow: your Sanaa Glam appointment"
      heading="Tomorrow Is Your Appointment"
    >
      <Text style={{ color: "#3D2B3A", fontSize: "14px", margin: "0 0 14px" }}>
        Hi {clientName}, see you tomorrow.
      </Text>
      <LabelValue label="Service" value={serviceName} />
      <LabelValue label="Date" value={dateLabel} />
      <LabelValue label="Time" value={timeLabel} />
      <LabelValue label="Location" value={locationLabel} />
      <Text style={{ color: "#7A5478", fontSize: "13px", marginTop: "14px" }}>
        Please plan to arrive on time so we can give you the full session.
      </Text>
    </EmailShell>
  );
}
