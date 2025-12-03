import Link from "next/link";
import { Opportunity } from "@/types";

interface Props {
  opportunity: Opportunity;
  onSave?: (opportunityId: string) => void;
}

export default function OpportunityCard({ opportunity, onSave }: Props) {
  const valueRange = [opportunity.estimatedValueMin, opportunity.estimatedValueMax]
    .filter((v) => v !== null && v !== undefined)
    .join(" – ");

  return (
    <div className="card-border bg-glass p-4 shadow-lg shadow-cyan-500/5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href={`/opportunity/${opportunity.id}`}
            className="text-lg font-semibold text-white hover:text-cyan-300"
          >
            {opportunity.title}
          </Link>
          <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted">
            <span>{opportunity.agency}</span>
            {opportunity.department && <span>• {opportunity.department}</span>}
            <span>• {opportunity.noticeType}</span>
          </div>
        </div>
        <div className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-cyan-300">
          {opportunity.setAside || "Open"}
        </div>
      </div>
      <div className="mt-3 grid gap-3 text-sm text-muted md:grid-cols-3">
        <div>
          <div className="text-white/70">Value</div>
          <div>{valueRange || "TBD"}</div>
        </div>
        <div>
          <div className="text-white/70">Deadline</div>
          <div>{new Date(opportunity.responseDeadline).toLocaleDateString()}</div>
        </div>
        <div>
          <div className="text-white/70">Notice</div>
          <div>{opportunity.noticeType}</div>
        </div>
      </div>
      <p className="mt-3 line-clamp-3 text-sm text-muted">{opportunity.description}</p>
      <div className="mt-4 flex gap-3">
        <Link
          href={`/opportunity/${opportunity.id}`}
          className="rounded-lg border border-cyan-300/60 px-3 py-2 text-sm font-semibold text-cyan-200 hover:bg-cyan-400/10"
        >
          View details
        </Link>
        <button
          onClick={() => onSave?.(opportunity.id)}
          className="rounded-lg bg-white/5 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
        >
          Save
        </button>
      </div>
    </div>
  );
}
