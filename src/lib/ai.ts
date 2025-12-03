import { Opportunity, ProposalSection } from "@/types";

async function callAI(prompt: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return `AI offline. Prompt would have been:\n${prompt.slice(0, 300)}...`;
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a concise government contracting assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`AI request failed: ${message}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "No response";
}

export async function summarizeOpportunity(rawText: string, metadata: Record<string, unknown>) {
  const prompt = `Summarize this federal contracting opportunity for a capture manager.
Metadata: ${JSON.stringify(metadata)}
Text: ${rawText}
Provide Scope of Work, Eligibility, Key Dates, Evaluation Criteria.`;
  return callAI(prompt);
}

export async function generateProposalSections(
  opportunity: Opportunity,
  userNotes: string
): Promise<ProposalSection[]> {
  const prompt = `Draft a proposal outline for the following opportunity.
Title: ${opportunity.title}
Agency: ${opportunity.agency}
Set-aside: ${opportunity.setAside}
Deadline: ${opportunity.responseDeadline}
Notes from user: ${userNotes}
Return 5-6 concise sections with headings and paragraph summaries.`;
  const text = await callAI(prompt);

  const fallback: ProposalSection[] = [
    { heading: "Executive Summary", content: "Overview of customer mission and our differentiators." },
    { heading: "Technical Approach", content: "How we will deliver scope, tools, and personnel." },
    { heading: "Management Plan", content: "Governance, staffing plan, schedule, and risks." },
    { heading: "Past Performance", content: "Relevant work examples and outcomes." },
  ];

  if (text.startsWith("AI offline")) return fallback;

  return text
    .split(/\n\n+/)
    .map((block) => {
      const [heading, ...rest] = block.split("\n");
      return { heading: heading?.replace(/:$/, "") || "Section", content: rest.join(" ") };
    })
    .filter((section) => section.heading.trim().length > 0);
}

export async function rewriteSearchQuery(query: string) {
  const prompt = `Rewrite this SAM.gov search query to be more precise and include NAICS/keywords if missing: ${query}`;
  return callAI(prompt);
}
