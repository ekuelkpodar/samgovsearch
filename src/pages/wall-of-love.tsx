import Layout from "@/components/Layout";
import TestimonialCard from "@/components/TestimonialCard";

const testimonials = [
  {
    name: "Jordan Miles",
    company: "Atlas Federal",
    role: "Capture Lead",
    quote: "GovAI Search turns SAM.gov chaos into a clean, searchable experience with AI summaries we trust.",
  },
  {
    name: "Sara Nguyen",
    company: "Brightline Partners",
    role: "COO",
    quote: "The saved search alerts surface deals before competitors do. It paid for itself in week one.",
  },
  {
    name: "Anthony Rivera",
    company: "CivicBridge",
    role: "Proposal Manager",
    quote: "Proposal drafts give us a head start on compliance matrices and narrative structure.",
  },
  {
    name: "Elena Ford",
    company: "Skyward Defense",
    role: "VP Growth",
    quote: "Our team finally has one pipeline board across agencies with statuses and priorities.",
  },
  {
    name: "Luis Romero",
    company: "Harbor Analytics",
    role: "CEO",
    quote: "We can filter by set-aside, value, and NAICS without fighting a clunky UI. It's a delight.",
  },
  {
    name: "Kimberly Price",
    company: "Northstar Systems",
    role: "Capture Manager",
    quote: "GovAI helps us translate customer language into actionable proposal sections in minutes.",
  },
];

export default function WallOfLovePage() {
  return (
    <Layout>
      <section className="card-border bg-[#0f172a]/80 p-8 text-center">
        <h1 className="text-3xl font-bold">Wall of Love</h1>
        <p className="mt-2 text-muted">What modern GovCon teams say about GovAI Search.</p>
      </section>
      <section className="grid-3">
        {testimonials.map((t) => (
          <TestimonialCard key={t.name} {...t} />
        ))}
      </section>
    </Layout>
  );
}
