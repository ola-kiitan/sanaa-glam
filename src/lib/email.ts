import type { ReactElement } from "react";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const emailFrom = process.env.EMAIL_FROM;

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendEmail(to: string, subject: string, react: ReactElement): Promise<boolean> {
  if (!resend || !emailFrom) {
    console.error("Email disabled: RESEND_API_KEY or EMAIL_FROM is missing");
    return false;
  }

  try {
    await resend.emails.send({
      from: emailFrom,
      to,
      subject,
      react,
    });

    return true;
  } catch (error) {
    console.error("Email send failed:", error);
    return false;
  }
}
