import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

const DAYS = 30;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await requireUser(req, res);
  if (!user) return;
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const today = new Date();
  const start = new Date();
  start.setDate(today.getDate() - DAYS + 1);

  try {
    const opportunities = await prisma.opportunity.findMany({
      where: { postedDate: { gte: start } },
      select: { postedDate: true },
    });

    const savedUpdates = await prisma.savedOpportunity.findMany({
      where: { userId: user.id, updatedAt: { gte: start } },
      select: { updatedAt: true },
    });

    const countsByDay = (dates: Date[]) => {
      const map: Record<string, number> = {};
      dates.forEach((d) => {
        const key = d.toISOString().slice(0, 10);
        map[key] = (map[key] || 0) + 1;
      });
      const days: { date: string; count: number }[] = [];
      for (let i = 0; i < DAYS; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        const key = d.toISOString().slice(0, 10);
        days.push({ date: key, count: map[key] || 0 });
      }
      return days;
    };

    return res.status(200).json({
      opportunities: countsByDay(opportunities.map((o) => o.postedDate)),
      saved: countsByDay(savedUpdates.map((s) => s.updatedAt)),
      start: start.toISOString(),
    });
  } catch (error) {
    console.error("Trend stats failed", error);
    return res.status(500).json({ error: "Failed to load trends" });
  }
}
