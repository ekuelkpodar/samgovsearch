import Layout from "@/components/Layout";

const solutions = [
  {
    title: "AI-powered search",
    detail: "Translate plain-English requests into precise SAM.gov queries with NAICS, PSC, and set-aside mapping.",
  },
  {
    title: "RFP intelligence",
    detail: "One-click summaries with eligibility, scope, key dates, and evaluation highlights for faster go/no-go decisions.",
  },
  {
    title: "Team pipeline",
    detail: "Kanban board with statuses, priorities, and notes so capture, proposal, and delivery stay aligned.",
  },
  {
    title: "Alerts & saved searches",
    detail: "Daily or weekly digests plus instant notifications when new opportunities match your filters.",
  },
  {
    title: "Proposal co-pilot",
    detail: "Generate structured proposal sections that merge customer language with your value proposition and past performance.",
  },
  {
    title: "Collaboration",
    detail: "Share saved opportunities, assign owners, and capture notes all in one place.",
  },
];

export default function SolutionsPage() {
  return (
    <Layout>
      <section className="card-border bg-[#0f172a]/80 p-8">
        <h1 className="text-3xl font-bold">Solutions built for capture, proposal, and BD teams</h1>
        <p className="mt-3 text-lg text-muted">
          GovAI Search replaces spreadsheets and browser tabs with a single workspace for discovery, qualification,
          and pursuit.
        </p>
      </section>

      <section className="grid-3">
        {solutions.map((s) => (
          <div key={s.title} className="card-border bg-glass p-5">
            <div className="text-lg font-semibold text-white">{s.title}</div>
            <p className="mt-2 text-sm text-muted">{s.detail}</p>
          </div>
        ))}
      </section>

      <section className="card-border bg-[#0f172a]/80 p-6">
        <h2 className="text-xl font-semibold">Security & readiness</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {[
            "SSO/SAML & SCIM (enterprise)",
            "Row-level access controls",
            "Audit logging for AI activity",
            "FedRAMP-aligned architecture",
            "Data residency controls",
            "Customer-managed keys (roadmap)",
          ].map((item) => (
            <div key={item} className="rounded-lg bg-white/5 p-3 text-sm text-white/80">
              {item}
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
