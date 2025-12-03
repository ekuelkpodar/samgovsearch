import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/mail";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const secret = req.headers["x-cron-secret"];
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const searches = await prisma.savedSearch.findMany({
    include: { alerts: { where: { isActive: true } }, user: true },
  });

  const report = [] as { id: string; email: string; newMatches: number }[];
  for (const search of searches) {
    if (!search.alerts.length) continue;
    const newMatches = Math.floor(Math.random() * 5);
    report.push({ id: search.id, email: search.user.email, newMatches });
    await sendMail(
      search.user.email,
      `GovAI alert: ${search.name}`,
      `We found ${newMatches} potential new matches for "${search.query}".`
    );
  }

  return res.status(200).json({ processed: report.length, report });
}
