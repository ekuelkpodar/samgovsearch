import Layout from "@/components/Layout";
import { useState } from "react";

export default function ToolsPage() {
  const [naicsQuery, setNaicsQuery] = useState("");
  const [naicsResults, setNaicsResults] = useState<string[]>([]);
  const [miniQuery, setMiniQuery] = useState("");
  const [miniResults, setMiniResults] = useState<string[]>([]);

  const handleNaics = () => {
    if (!naicsQuery) return;
    setNaicsResults([
      `${naicsQuery} - 541512 (Computer Systems Design)` ,
      `${naicsQuery} - 541611 (Admin & Management Consulting)`,
    ]);
  };

  const handleMiniSearch = () => {
    if (!miniQuery) return;
    setMiniResults([
      `Sample result for "${miniQuery}" (value ~$1.2M, deadline in 20 days)`,
      `Sample result for "${miniQuery}" (value ~$500k, deadline in 35 days)`,
    ]);
  };

  return (
    <Layout>
      <section className="card-border bg-[#0f172a]/80 p-8">
        <h1 className="text-3xl font-bold">Free GovCon Tools</h1>
        <p className="mt-2 text-muted">Quick utilities to explore NAICS codes and run a lightweight search.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="card-border bg-glass p-5">
          <h3 className="text-lg font-semibold">NAICS code finder</h3>
          <p className="text-sm text-muted">Type what you do and we suggest relevant codes.</p>
          <div className="mt-3 flex gap-2">
            <input
              className="flex-1"
              placeholder="cybersecurity, logistics, cloud"
              value={naicsQuery}
              onChange={(e) => setNaicsQuery(e.target.value)}
            />
            <button className="primary" onClick={handleNaics}>Find</button>
          </div>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            {naicsResults.map((r) => (
              <li key={r} className="rounded bg-white/5 px-3 py-2">{r}</li>
            ))}
          </ul>
        </div>

        <div className="card-border bg-glass p-5">
          <h3 className="text-lg font-semibold">Mini contract search</h3>
          <p className="text-sm text-muted">Try a lightweight search without creating an account.</p>
          <div className="mt-3 flex gap-2">
            <input
              className="flex-1"
              placeholder="cloud migration"
              value={miniQuery}
              onChange={(e) => setMiniQuery(e.target.value)}
            />
            <button className="primary" onClick={handleMiniSearch}>Search</button>
          </div>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            {miniResults.map((r) => (
              <li key={r} className="rounded bg-white/5 px-3 py-2">{r}</li>
            ))}
          </ul>
        </div>
      </section>
    </Layout>
  );
}
