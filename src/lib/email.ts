import { site } from "@/lib/site";

export async function sendTransactionalEmail(input: {
  to: string;
  subject: string;
  text: string;
  attachments?: { filename: string; content: string }[];
}) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return { sent: false as const, reason: "RESEND_API_KEY is not set" };
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${site.name} <noreply@${new URL(site.url).hostname}>`,
      to: [input.to],
      subject: input.subject,
      text: input.text,
      attachments: input.attachments,
    }),
  });
  if (!response.ok) {
    const body = await response.text();
    return { sent: false as const, reason: body };
  }
  return { sent: true as const };
}
