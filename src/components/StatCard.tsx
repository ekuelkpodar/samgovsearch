interface StatCardProps {
  label: string;
  value: string | number;
  helper?: string;
  accent?: "cyan" | "green" | "pink" | "amber";
}

const accentMap = {
  cyan: "from-cyan-400/30 to-sky-400/10 text-cyan-100 border-cyan-300/40",
  green: "from-emerald-400/30 to-emerald-400/10 text-emerald-100 border-emerald-300/40",
  pink: "from-pink-400/30 to-rose-400/10 text-rose-100 border-rose-300/40",
  amber: "from-amber-300/40 to-orange-300/10 text-amber-100 border-amber-200/40",
};

export default function StatCard({ label, value, helper, accent = "cyan" }: StatCardProps) {
  const accentClass = accentMap[accent];
  return (
    <div
      className={`card-border bg-gradient-to-br ${accentClass} p-4 shadow-lg shadow-black/20 backdrop-blur`}
    >
      <div className="text-sm font-semibold text-white/80">{label}</div>
      <div className="mt-2 text-3xl font-bold text-white">{value}</div>
      {helper && <div className="mt-1 text-xs text-white/80">{helper}</div>}
    </div>
  );
}
