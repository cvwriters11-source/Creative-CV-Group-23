import { promises as fs } from "node:fs";
import path from "node:path";
import type { AdminOrder, AdminWriter } from "@/lib/admin/types";
import { sendTransactionalEmail } from "@/lib/email";
import { site } from "@/lib/site";
import { resolveOrderUpload } from "@/lib/uploads";

const adminInbox = process.env.CONTACT_TO_EMAIL || site.email;

function writerLoginUrl() {
  return `${site.url.replace(/\/$/, "")}/writer/login`;
}

export async function emailWriterAssigned(order: AdminOrder, writer: AdminWriter) {
  return sendTransactionalEmail({
    to: writer.email,
    subject: `New CV assignment ${order.orderNumber}`,
    text: [
      `Hi ${writer.name},`,
      "",
      `You have been assigned ${order.fullName}'s ${order.packageName} order (${order.orderNumber}).`,
      "Sign in to your writer dashboard to view the brief and source files:",
      writerLoginUrl(),
      "",
      "You will only see work assigned to you — not the admin dashboard.",
    ].join("\n"),
  });
}

export async function emailAdminReviewReady(order: AdminOrder, writerName: string) {
  return sendTransactionalEmail({
    to: adminInbox,
    subject: `CV ready for review ${order.orderNumber}`,
    text: [
      `${writerName} submitted a CV for ${order.fullName} (${order.orderNumber}).`,
      "Open the admin orders page to review and approve.",
      `${site.url.replace(/\/$/, "")}/admin/orders`,
    ].join("\n"),
  });
}

export async function emailClientApprovedCv(order: AdminOrder) {
  const filePath = await resolveOrderUpload(order.reference, "delivery", order.deliveryFileName);
  const attachments = [];
  if (filePath) {
    const content = (await fs.readFile(filePath)).toString("base64");
    attachments.push({
      filename: order.deliveryFileName || path.basename(filePath).replace(/^delivery-/, ""),
      content,
    });
  }
  return sendTransactionalEmail({
    to: order.email,
    subject: `Your Creative CV is ready — ${order.orderNumber}`,
    text: [
      `Hi ${order.firstName || order.fullName},`,
      "",
      `Your ${order.packageName} is complete and attached.`,
      `Order number: ${order.orderNumber}`,
      "",
      "If you need changes, reply to this email or send corrections at:",
      `${site.url.replace(/\/$/, "")}/packages/corrections`,
      "",
      `Creative CV · ${site.phone}`,
    ].join("\n"),
    attachments: attachments.length ? attachments : undefined,
  });
}

export async function emailWriterCorrections(order: AdminOrder, writer: AdminWriter, message: string) {
  return sendTransactionalEmail({
    to: writer.email,
    subject: `You have corrections — ${order.orderNumber}`,
    text: [
      `Hi ${writer.name},`,
      "",
      `You have corrections on ${order.fullName}'s order (${order.orderNumber}).`,
      "",
      message,
      "",
      "Open your writer dashboard to update the CV and mark it for review again:",
      writerLoginUrl(),
    ].join("\n"),
  });
}
