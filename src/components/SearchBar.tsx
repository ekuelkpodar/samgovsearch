interface Props {
  query: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  useAi: boolean;
  onToggleAi: (value: boolean) => void;
}

export default function SearchBar({ query, onChange, onSubmit, useAi, onToggleAi }: Props) {
  return (
    <div className="card-border bg-glass p-4 shadow-lg shadow-cyan-500/10">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search for cybersecurity services under $5M for DoD"
          className="flex-1 text-base"
        />
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={useAi}
              onChange={(e) => onToggleAi(e.target.checked)}
            />
            Use AI rewrite
          </label>
          <button onClick={onSubmit} className="primary">
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
