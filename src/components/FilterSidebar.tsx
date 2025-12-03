import { ChangeEvent } from "react";

export interface SearchFilters {
  agency: string[];
  department: string[];
  naicsCodes: string[];
  setAside: string;
  noticeTypes: string[];
  valueMin?: string;
  valueMax?: string;
  deadlineFrom?: string;
  deadlineTo?: string;
  location?: string;
  activeOnly: boolean;
}

interface Props {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  onReset: () => void;
}

const noticeOptions = ["Solicitation", "Sources Sought", "Award", "Presolicitation"];
const setAsides = ["Open", "Small Business", "8(a)", "WOSB", "SDVOSB", "HUBZone"];

export default function FilterSidebar({ filters, onChange, onReset }: Props) {
  const updateField = (field: keyof SearchFilters, value: unknown) => {
    onChange({ ...filters, [field]: value } as SearchFilters);
  };

  const parseCsv = (event: ChangeEvent<HTMLInputElement>, field: keyof SearchFilters) => {
    const parts = event.target.value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    updateField(field, parts);
  };

  const toggleNotice = (notice: string) => {
    const exists = filters.noticeTypes.includes(notice);
    const updated = exists
      ? filters.noticeTypes.filter((n) => n !== notice)
      : [...filters.noticeTypes, notice];
    updateField("noticeTypes", updated);
  };

  return (
    <aside className="card-border bg-[#0f172a]/80 p-4 shadow-lg shadow-cyan-500/5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        <button onClick={onReset} className="text-xs text-cyan-200 hover:text-cyan-100">
          Reset
        </button>
      </div>
      <div className="mt-4 flex flex-col gap-4 text-sm text-white/80">
        <div>
          <label className="text-xs text-muted">Agencies (comma separated)</label>
          <input
            type="text"
            value={filters.agency.join(", ")}
            onBlur={(e) => parseCsv(e, "agency")}
            placeholder="NASA, DoD, GSA"
            className="mt-1 w-full"
          />
        </div>
        <div>
          <label className="text-xs text-muted">Departments (comma separated)</label>
          <input
            type="text"
            value={filters.department.join(", ")}
            onBlur={(e) => parseCsv(e, "department")}
            placeholder="Air Force, Army"
            className="mt-1 w-full"
          />
        </div>
        <div>
          <label className="text-xs text-muted">NAICS codes (comma separated)</label>
          <input
            type="text"
            value={filters.naicsCodes.join(", ")}
            onBlur={(e) => parseCsv(e, "naicsCodes")}
            placeholder="541512, 541519"
            className="mt-1 w-full"
          />
        </div>
        <div>
          <label className="text-xs text-muted">Set-aside</label>
          <select
            className="mt-1 w-full"
            value={filters.setAside}
            onChange={(e) => updateField("setAside", e.target.value)}
          >
            <option value="">Any</option>
            {setAsides.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted">Notice types</label>
          <div className="mt-1 grid grid-cols-2 gap-2">
            {noticeOptions.map((n) => (
              <label key={n} className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={filters.noticeTypes.includes(n)}
                  onChange={() => toggleNotice(n)}
                />
                {n}
              </label>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted">Value min ($)</label>
            <input
              type="number"
              value={filters.valueMin || ""}
              onChange={(e) => updateField("valueMin", e.target.value)}
              className="mt-1 w-full"
            />
          </div>
          <div>
            <label className="text-xs text-muted">Value max ($)</label>
            <input
              type="number"
              value={filters.valueMax || ""}
              onChange={(e) => updateField("valueMax", e.target.value)}
              className="mt-1 w-full"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted">Deadline from</label>
            <input
              type="date"
              value={filters.deadlineFrom || ""}
              onChange={(e) => updateField("deadlineFrom", e.target.value)}
              className="mt-1 w-full"
            />
          </div>
          <div>
            <label className="text-xs text-muted">Deadline to</label>
            <input
              type="date"
              value={filters.deadlineTo || ""}
              onChange={(e) => updateField("deadlineTo", e.target.value)}
              className="mt-1 w-full"
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-muted">Location / place of performance</label>
          <input
            type="text"
            value={filters.location || ""}
            onChange={(e) => updateField("location", e.target.value)}
            placeholder="Remote, Virginia, CONUS"
            className="mt-1 w-full"
          />
        </div>
        <label className="flex items-center gap-2 text-xs text-muted">
          <input
            type="checkbox"
            checked={filters.activeOnly}
            onChange={(e) => updateField("activeOnly", e.target.checked)}
          />
          Only active opportunities
        </label>
      </div>
    </aside>
  );
}
