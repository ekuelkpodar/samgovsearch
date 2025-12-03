import Layout from "@/components/Layout";
import PlanCard from "@/components/PlanCard";
import TestimonialCard from "@/components/TestimonialCard";
import Link from "next/link";

const features = [
  {
    title: "AI search that speaks GovCon",
    body: "Ask in plain English and we translate into SAM.gov-ready filters, NAICS codes, and keywords.",
  },
  {
    title: "Instant RFP summaries",
    body: "Auto-generate capture-ready briefs so your team knows scope, eligibility, and key dates in seconds.",
  },
  {
    title: "Saved searches & alerts",
    body: "Never miss a fit opportunity with daily/weekly alerts from your saved filters and watchlists.",
  },
  {
    title: "Proposal co-pilot",
    body: "Draft tailored proposal sections with your past performance, value props, and pricing guardrails.",
  },
];

const howItWorks = [
  "Search in natural language or paste parts of the RFP.",
  "Filter by agency, set-aside, value range, NAICS, and timelines.",
  "Save opportunities and searches, then track them in a pipeline.",
  "Generate AI summaries and proposal drafts when you're ready to bid.",
];

const testimonials = [
  {
    name: "Avery Chen",
    company: "Vector Labs",
    role: "CEO",
    quote: "We trimmed our capture research time by 60%. The AI summaries are spot on and saved searches keep us ahead of competitors.",
  },
  {
    name: "Marcus Lee",
    company: "Northwind Defense",
    role: "VP, Growth",
    quote: "Pipeline + proposal drafts give us a repeatable process for multi-agency pursuits.",
  },
  {
    name: "Priya Patel",
    company: "CivicWorks",
    role: "Director of BD",
    quote: "Finally, a SAM.gov experience that feels modern and built for small business set-asides.",
  },
];

export default function Home() {
  return (
    <Layout>
      <section className="grid gap-8 rounded-3xl bg-gradient-to-r from-cyan-500/10 via-sky-500/5 to-blue-500/10 p-8 shadow-xl shadow-cyan-500/20 md:grid-cols-2 md:items-center">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-cyan-100">
            AI-powered GovCon copilot
          </div>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            AI-powered government contract search & proposal assistant
          </h1>
          <p className="text-lg text-muted">
            Discover, qualify, and pursue federal opportunities faster with AI rewriting, RFP summaries,
            and proposal drafts tailored to your pipeline.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/search" className="primary">
              Start searching
            </Link>
            <a
              href="mailto:hello@govai.example?subject=GovAI%20Demo"
              className="secondary"
            >
              Book demo
            </a>
          </div>
          <div className="mt-3 text-xs uppercase tracking-[0.2em] text-muted">
            Trusted by capture, proposal, and growth teams
          </div>
        </div>
        <div className="card-border bg-[#0f172a]/80 p-6 shadow-xl shadow-cyan-500/10">
          <div className="flex items-center justify-between text-sm text-muted">
            <span>Smart search</span>
            <span className="rounded-full bg-white/5 px-2 py-1 text-xs text-cyan-100">Live</span>
          </div>
          <div className="mt-4 rounded-xl bg-white/5 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-muted">Query</div>
            <p className="text-lg font-semibold text-white">
              "cybersecurity operations for DoD under $5M in 2025"
            </p>
          </div>
          <div className="mt-4 grid gap-3 text-sm text-muted">
            <div className="rounded-lg bg-white/5 p-3">
              <div className="text-xs text-cyan-100">AI rewrite</div>
              <div>Align to NAICS 541512/541519, prefer CONUS, active set-aside: SB</div>
            </div>
            <div className="rounded-lg bg-white/5 p-3">
              <div className="text-xs text-cyan-100">Summary</div>
              <div>3 opportunities match, earliest deadline in 21 days, median value $2.8M.</div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold">Why teams choose GovAI Search</h2>
        <div className="mt-4 grid-4">
          {features.map((f) => (
            <div key={f.title} className="card-border bg-[#0f172a]/80 p-4">
              <div className="text-lg font-semibold text-white">{f.title}</div>
              <p className="mt-2 text-sm text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card-border bg-[#0f172a]/80 p-6">
        <h3 className="text-xl font-semibold">How it works</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {howItWorks.map((step, idx) => (
            <div key={step} className="flex items-start gap-3 rounded-xl bg-white/5 p-4">
              <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-cyan-400/20 text-sm font-bold text-cyan-100">
                {idx + 1}
              </span>
              <p className="text-sm text-white/90">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold">Pricing for every capture team</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <PlanCard
            name="Starter"
            price="$79/mo"
            description="Solo founders and small GovCon teams."
            features={["AI search", "RFP summaries", "Saved searches", "Email alerts"]}
            cta="Start free trial"
          />
          <PlanCard
            name="Professional"
            price="$179/mo"
            description="Growing capture teams pursuing multiple agencies."
            features={[
              "All Starter features",
              "Pipeline + Kanban",
              "Proposal drafts",
              "Collaboration seats",
            ]}
            cta="Upgrade"
            highlighted
          />
          <PlanCard
            name="Enterprise"
            price="Custom"
            description="Advanced security, SSO, onboarding, and concierge research."
            features={["SSO/SAML", "Custom AI models", "Teaming workspaces", "Customer success"]}
            cta="Talk to sales"
          />
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Wall of love</h3>
          <Link href="/wall-of-love" className="text-sm text-cyan-200 hover:text-cyan-100">
            View all
          </Link>
        </div>
        <div className="mt-4 grid-3">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </section>
    </Layout>
  );
}
