import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || typeof id !== "string") return res.status(400).json({ error: "Missing id" });

  const user = await requireUser(req, res);
  if (!user) return;

  if (req.method === "PATCH") {
    const { status, notes, priority } = req.body;
    try {
      const saved = await prisma.savedOpportunity.updateMany({
        where: { id, userId: user.id },
        data: { status, notes, priority },
      });
      if (saved.count === 0) return res.status(404).json({ error: "Not found" });
      const fresh = await prisma.savedOpportunity.findFirst({ where: { id, userId: user.id }, include: { opportunity: true } });
      return res.status(200).json({ saved: fresh });
    } catch (error) {
      console.error("Failed to update saved opportunity", error);
      return res.status(500).json({ error: "Update failed" });
    }
  }

  if (req.method === "GET") {
    try {
      const saved = await prisma.savedOpportunity.findFirst({
        where: { id, userId: user.id },
        include: { opportunity: true },
      });
      if (!saved) return res.status(404).json({ error: "Not found" });
      return res.status(200).json({ saved });
    } catch (error) {
      return res.status(500).json({ error: "Failed" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
