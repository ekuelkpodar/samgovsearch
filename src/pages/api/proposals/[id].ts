import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || typeof id !== "string") return res.status(400).json({ error: "Missing id" });

  const user = await requireUser(req, res);
  if (!user) return;

  if (req.method === "GET") {
    const proposal = await prisma.proposalDraft.findFirst({
      where: { id, userId: user.id },
      include: { opportunity: true },
    });
    if (!proposal) return res.status(404).json({ error: "Not found" });
    return res.status(200).json({ proposal });
  }

  if (req.method === "PATCH") {
    const { title, sections, status } = req.body;
    const proposal = await prisma.proposalDraft.update({
      where: { id },
      data: { title, sections, status },
    });
    return res.status(200).json({ proposal });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
