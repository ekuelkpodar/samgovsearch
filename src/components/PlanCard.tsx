interface Props {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

export default function PlanCard({ name, price, description, features, cta, highlighted }: Props) {
  return (
    <div
      className={`card-border bg-glass p-6 shadow-lg transition ${
        highlighted ? "border-cyan-300/70 shadow-cyan-400/20" : "hover:-translate-y-1"
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">{name}</h3>
        {highlighted && (
          <span className="rounded-full bg-cyan-400/20 px-3 py-1 text-xs font-semibold text-cyan-100">
            Popular
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-muted">{description}</p>
      <div className="mt-4 text-3xl font-bold text-cyan-200">{price}</div>
      <ul className="mt-4 flex flex-col gap-2 text-sm text-white/80">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span className="mt-1 h-2 w-2 rounded-full bg-cyan-300" aria-hidden />
            {f}
          </li>
        ))}
      </ul>
      <button className="mt-6 w-full primary">{cta}</button>
    </div>
  );
}
