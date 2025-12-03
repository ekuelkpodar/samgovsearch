import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { hashPassword, setAuthCookie, signAuthToken } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { token, password } = req.body || {};
  if (!token || !password) return res.status(400).json({ error: "Missing token or password" });

  const record = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!record || record.expiresAt < new Date()) return res.status(400).json({ error: "Invalid or expired token" });

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.update({ where: { id: record.userId }, data: { passwordHash } });
  await prisma.passwordResetToken.delete({ where: { token } });

  const jwt = signAuthToken(user.id);
  setAuthCookie(res, jwt);

  return res.status(200).json({ message: "Password updated" });
}
