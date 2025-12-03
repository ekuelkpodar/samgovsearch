interface Props {
  name: string;
  company: string;
  role: string;
  quote: string;
}

export default function TestimonialCard({ name, company, role, quote }: Props) {
  return (
    <div className="card-border bg-[#0f172a] p-4 shadow-lg shadow-cyan-500/10">
      <p className="text-sm text-white/90">“{quote}”</p>
      <div className="mt-4 text-sm text-muted">
        <div className="font-semibold text-white">{name}</div>
        <div>
          {role} @ {company}
        </div>
      </div>
    </div>
  );
}
