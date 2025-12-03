import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { generateToken, requireUser } from "@/lib/auth";
import { sendMail } from "@/lib/mail";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await requireUser(req, res);
  if (!user) return;

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  if (user.emailVerified) return res.status(200).json({ message: "Already verified" });

  const token = generateToken(24);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);
  await prisma.emailVerificationToken.create({ data: { token, userId: user.id, expiresAt } });
  await sendMail(user.email, "Verify your GovAI account", `Use this token to verify: ${token}`);

  return res.status(200).json({ message: "Verification email sent" });
}
