import { NextApiRequest, NextApiResponse } from "next";
import { searchSam } from "@/lib/sam";
import { requireRole } from "@/lib/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const user = await requireRole(req, res, ["admin"]);
  if (!user) return;

  const { q, agency, naics } = req.body || {};

  try {
    const results = await searchSam({ q, agency, naics });
    // Map into our schema as a preview; do not store by default.
    const mapped = results.map((r) => ({
      title: r.title,
      agency: r.agency,
      department: null,
      solicitationNumber: r.id,
      noticeType: "Solicitation",
      naicsCodes: naics || [],
      pscCodes: [],
      setAside: r.setAside,
      placeOfPerformance: "",
      estimatedValueMin: null,
      estimatedValueMax: null,
      responseDeadline: new Date(r.deadline),
      postedDate: new Date(r.postedDate),
      url: r.url,
      description: r.description,
      rawText: r.description,
      status: "Open",
    }));

    // Optional persistence stub (commented out). Uncomment to store new entries.
    // await prisma.opportunity.createMany({ data: mapped });

    return res.status(200).json({ preview: mapped, note: "Persist by enabling createMany in handler." });
  } catch (error) {
    console.error("SAM sync failed", error);
    return res.status(500).json({ error: "Failed to sync" });
  }
}
