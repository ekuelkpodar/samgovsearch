import Layout from "@/components/Layout";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { Opportunity, SavedOpportunity } from "@/types";
import { GetServerSideProps } from "next";
import { useState } from "react";

interface Props {
  opportunity: Opportunity & { attachments: any[] };
  saved: SavedOpportunity | null;
}

export default function OpportunityPage({ opportunity, saved }: Props) {
  const [summary, setSummary] = useState<string>("");
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [notes, setNotes] = useState(saved?.notes || "");
  const [status, setStatus] = useState<SavedOpportunity["status"] | "Evaluating">(
    saved?.status || "Evaluating"
  );

  const refreshSummary = async () => {
    setLoadingSummary(true);
    const res = await fetch("/api/ai/summarize-opportunity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rawText: opportunity.rawText, metadata: { agency: opportunity.agency } }),
    });
    const data = await res.json();
    setSummary(data.summary || "No summary available");
    setLoadingSummary(false);
  };

  const saveOpportunity = async () => {
    await fetch(`/api/opportunities/${opportunity.id}/save`, { method: "POST" });
  };

  const updateSaved = async () => {
    if (!saved) return;
    await fetch(`/api/saved-opportunities/${saved.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, notes }),
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="card-border bg-[#0f172a]/80 p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted">{opportunity.noticeType}</p>
              <h1 className="text-3xl font-bold">{opportunity.title}</h1>
              <div className="mt-1 text-sm text-muted">
                {opportunity.agency} {opportunity.department ? `• ${opportunity.department}` : ""}
              </div>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted">
                <span className="rounded-full bg-white/5 px-3 py-1 text-white">{opportunity.setAside}</span>
                <span>NAICS: {opportunity.naicsCodes.join(", ")}</span>
                <span>PSC: {opportunity.pscCodes.join(", ")}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <a href={opportunity.url} className="secondary" target="_blank" rel="noreferrer">
                View on official site
              </a>
              <button className="primary" onClick={saveOpportunity}>
                {saved ? "Saved" : "Save opportunity"}
              </button>
            </div>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-4 text-sm text-muted">
            <div>
              <div className="text-white/80">Value</div>
              <div>
                {opportunity.estimatedValueMin ? `$${opportunity.estimatedValueMin.toLocaleString()}` : "TBD"} –
                {opportunity.estimatedValueMax ? ` $${opportunity.estimatedValueMax.toLocaleString()}` : "TBD"}
              </div>
            </div>
            <div>
              <div className="text-white/80">Posted</div>
              <div>{new Date(opportunity.postedDate).toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-white/80">Response deadline</div>
              <div>{new Date(opportunity.responseDeadline).toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-white/80">Location</div>
              <div>{opportunity.placeOfPerformance || "TBD"}</div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
          <div className="card-border bg-glass p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">AI Summary</h3>
              <button className="secondary" onClick={refreshSummary} disabled={loadingSummary}>
                {loadingSummary ? "Summarizing..." : "Refresh summary"}
              </button>
            </div>
            <div className="mt-3 text-sm text-muted">
              {summary || "Run the summarizer to get a capture-ready brief."}
            </div>
          </div>
          <div className="card-border bg-[#0f172a]/80 p-5">
            <h3 className="text-lg font-semibold">Pipeline</h3>
            <div className="mt-2 text-sm text-muted">Status</div>
            <select
              className="mt-1 w-full"
              value={status}
              onChange={(e) => setStatus(e.target.value as SavedOpportunity["status"])}
            >
              {(["Evaluating", "Pursuing", "Submitted", "Won", "Lost"] as const).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <div className="mt-3 text-sm text-muted">Notes</div>
            <textarea
              rows={4}
              className="mt-1 w-full"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <button className="mt-3 w-full primary" onClick={updateSaved}>
              Save pipeline update
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
          <div className="card-border bg-[#0f172a]/80 p-5">
            <h3 className="text-lg font-semibold">Details</h3>
            <p className="mt-3 whitespace-pre-line text-sm text-muted">{opportunity.description}</p>
            <p className="mt-3 whitespace-pre-line text-sm text-muted">{opportunity.rawText}</p>
          </div>
          <div className="card-border bg-glass p-5">
            <h3 className="text-lg font-semibold">Attachments</h3>
            <div className="mt-3 space-y-2 text-sm text-muted">
              {opportunity.attachments?.length ? (
                opportunity.attachments.map((file) => (
                  <a key={file.id} href={file.url} className="block rounded bg-white/5 px-3 py-2 text-white/80" target="_blank" rel="noreferrer">
                    {file.fileName} ({Math.round(file.fileSize / 1024)} KB)
                  </a>
                ))
              ) : (
                <div>No attachments listed.</div>
              )}
            </div>
            <a
              href={`/proposals/${opportunity.id}`}
              className="mt-4 block rounded-lg bg-gradient-to-r from-cyan-300 to-sky-400 px-4 py-2 text-center text-sm font-semibold text-slate-900"
            >
              Generate Proposal Draft
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const user = await getUserFromRequest(ctx.req as any);
  if (!user) return { redirect: { destination: "/login", permanent: false } };

  const id = ctx.params?.id as string;
  const opportunity = await prisma.opportunity.findUnique({
    where: { id },
    include: { attachments: true },
  });

  if (!opportunity) return { notFound: true };

  const saved = await prisma.savedOpportunity.findFirst({ where: { userId: user.id, opportunityId: id } });

  return {
    props: {
      opportunity: JSON.parse(JSON.stringify(opportunity)),
      saved: saved ? JSON.parse(JSON.stringify(saved)) : null,
    },
  };
};
