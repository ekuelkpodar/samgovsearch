import React from "react";
import { SavedOpportunity } from "@/types";

interface Props {
  items: SavedOpportunity[];
  onUpdateStatus: (id: string, status: SavedOpportunity["status"]) => void;
}

const columns: SavedOpportunity["status"][] = [
  "Evaluating",
  "Pursuing",
  "Submitted",
  "Won",
  "Lost",
];

export default function PipelineBoard({ items, onUpdateStatus }: Props) {
  const handleDrag = (event: React.DragEvent<HTMLDivElement>, id: string) => {
    event.dataTransfer.setData("text/plain", id);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, status: SavedOpportunity["status"]) => {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain");
    if (id) onUpdateStatus(id, status);
  };

  return (
    <div className="grid gap-4 md:grid-cols-5">
      {columns.map((status) => (
        <div
          key={status}
          className="card-border bg-[#0f172a]/80 p-3"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, status)}
        >
          <div className="mb-2 flex items-center justify-between text-sm font-semibold">
            <span>{status}</span>
            <span className="rounded-full bg-white/5 px-2 text-xs text-muted">
              {items.filter((i) => i.status === status).length}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {items
              .filter((item) => item.status === status)
              .map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg bg-white/5 p-3 text-xs text-white/80"
                  draggable
                  onDragStart={(e) => handleDrag(e, item.id)}
                >
                  <div className="text-sm font-semibold text-white">{item.opportunity?.title}</div>
                  <div className="mt-1 text-muted">
                    {item.opportunity?.agency} • {item.opportunity?.setAside}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {columns
                      .filter((s) => s !== status)
                      .map((option) => (
                        <button
                          key={option}
                          onClick={() => onUpdateStatus(item.id, option)}
                          className="rounded-full border border-white/10 px-2 py-1 text-[11px] text-muted hover:border-cyan-300/60 hover:text-white"
                        >
                          Move to {option}
                        </button>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
