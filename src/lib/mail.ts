import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "localhost",
  port: Number(process.env.SMTP_PORT || 1025),
  secure: false,
  auth: process.env.SMTP_USER
    ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      }
    : undefined,
});

export async function sendMail(to: string, subject: string, text: string) {
  if (!process.env.SMTP_HOST) {
    console.info("[mail] SMTP not configured, logging email instead", { to, subject, text });
    return { mocked: true };
  }

  return transporter.sendMail({
    from: process.env.SMTP_FROM || "no-reply@govai.test",
    to,
    subject,
    text,
  });
}
