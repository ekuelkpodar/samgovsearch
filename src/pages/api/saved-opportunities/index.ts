import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await requireUser(req, res);
  if (!user) return;

  if (req.method === "GET") {
    try {
      const saved = await prisma.savedOpportunity.findMany({
        where: { userId: user.id },
        include: { opportunity: true },
        orderBy: { updatedAt: "desc" },
      });
      return res.status(200).json({ data: saved });
    } catch (error) {
      console.error("Failed to fetch saved", error);
      return res.status(500).json({ error: "Failed" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
