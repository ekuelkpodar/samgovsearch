import Layout from "@/components/Layout";
import PlanCard from "@/components/PlanCard";

const plans = [
  {
    name: "Starter",
    price: "$79/mo",
    description: "Solo founders and boutique GovCon teams.",
    features: ["AI search", "10 saved searches", "Email alerts", "Basic summaries"],
  },
  {
    name: "Professional",
    price: "$179/mo",
    description: "Teams running multiple pursuits each month.",
    features: ["Everything in Starter", "Unlimited saved searches", "Pipeline board", "Proposal drafts"],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Security-first deployments for larger teams.",
    features: ["SSO/SAML", "Role-based access", "Concierge research", "Custom AI guardrails"],
  },
];

const comparison = [
  { feature: "AI search & rewrite", starter: true, pro: true, ent: true },
  { feature: "AI RFP summaries", starter: "Basic", pro: "Advanced", ent: "Advanced" },
  { feature: "Saved searches", starter: "10", pro: "Unlimited", ent: "Unlimited" },
  { feature: "Pipeline / Kanban", starter: false, pro: true, ent: true },
  { feature: "Proposal drafts", starter: false, pro: true, ent: true },
  { feature: "SSO/SAML", starter: false, pro: false, ent: true },
];

export default function PricingPage() {
  return (
    <Layout>
      <section className="card-border bg-[#0f172a]/80 p-8 text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-muted">Pricing</p>
        <h1 className="mt-2 text-3xl font-bold">Simple plans for serious capture teams</h1>
        <p className="mt-3 text-muted">Start with a free trial, upgrade when you're ready to pursue more.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard key={plan.name} {...plan} cta="Get started" />
        ))}
      </section>

      <section className="card-border bg-[#0f172a]/80 p-6">
        <h2 className="text-xl font-semibold">Compare features</h2>
        <div className="mt-4 overflow-x-auto text-sm">
          <table className="w-full min-w-[640px] text-left">
            <thead className="text-muted">
              <tr>
                <th className="py-2">Feature</th>
                <th className="py-2">Starter</th>
                <th className="py-2">Professional</th>
                <th className="py-2">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.feature} className="border-t border-white/5 text-white/80">
                  <td className="py-3">{row.feature}</td>
                  <td>{row.starter === true ? "✔" : row.starter || "—"}</td>
                  <td>{row.pro === true ? "✔" : row.pro || "—"}</td>
                  <td>{row.ent === true ? "✔" : row.ent || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
}
