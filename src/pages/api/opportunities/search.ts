import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

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
  } = req.query;

  const agencies = toArray(agency as string | string[] | undefined);
  const departments = toArray(department as string | string[] | undefined);
  const naicsCodes = toArray(naics as string | string[] | undefined);
  const noticeTypes = toArray(noticeType as string | string[] | undefined);

  const pageNumber = parseInt(page as string, 10) || 1;
  const take = Math.min(parseInt(pageSize as string, 10) || 10, 50);
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

    return res.status(200).json({ data, total, page: pageNumber, pageSize: take });
  } catch (error) {
    console.error("Search failed", error);
    return res.status(500).json({ error: "Search failed" });
  }
}
