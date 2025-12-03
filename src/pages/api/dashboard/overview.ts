import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await requireUser(req, res);
  if (!user) return;

  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const [totalOpps, openOpps, saved, proposals, savedSearches] = await Promise.all([
      prisma.opportunity.count(),
      prisma.opportunity.count({ where: { status: "Open" } }),
      prisma.savedOpportunity.count({ where: { userId: user.id } }),
      prisma.proposalDraft.count({ where: { userId: user.id } }),
      prisma.savedSearch.count({ where: { userId: user.id } }),
    ]);

    const pipelineGroups = await prisma.savedOpportunity.groupBy({
      by: ["status"],
      _count: true,
      where: { userId: user.id },
    });

    return res.status(200).json({
      totals: { totalOpps, openOpps, saved, proposals, savedSearches },
      pipeline: pipelineGroups.map((g) => ({ status: g.status, count: g._count })),
    });
  } catch (error) {
    console.error("Overview stats failed", error);
    return res.status(500).json({ error: "Failed to load stats" });
  }
}
