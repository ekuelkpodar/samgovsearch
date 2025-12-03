import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { generateProposalSections } from "@/lib/ai";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { opportunityId, userNotes } = req.body || {};
  if (!opportunityId) return res.status(400).json({ error: "opportunityId is required" });

  const opportunity = await prisma.opportunity.findUnique({ where: { id: opportunityId } });
  if (!opportunity) return res.status(404).json({ error: "Opportunity not found" });

  try {
    const sections = await generateProposalSections(opportunity as any, userNotes || "");
    return res.status(200).json({ sections });
  } catch (error) {
    console.error("Proposal generation failed", error);
    return res.status(500).json({ error: "Failed to generate" });
  }
}
