import nodemailer from "nodemailer";
import type { Env } from "../config/env";
import { env, smtpConfigured } from "../config/env";

export type ContactEmailPayload = {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string | null;
  service?: string | null;
  inquiry: string;
  createdAt: Date;
};

function getNotifyRecipients(): string[] {
  const raw = env().CONTACT_NOTIFY_TO ?? "";
  return raw
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

function formatSubmittedAt(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Amman",
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  const dayPeriod = get("dayPeriod").toLowerCase();
  return `${get("weekday")}, ${get("day")} ${get("month")} ${get("year")} at ${get("hour")}:${get("minute")} ${dayPeriod}`;
}

function buildContactEmailText(payload: ContactEmailPayload): string {
  const config = env();
  const phone = payload.phoneNumber?.trim() || "—";
  const service = payload.service?.trim() || "—";
  const dashboardUrl =
    config.CONTACT_DASHBOARD_URL ?? "https://dashboard.mafateehgroup.com";

  return [
    "A new contact form message was submitted on Mafateeh.",
    "",
    "Please check the admin dashboard for the full details.",
    `Dashboard: ${dashboardUrl}`,
    "",
    "--- Submission preview ---",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Phone: ${phone}`,
    `Service: ${service}`,
    `Submitted: ${formatSubmittedAt(payload.createdAt)}`,
    "",
    "Message:",
    payload.inquiry,
  ].join("\n");
}

/** Gmail SMTP requires the From address to match the authenticated account. */
function resolveFromAddress(config: Env): string {
  const custom = config.SMTP_FROM?.trim();
  if (custom && custom.includes("@") && config.SMTP_USER && custom.includes(config.SMTP_USER)) {
    return custom;
  }
  if (config.SMTP_USER) {
    return `"Mafateeh Contact" <${config.SMTP_USER}>`;
  }
  return custom ?? "Mafateeh Contact <noreply@mafateeh.com>";
}

function createTransport(config: Env) {
  return nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    secure: config.SMTP_SECURE,
    requireTLS: !config.SMTP_SECURE && config.SMTP_PORT === 587,
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASS,
    },
  });
}

export async function sendContactNotification(
  payload: ContactEmailPayload,
): Promise<void> {
  if (!smtpConfigured()) {
    // eslint-disable-next-line no-console
    console.warn("SMTP not configured; skipping contact notification email.");
    return;
  }

  const recipients = getNotifyRecipients();
  if (recipients.length === 0) {
    // eslint-disable-next-line no-console
    console.warn("CONTACT_NOTIFY_TO is empty; skipping contact notification email.");
    return;
  }

  const config = env();
  const transporter = createTransport(config);
  const from = resolveFromAddress(config);

  await transporter.verify();
  const info = await transporter.sendMail({
    from,
    to: recipients.join(", "),
    subject: "New contact form message — Mafateeh",
    text: buildContactEmailText(payload),
  });

  // eslint-disable-next-line no-console
  console.log(
    `Contact notification email sent to ${recipients.length} recipient(s). messageId=${info.messageId ?? "n/a"}`,
  );
}
