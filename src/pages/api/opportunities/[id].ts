import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { id } = req.query;
  if (!id || typeof id !== "string") return res.status(400).json({ error: "Missing id" });

  try {
    const user = await getUserFromRequest(req);
    const opportunity = await prisma.opportunity.findUnique({
      where: { id },
      include: { attachments: true },
    });

    if (!opportunity) return res.status(404).json({ error: "Not found" });

    const saved = user
      ? await prisma.savedOpportunity.findFirst({ where: { userId: user.id, opportunityId: id } })
      : null;

    return res.status(200).json({ opportunity, saved });
  } catch (error) {
    console.error("Failed to fetch opportunity", error);
    return res.status(500).json({ error: "Failed to load opportunity" });
  }
}
