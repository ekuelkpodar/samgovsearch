import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await requireUser(req, res);
  if (!user) return;

  if (req.method === "POST") {
    const { opportunityId, title, sections, status } = req.body;
    if (!opportunityId || !title) return res.status(400).json({ error: "Missing fields" });

    const proposal = await prisma.proposalDraft.create({
      data: {
        userId: user.id,
        opportunityId,
        title,
        sections: sections || [],
        status: status || "Draft",
      },
    });

    return res.status(201).json({ proposal });
  }

  if (req.method === "GET") {
    const proposals = await prisma.proposalDraft.findMany({
      where: { userId: user.id },
      include: { opportunity: true },
    });
    return res.status(200).json({ data: proposals });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
