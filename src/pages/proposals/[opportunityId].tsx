import Layout from "@/components/Layout";
import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Opportunity, ProposalDraft, ProposalSection } from "@/types";
import { GetServerSideProps } from "next";
import { FormEvent, useState } from "react";

interface Props {
  opportunity: Opportunity;
  draft: ProposalDraft | null;
}

export default function ProposalPage({ opportunity, draft }: Props) {
  const [companyName, setCompanyName] = useState("");
  const [pastPerformance, setPastPerformance] = useState("");
  const [valueProp, setValueProp] = useState("");
  const [team, setTeam] = useState("");
  const [sections, setSections] = useState<ProposalSection[]>(draft?.sections || []);
  const [status, setStatus] = useState<ProposalDraft["status"]>(draft?.status || "Draft");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const generate = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("Generating...");
    const notes = `Company: ${companyName}\nPast Performance: ${pastPerformance}\nValue Prop: ${valueProp}\nTeam: ${team}`;
    const res = await fetch("/api/proposals/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ opportunityId: opportunity.id, userNotes: notes }),
    });
    const data = await res.json();
    setSections(data.sections || []);
    setMessage("Draft generated");
  };

  const save = async () => {
    setSaving(true);
    setMessage("");
    const payload = {
      opportunityId: opportunity.id,
      title: `${opportunity.title} Proposal`,
      sections,
      status,
    };
    const res = await fetch(draft ? `/api/proposals/${draft.id}` : "/api/proposals", {
      method: draft ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    setMessage(res.ok ? "Saved" : "Save failed");
  };

  return (
    <Layout>
      <section className="card-border bg-[#0f172a]/80 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">Proposal draft</p>
        <h1 className="text-3xl font-bold">{opportunity.title}</h1>
        <p className="text-sm text-muted">{opportunity.agency} • Deadline {new Date(opportunity.responseDeadline).toLocaleDateString()}</p>
      </section>

      <div className="mt-4 grid gap-4 md:grid-cols-[1.2fr_1fr]">
        <form className="card-border bg-glass p-5 space-y-3" onSubmit={generate}>
          <h3 className="text-lg font-semibold">Context</h3>
          <input
            placeholder="Company name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full"
          />
          <textarea
            rows={3}
            placeholder="Past performance highlights"
            value={pastPerformance}
            onChange={(e) => setPastPerformance(e.target.value)}
            className="w-full"
          />
          <textarea
            rows={3}
            placeholder="Unique value proposition"
            value={valueProp}
            onChange={(e) => setValueProp(e.target.value)}
            className="w-full"
          />
          <textarea
            rows={3}
            placeholder="Key team capabilities"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            className="w-full"
          />
          <button className="primary" type="submit">Generate Draft</button>
        </form>

        <div className="card-border bg-[#0f172a]/80 p-5">
          <h3 className="text-lg font-semibold">Proposal sections</h3>
          <p className="text-sm text-muted">Edit any section before saving.</p>
          <div className="mt-3 space-y-3">
            {sections.map((section, idx) => (
              <div key={idx} className="rounded-lg bg-white/5 p-3">
                <input
                  className="w-full bg-transparent text-sm font-semibold text-white"
                  value={section.heading}
                  onChange={(e) => {
                    const next = [...sections];
                    next[idx] = { ...next[idx], heading: e.target.value };
                    setSections(next);
                  }}
                />
                <textarea
                  className="mt-2 w-full bg-transparent text-sm text-muted"
                  rows={4}
                  value={section.content}
                  onChange={(e) => {
                    const next = [...sections];
                    next[idx] = { ...next[idx], content: e.target.value };
                    setSections(next);
                  }}
                />
              </div>
            ))}
            {!sections.length && <div className="text-sm text-muted">Generate a draft to start editing.</div>}
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <label className="text-sm text-muted">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as ProposalDraft["status"])}>
              {(["Draft", "Finalized", "Archived"] as const).map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <button className="primary" onClick={save} disabled={saving}>
              {saving ? "Saving..." : "Save draft"}
            </button>
            {message && <div className="text-sm text-muted">{message}</div>}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const user = await getUserFromRequest(req as any);
  if (!user) return { redirect: { destination: "/login", permanent: false } };

  const opportunityId = params?.opportunityId as string;
  const opportunity = await prisma.opportunity.findUnique({ where: { id: opportunityId } });
  if (!opportunity) return { notFound: true };

  const draft = await prisma.proposalDraft.findFirst({ where: { userId: user.id, opportunityId } });

  return {
    props: {
      opportunity: JSON.parse(JSON.stringify(opportunity)),
      draft: draft ? JSON.parse(JSON.stringify(draft)) : null,
    },
  };
};
