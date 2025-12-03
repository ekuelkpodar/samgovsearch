// Lightweight SAM.gov integration scaffold. Swap placeholder fetch with real API calls later.

export interface SamSearchParams {
  q?: string;
  naics?: string[];
  agency?: string;
  postedFrom?: string;
  limit?: number;
}

export interface SamResult {
  id: string;
  title: string;
  agency: string;
  setAside: string;
  postedDate: string;
  deadline: string;
  url: string;
  description: string;
}

export async function searchSam(params: SamSearchParams): Promise<SamResult[]> {
  // Placeholder implementation: in production call SAM.gov or another provider using API key.
  // The shape mirrors the Opportunity model so it can be mapped easily.
  console.info("[sam] mock search", params);
  return [
    {
      id: "sam-mock-1",
      title: `Mock result for ${params.q || "general"}`,
      agency: params.agency || "General Services Administration",
      setAside: "Open",
      postedDate: new Date().toISOString(),
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      url: "https://sam.gov/mock",
      description: "Placeholder SAM.gov listing. Replace with live API results.",
    },
  ];
}
