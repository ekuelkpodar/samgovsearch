import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import FilterSidebar, { SearchFilters } from "@/components/FilterSidebar";
import OpportunityCard from "@/components/OpportunityCard";
import SearchBar from "@/components/SearchBar";
import { getUserFromRequest } from "@/lib/auth";
import { Opportunity } from "@/types";
import { useRouter } from "next/router";

interface SearchResponse {
  data: Opportunity[];
  total: number;
  page: number;
  pageSize: number;
}

const defaultFilters: SearchFilters = {
  agency: [],
  department: [],
  naicsCodes: [],
  setAside: "",
  noticeTypes: [],
  valueMin: "",
  valueMax: "",
  deadlineFrom: "",
  deadlineTo: "",
  location: "",
  activeOnly: true,
};

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState((router.query.q as string) || "");
  const [useAi, setUseAi] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [results, setResults] = useState<SearchResponse>({ data: [], total: 0, page: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadFromQuery = () => {
    const f = { ...defaultFilters };
    if (router.query.agency) f.agency = String(router.query.agency).split(",");
    if (router.query.department) f.department = String(router.query.department).split(",");
    if (router.query.naics) f.naicsCodes = String(router.query.naics).split(",");
    if (router.query.setAside) f.setAside = String(router.query.setAside);
    if (router.query.noticeType) f.noticeTypes = String(router.query.noticeType).split(",");
    if (router.query.valueMin) f.valueMin = String(router.query.valueMin);
    if (router.query.valueMax) f.valueMax = String(router.query.valueMax);
    if (router.query.deadlineFrom) f.deadlineFrom = String(router.query.deadlineFrom);
    if (router.query.deadlineTo) f.deadlineTo = String(router.query.deadlineTo);
    if (router.query.location) f.location = String(router.query.location);
    if (router.query.activeOnly) f.activeOnly = router.query.activeOnly === "true";
    setFilters(f);
  };

  useEffect(() => {
    loadFromQuery();
  }, []);

  const runSearch = async (page = 1) => {
    setLoading(true);
    setError("");
    try {
      let searchQuery = query;
      if (useAi && query) {
        const rewriteRes = await fetch("/api/ai/rewrite-query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });
        if (rewriteRes.ok) {
          const { rewritten } = await rewriteRes.json();
          searchQuery = rewritten;
        }
      }

      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (filters.agency.length) params.set("agency", filters.agency.join(","));
      if (filters.department.length) params.set("department", filters.department.join(","));
      if (filters.naicsCodes.length) params.set("naics", filters.naicsCodes.join(","));
      if (filters.setAside) params.set("setAside", filters.setAside);
      if (filters.noticeTypes.length) params.set("noticeType", filters.noticeTypes.join(","));
      if (filters.valueMin) params.set("valueMin", filters.valueMin);
      if (filters.valueMax) params.set("valueMax", filters.valueMax);
      if (filters.deadlineFrom) params.set("deadlineFrom", filters.deadlineFrom);
      if (filters.deadlineTo) params.set("deadlineTo", filters.deadlineTo);
      if (filters.location) params.set("location", filters.location);
      if (filters.activeOnly) params.set("activeOnly", "true");
      params.set("page", String(page));

      router.replace({ pathname: "/search", query: Object.fromEntries(params.entries()) }, undefined, { shallow: true });

      const res = await fetch(`/api/opportunities/search?${params.toString()}`);
      if (!res.ok) throw new Error("Search failed");
      const data = (await res.json()) as SearchResponse;
      setResults(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async (opportunityId: string) => {
    const res = await fetch(`/api/opportunities/${opportunityId}/save`, { method: "POST" });
    if (!res.ok) alert("You must be logged in to save");
  };

  return (
    <Layout>
      <div className="grid gap-4 md:grid-cols-[320px_1fr]">
        <FilterSidebar
          filters={filters}
          onChange={(next) => setFilters(next)}
          onReset={() => setFilters(defaultFilters)}
        />
        <div className="space-y-4">
          <SearchBar query={query} onChange={setQuery} onSubmit={() => runSearch(1)} useAi={useAi} onToggleAi={setUseAi} />
          {error && <div className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</div>}
          <div className="flex items-center justify-between text-sm text-muted">
            <span>
              Showing {results.data.length} of {results.total} opportunities
            </span>
            <div className="flex gap-2">
              <button
                className="secondary"
                disabled={results.page <= 1 || loading}
                onClick={() => runSearch(results.page - 1)}
              >
                Previous
              </button>
              <button
                className="secondary"
                disabled={results.page * results.pageSize >= results.total || loading}
                onClick={() => runSearch(results.page + 1)}
              >
                Next
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {results.data.map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} onSave={handleSave} />
            ))}
            {!results.data.length && !loading && (
              <div className="card-border bg-glass p-4 text-sm text-muted">No results found. Try adjusting your filters.</div>
            )}
            {loading && <div className="text-sm text-muted">Loading...</div>}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const user = await getUserFromRequest(req as any);
  if (!user) {
    return {
      redirect: { destination: "/login", permanent: false },
    };
  }
  return { props: {} };
};
