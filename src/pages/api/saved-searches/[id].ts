import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || typeof id !== "string") return res.status(400).json({ error: "Missing id" });

  const user = await requireUser(req, res);
  if (!user) return;

  if (req.method === "PATCH") {
    const { name, query, filters, frequency, isActive } = req.body;
    try {
      const savedSearch = await prisma.savedSearch.update({
        where: { id },
        data: { name, query, filters, frequency },
      });

      if (typeof isActive === "boolean") {
        await prisma.alertSubscription.updateMany({
          where: { savedSearchId: id, userId: user.id },
          data: { isActive },
        });
      }

      return res.status(200).json({ savedSearch });
    } catch (error) {
      console.error("Failed to update saved search", error);
      return res.status(500).json({ error: "Failed" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
