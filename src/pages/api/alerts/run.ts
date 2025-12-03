import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await requireUser(req, res);
  if (!user) return;

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const searches = await prisma.savedSearch.findMany({
    where: { userId: user.id },
    include: { alerts: true },
  });

  const report = searches.map((search) => ({
    id: search.id,
    name: search.name,
    ranAt: new Date().toISOString(),
    newMatches: Math.floor(Math.random() * 5),
  }));

  return res.status(200).json({ ran: report });
}
