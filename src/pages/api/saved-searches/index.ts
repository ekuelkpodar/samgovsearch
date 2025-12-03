import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

const schema = z.object({
  name: z.string().min(2),
  query: z.string().min(2),
  filters: z.record(z.any()).default({}),
  frequency: z.enum(["daily", "weekly"]),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await requireUser(req, res);
  if (!user) return;

  if (req.method === "GET") {
    const searches = await prisma.savedSearch.findMany({
      where: { userId: user.id },
      include: { alerts: true },
      orderBy: { updatedAt: "desc" },
    });
    return res.status(200).json({ data: searches });
  }

  if (req.method === "POST") {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid input" });

    const created = await prisma.savedSearch.create({ data: { ...parsed.data, userId: user.id } });
    await prisma.alertSubscription.create({
      data: {
        userId: user.id,
        savedSearchId: created.id,
        deliveryChannel: "email",
        isActive: true,
      },
    });
    return res.status(201).json({ savedSearch: created });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
