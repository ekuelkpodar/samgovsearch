import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await requireUser(req, res);
  if (!user) return;

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { token } = req.body || {};
  if (!token) return res.status(400).json({ error: "Missing token" });

  const record = await prisma.emailVerificationToken.findUnique({ where: { token } });
  if (!record || record.userId !== user.id || record.expiresAt < new Date()) {
    return res.status(400).json({ error: "Invalid or expired token" });
  }

  await prisma.user.update({ where: { id: user.id }, data: { emailVerified: true } });
  await prisma.emailVerificationToken.delete({ where: { token } });

  return res.status(200).json({ message: "Verified" });
}
