import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { id } = req.query;
  if (!id || typeof id !== "string") return res.status(400).json({ error: "Missing id" });

  const user = await requireUser(req, res);
  if (!user) return;

  try {
    const saved = await prisma.savedOpportunity.upsert({
      where: { userId_opportunityId: { userId: user.id, opportunityId: id } },
      update: {},
      create: { userId: user.id, opportunityId: id, status: "Evaluating", priority: "medium" },
    });

    return res.status(200).json({ saved });
  } catch (error) {
    console.error("Failed to save opportunity", error);
    return res.status(500).json({ error: "Failed to save" });
  }
}
