import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { hashPassword, setAuthCookie, signAuthToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Validate incoming payload
  const parseResult = schema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: "Invalid input", details: parseResult.error.flatten() });
  }

  const { email, password, name } = parseResult.data;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: "Email already registered" });

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
      },
    });

    const token = signAuthToken(user.id);
    setAuthCookie(res, token);

    return res.status(201).json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error("Signup failed", error);
    return res.status(500).json({ error: "Failed to create account" });
  }
}
