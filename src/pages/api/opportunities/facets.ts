import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  try {
    const [agencies, noticeTypes, setAsides] = await Promise.all([
      prisma.opportunity.groupBy({ by: ["agency"], _count: true, orderBy: { _count: { agency: "desc" } }, take: 8 }),
      prisma.opportunity.groupBy({ by: ["noticeType"], _count: true, orderBy: { _count: { noticeType: "desc" } }, take: 8 }),
      prisma.opportunity.groupBy({ by: ["setAside"], _count: true, orderBy: { _count: { setAside: "desc" } }, take: 8 }),
    ]);

    return res.status(200).json({
      agencies: agencies.map((a) => ({ name: a.agency, count: a._count })),
      noticeTypes: noticeTypes.map((n) => ({ name: n.noticeType, count: n._count })),
      setAsides: setAsides.map((s) => ({ name: s.setAside, count: s._count })),
    });
  } catch (error) {
    console.error("Facets failed", error);
    return res.status(500).json({ error: "Failed to load facets" });
  }
}
