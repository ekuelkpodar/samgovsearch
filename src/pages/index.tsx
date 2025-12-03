import Layout from "@/components/Layout";
import PlanCard from "@/components/PlanCard";
import TestimonialCard from "@/components/TestimonialCard";
import Link from "next/link";

const features = [
  {
    title: "AI-native search",
    body: "Plain English queries translated into NAICS/PSC, set-aside, and timeline-ready filters.",
    tag: "Search",
  },
  {
    title: "Executive-ready briefs",
    body: "One-click AI summaries for scope, eligibility, dates, and evaluation criteria for faster go/no-go.",
    tag: "Summaries",
  },
  {
    title: "Saved searches & alerts",
    body: "Always-on monitoring with daily/weekly digests so teams never miss a fit opportunity.",
    tag: "Alerts",
  },
  {
    title: "Proposal co-pilot",
    body: "Draft structured sections aligned to the RFP and your past performance—ready for compliance review.",
    tag: "Proposals",
  },
];

const howItWorks = [
  {
    title: "Search in plain language",
    detail: "Paste an RFP or type a business goal; GovAI rewrites to precise SAM-ready filters.",
  },
  {
    title: "Qualify in minutes",
    detail: "AI summaries surface eligibility, scope, and key dates with no PDF thrash.",
  },
  {
    title: "Track the pipeline",
    detail: "Save and organize opportunities with statuses, notes, and Kanban views.",
  },
  {
    title: "Generate proposals",
    detail: "Context-aware drafts with your value props and past performance baked in.",
  },
];

const testimonials = [
  {
    name: "Avery Chen",
    company: "Vector Labs",
    role: "CEO",
    quote:
      "We trimmed capture research time by 60%. AI summaries are spot on and saved searches keep us ahead.",
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

const logos = ["Apex Federal", "Northwind", "AtlasGov", "BlueRiver", "Vector", "CivicWorks"];

export default function Home() {
  return (
    <Layout>
      <section className="rounded-3xl bg-gradient-to-br from-cyan-500/15 via-sky-500/10 to-blue-700/20 p-8 shadow-2xl shadow-cyan-500/20">
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-white/10 px-3 py-1 text-xs font-semibold text-cyan-100">
              AI for modern GovCon teams
              <span className="rounded-full bg-cyan-400/30 px-2 py-0.5 text-[10px] text-slate-900">
                New
              </span>
            </div>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              Government contract search that feels modern—plus an AI proposal copilot.
            </h1>
            <p className="text-lg text-slate-200/80 md:max-w-2xl">
              GovAI Search rewrites your intent into precise SAM queries, summarizes RFPs, and drafts
              proposals so capture, BD, and proposal teams move faster together.
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
            <div className="text-xs uppercase tracking-[0.25em] text-cyan-100/80">
              Trusted by capture, proposal, and growth teams
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
              {logos.map((logo) => (
                <span
                  key={logo}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/80"
                >
                  {logo}
                </span>
              ))}
            </div>
          </div>
          <div className="card-border bg-[#0a122e]/80 p-5 shadow-2xl shadow-cyan-500/20">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between text-xs text-muted">
                <span>Live AI search</span>
                <span className="rounded-full bg-cyan-400/20 px-2 py-0.5 text-[11px] font-semibold text-cyan-100">
                  Smart
                </span>
              </div>
              <div className="mt-3 rounded-xl bg-[#0e1938] p-4 shadow-inner shadow-black/20">
                <p className="text-sm uppercase tracking-[0.3em] text-muted">Query</p>
                <p className="text-xl font-semibold text-white">
                  “Zero-trust cybersecurity for DoD under $5M with CONUS delivery”
                </p>
              </div>
              <div className="mt-3 grid gap-3 text-sm text-muted">
                <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-3">
                  <div className="text-xs font-semibold text-cyan-100">AI rewrite</div>
                  <div>NAICS 541512/541519 • set-aside: Small Business • deadline &lt; 45 days • CONUS</div>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/5 p-3">
                  <div className="text-xs font-semibold text-cyan-100">Match summary</div>
                  <div>5 opportunities match • soonest deadline in 18 days • median value $2.8M.</div>
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-sm text-white/80">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs text-muted">Time saved</div>
                <div className="text-2xl font-bold text-white">-60%</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs text-muted">Win-rate lift</div>
                <div className="text-2xl font-bold text-white">+18%</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs text-muted">RFPs parsed</div>
                <div className="text-2xl font-bold text-white">1.2K</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h2 className="text-2xl font-semibold">Why teams choose GovAI Search</h2>
          <div className="text-sm text-muted">Built for capture managers, proposal leads, and BD teams.</div>
        </div>
        <div className="mt-4 grid-4">
          {features.map((f) => (
            <div key={f.title} className="card-border bg-[#0f172a]/80 p-5 shadow-lg shadow-cyan-500/10">
              <div className="inline-flex rounded-full bg-cyan-400/10 px-2 py-1 text-[11px] font-semibold text-cyan-100">
                {f.tag}
              </div>
              <div className="mt-2 text-lg font-semibold text-white">{f.title}</div>
              <p className="mt-2 text-sm text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 card-border bg-[#0f172a]/80 p-6">
        <h3 className="text-xl font-semibold">How it works</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {howItWorks.map((step, idx) => (
            <div key={step.title} className="flex items-start gap-3 rounded-xl bg-white/5 p-4">
              <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400/20 text-base font-bold text-cyan-100">
                {idx + 1}
              </span>
              <div>
                <div className="text-white font-semibold">{step.title}</div>
                <p className="text-sm text-muted">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
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

      <section className="mt-10">
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
