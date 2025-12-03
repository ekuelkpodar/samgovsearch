import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const searchSchema = z.object({
  q: z.string().optional(),
  agency: z.union([z.string(), z.array(z.string())]).optional(),
  department: z.union([z.string(), z.array(z.string())]).optional(),
  naics: z.union([z.string(), z.array(z.string())]).optional(),
  setAside: z.string().optional(),
  noticeType: z.union([z.string(), z.array(z.string())]).optional(),
  valueMin: z.string().optional(),
  valueMax: z.string().optional(),
  deadlineFrom: z.string().optional(),
  deadlineTo: z.string().optional(),
  page: z.string().optional(),
  pageSize: z.string().optional(),
  activeOnly: z.string().optional(),
  location: z.string().optional(),
});

const toArray = (value: undefined | string | string[]) => {
  if (!value) return [] as string[];
  return Array.isArray(value)
    ? value.flatMap((v) => v.split(",").map((p) => p.trim()).filter(Boolean))
    : value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const parsed = searchSchema.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: "Invalid query parameters" });

  const {
    q = "",
    agency,
    department,
    naics,
    setAside,
    noticeType,
    valueMin,
    valueMax,
    deadlineFrom,
    deadlineTo,
    page = "1",
    pageSize = "10",
    activeOnly,
    location,
  } = parsed.data;

  const agencies = toArray(agency);
  const departments = toArray(department);
  const naicsCodes = toArray(naics);
  const noticeTypes = toArray(noticeType);

  const pageNumber = Math.max(1, parseInt(page || "1", 10) || 1);
  const take = Math.min(Math.max(parseInt(pageSize || "10", 10) || 10, 1), 50);
  const skip = (pageNumber - 1) * take;

  const where: any = {};

  if (q) {
    where.OR = [
      { title: { contains: q as string, mode: "insensitive" } },
      { description: { contains: q as string, mode: "insensitive" } },
      { rawText: { contains: q as string, mode: "insensitive" } },
    ];
  }

  if (agencies.length) where.agency = { in: agencies };
  if (departments.length) where.department = { in: departments };
  if (naicsCodes.length) where.naicsCodes = { hasSome: naicsCodes };
  if (setAside) where.setAside = { equals: setAside };
  if (noticeTypes.length) where.noticeType = { in: noticeTypes };
  if (location) where.placeOfPerformance = { contains: location as string, mode: "insensitive" };

  if (valueMin) where.estimatedValueMin = { gte: Number(valueMin) };
  if (valueMax) where.estimatedValueMax = { lte: Number(valueMax) };
  if (deadlineFrom || deadlineTo) {
    where.responseDeadline = {};
    if (deadlineFrom) where.responseDeadline.gte = new Date(deadlineFrom as string);
    if (deadlineTo) where.responseDeadline.lte = new Date(deadlineTo as string);
  }

  if (activeOnly === "true") where.status = { equals: "Open" };

  try {
    const [data, total] = await Promise.all([
      prisma.opportunity.findMany({
        where,
        skip,
        take,
        orderBy: { postedDate: "desc" },
      }),
      prisma.opportunity.count({ where }),
    ]);

    return res
      .status(200)
      .json({ data, total, page: pageNumber, pageSize: take, totalPages: Math.ceil(total / take) });
  } catch (error) {
    console.error("Search failed", error);
    return res.status(500).json({ error: "Search failed" });
  }
}
