import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/auth";
import { sendMail } from "@/lib/mail";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: "Email required" });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(200).json({ message: "If the email exists, a reset link was sent." });

  const token = generateToken(24);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

  await prisma.passwordResetToken.create({ data: { token, userId: user.id, expiresAt } });
  await sendMail(email, "Reset your GovAI password", `Use this token to reset: ${token}`);

  return res.status(200).json({ message: "If the email exists, a reset link was sent." });
}
