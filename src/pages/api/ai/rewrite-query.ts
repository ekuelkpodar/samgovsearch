import { NextApiRequest, NextApiResponse } from "next";
import { rewriteSearchQuery } from "@/lib/ai";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { query } = req.body || {};
  if (!query) return res.status(400).json({ error: "query is required" });

  try {
    const rewritten = await rewriteSearchQuery(query as string);
    return res.status(200).json({ rewritten });
  } catch (error) {
    console.error("Rewrite failed", error);
    return res.status(500).json({ error: "Failed to rewrite" });
  }
}
