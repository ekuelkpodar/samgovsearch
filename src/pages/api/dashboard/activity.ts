import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await requireUser(req, res);
  if (!user) return;
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);

  try {
    const [newOpportunities, newSaved, topAgencies, topSetAsides] = await Promise.all([
      prisma.opportunity.count({ where: { postedDate: { gte: sevenDaysAgo } } }),
      prisma.savedOpportunity.count({ where: { userId: user.id, updatedAt: { gte: sevenDaysAgo } } }),
      prisma.opportunity.groupBy({ by: ["agency"], _count: true, orderBy: { _count: { agency: "desc" } }, take: 5 }),
      prisma.opportunity.groupBy({ by: ["setAside"], _count: true, orderBy: { _count: { setAside: "desc" } }, take: 5 }),
    ]);

    const pipelineRecent = await prisma.savedOpportunity.groupBy({
      by: ["status"],
      _count: true,
      where: { userId: user.id, updatedAt: { gte: sevenDaysAgo } },
    });

    return res.status(200).json({
      newOpportunities,
      newSaved,
      pipelineRecent,
      topAgencies: topAgencies.map((a) => ({ name: a.agency, count: a._count })),
      topSetAsides: topSetAsides.map((s) => ({ name: s.setAside, count: s._count })),
      since: sevenDaysAgo.toISOString(),
    });
  } catch (error) {
    console.error("Activity stats failed", error);
    return res.status(500).json({ error: "Failed to load activity" });
  }
}
