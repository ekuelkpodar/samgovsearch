import Layout from "@/components/Layout";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { SavedSearch } from "@/types";
import { GetServerSideProps } from "next";
import { useState } from "react";

interface AlertProps extends SavedSearch {
  alerts: { isActive: boolean }[];
}

export default function AlertsPage({ initial }: { initial: AlertProps[] }) {
  const [searches, setSearches] = useState<AlertProps[]>(initial);
  const [name, setName] = useState("");
  const [query, setQuery] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");

  const toggleActive = async (id: string, isActive: boolean) => {
    await fetch(`/api/saved-searches/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });
    setSearches((prev) => prev.map((s) => (s.id === id ? { ...s, alerts: [{ isActive }] } : s)));
  };

  const addSearch = async () => {
    if (!name || !query) return;
    const res = await fetch("/api/saved-searches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, query, filters: {}, frequency }),
    });
    if (res.ok) {
      const data = await res.json();
      setSearches((prev) => [{ ...data.savedSearch, alerts: [{ isActive: true }] }, ...prev]);
      setName("");
      setQuery("");
    }
  };

  return (
    <Layout>
      <section className="card-border bg-[#0f172a]/80 p-6">
        <h1 className="text-2xl font-bold">Saved searches & alerts</h1>
        <p className="text-sm text-muted">Daily/weekly digests from your queries.</p>
      </section>
      <section className="card-border bg-glass p-4 mt-3 space-y-3">
        <div className="text-sm font-semibold text-white">Create new saved search</div>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full"
        />
        <input
          placeholder="Plain language query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full"
        />
        <label className="text-sm text-muted">Frequency</label>
        <select value={frequency} onChange={(e) => setFrequency(e.target.value as "daily" | "weekly")}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
        <button className="primary" onClick={addSearch}>Save search & enable alerts</button>
      </section>
      <div className="mt-4 space-y-3">
        {searches.map((search) => (
          <div key={search.id} className="card-border bg-glass p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-white">{search.name}</div>
                <div className="text-sm text-muted">{search.query}</div>
                <div className="mt-1 text-xs text-muted">Frequency: {search.frequency}</div>
              </div>
              <label className="flex items-center gap-2 text-sm text-muted">
                <input
                  type="checkbox"
                  checked={search.alerts?.[0]?.isActive ?? true}
                  onChange={(e) => toggleActive(search.id, e.target.checked)}
                />
                Active
              </label>
            </div>
          </div>
        ))}
        {!searches.length && <div className="text-sm text-muted">No saved searches yet.</div>}
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const user = await getUserFromRequest(req as any);
  if (!user) return { redirect: { destination: "/login", permanent: false } };

  const savedSearches = await prisma.savedSearch.findMany({
    where: { userId: user.id },
    include: { alerts: true },
  });

  return { props: { initial: JSON.parse(JSON.stringify(savedSearches)) } };
};
