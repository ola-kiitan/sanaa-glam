import { NextResponse } from "next/server";
import {
  getReminderCandidates,
  sendFollowUpEmail,
  sendReminder24h,
  sendReminder48h,
} from "@/lib/email-triggers";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization") ?? "";
  const expected = process.env.CRON_SECRET;

  if (!expected) {
    return NextResponse.json({ error: "CRON_SECRET is not configured" }, { status: 500 });
  }

  if (authHeader !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const candidates = await getReminderCandidates();

    let sent48h = 0;
    for (const appointmentId of candidates.reminder48hIds) {
      if (await sendReminder48h(appointmentId)) {
        sent48h += 1;
      }
    }

    let sent24h = 0;
    for (const appointmentId of candidates.reminder24hIds) {
      if (await sendReminder24h(appointmentId)) {
        sent24h += 1;
      }
    }

    let sentFollowUp = 0;
    for (const appointmentId of candidates.followUpIds) {
      if (await sendFollowUpEmail(appointmentId)) {
        sentFollowUp += 1;
      }
    }

    return NextResponse.json({
      ok: true,
      scanned: {
        reminder48h: candidates.reminder48hIds.length,
        reminder24h: candidates.reminder24hIds.length,
        followUp: candidates.followUpIds.length,
      },
      sent: {
        reminder48h: sent48h,
        reminder24h: sent24h,
        followUp: sentFollowUp,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Reminder cron failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
