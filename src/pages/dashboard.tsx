import Layout from "@/components/Layout";
import StatCard from "@/components/StatCard";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { Opportunity, SavedOpportunity, SavedSearch } from "@/types";
import { GetServerSideProps } from "next";
import useSWR from "swr";

interface Props {
  stats: {
    totalOpps: number;
    openOpps: number;
    saved: number;
    proposals: number;
    savedSearches: number;
    pipeline: { status: string; count: number }[];
  };
  recent: Opportunity[];
  pipeline: SavedOpportunity[];
  savedSearches: SavedSearch[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DashboardPage({ stats, recent, pipeline, savedSearches }: Props) {
  const { data: activity } = useSWR("/api/dashboard/activity", fetcher, { refreshInterval: 60_000 });
  const { data: trends } = useSWR("/api/dashboard/trends", fetcher, { refreshInterval: 120_000 });
  const totalPipeline = stats.pipeline.reduce((acc, item) => acc + item.count, 0) || 1;

  return (
    <Layout>
      <section className="grid gap-4 md:grid-cols-5">
        <StatCard label="Opportunities" value={stats.totalOpps} helper="All records" accent="cyan" />
        <StatCard label="Open" value={stats.openOpps} helper="Active status" accent="green" />
        <StatCard label="Saved" value={stats.saved} helper="Bookmarked" accent="pink" />
        <StatCard label="Proposals" value={stats.proposals} helper="Drafts" accent="amber" />
        <StatCard label="Saved searches" value={stats.savedSearches} helper="Alerts enabled" accent="cyan" />
      </section>

      <section className="mt-4 grid gap-4 md:grid-cols-[1.2fr_1fr]">
        <div className="card-border bg-[#0f172a]/80 p-5">
          <h2 className="text-lg font-semibold">Recent opportunities</h2>
          <div className="mt-3 divide-y divide-white/5 text-sm text-muted">
            {recent.map((opp) => (
              <div key={opp.id} className="py-3">
                <div className="text-base font-semibold text-white">{opp.title}</div>
                <div className="text-muted">{opp.agency} • {opp.setAside}</div>
                <div className="text-xs text-muted">Deadline {new Date(opp.responseDeadline).toLocaleDateString()}</div>
              </div>
            ))}
            {!recent.length && <div className="py-3 text-sm text-muted">No recent items.</div>}
          </div>
        </div>
        <div className="card-border bg-glass p-5">
          <h2 className="text-lg font-semibold">Pipeline mix</h2>
          <div className="mt-3 space-y-3 text-sm text-white/80">
            {stats.pipeline.map((group) => {
              const pct = Math.round((group.count / totalPipeline) * 100);
              return (
                <div key={group.status}>
                  <div className="flex items-center justify-between">
                    <span>{group.status}</span>
                    <span className="text-xs text-muted">{group.count} ({pct}%)</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-white/10">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-sky-500"
                      style={{ width: `${Math.max(6, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {!stats.pipeline.length && <div className="text-muted">No pipeline yet.</div>}
          </div>
        </div>
      </section>

      <section className="mt-4 card-border bg-[#0f172a]/80 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">30-day velocity</h2>
          <div className="text-xs text-muted">Opportunities posted vs. your pipeline updates</div>
        </div>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          {[
            { label: "Opportunities posted", series: trends?.opportunities },
            { label: "Your pipeline updates", series: trends?.saved },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-white/5 p-4 text-sm text-white/80">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">{item.label}</span>
                <span className="text-xs text-muted">
                  {item.series ? item.series.reduce((s: number, p: any) => s + p.count, 0) : "—"} events
                </span>
              </div>
              <div className="mt-3 h-24 w-full rounded-lg bg-white/5 p-2">
                <svg viewBox="0 0 120 40" className="h-full w-full">
                  {item.series &&
                    item.series.map((point: any, idx: number) => {
                      const max = Math.max(...item.series.map((p: any) => p.count), 1);
                      const x = (idx / Math.max(item.series.length - 1, 1)) * 120;
                      const y = 40 - (point.count / max) * 36 - 2;
                      return <circle key={point.date} cx={x} cy={y} r={1.6} fill="#22d3ee" opacity={0.8} />;
                    })}
                  {item.series &&
                    item.series.slice(1).map((point: any, idx: number) => {
                      const max = Math.max(...item.series.map((p: any) => p.count), 1);
                      const x1 = (idx / Math.max(item.series.length - 1, 1)) * 120;
                      const y1 = 40 - (item.series[idx].count / max) * 36 - 2;
                      const x2 = ((idx + 1) / Math.max(item.series.length - 1, 1)) * 120;
                      const y2 = 40 - (point.count / max) * 36 - 2;
                      return <line key={idx} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#22d3ee" strokeWidth="0.6" />;
                    })}
                </svg>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-4 grid gap-4 md:grid-cols-[1.2fr_1fr]">
        <div className="card-border bg-[#0f172a]/80 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Pipeline activity (7d)</h2>
            <div className="text-xs text-muted">{activity?.since ? `since ${new Date(activity.since).toLocaleDateString()}` : "Refreshing..."}</div>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-3 text-sm text-white/80">
            {pipeline.map((item) => (
              <div key={item.id} className="rounded-lg bg-white/5 p-3">
                <div className="text-base font-semibold text-white">{item.opportunity?.title}</div>
                <div className="text-muted">{item.status} • {item.priority}</div>
                <div className="text-xs text-muted">Updated {new Date(item.updatedAt || "").toLocaleDateString()}</div>
              </div>
            ))}
            {!pipeline.length && <div className="text-muted">No saved opportunities.</div>}
          </div>
        </div>
        <div className="card-border bg-glass p-5">
          <h2 className="text-lg font-semibold">Top signals</h2>
          <div className="mt-3 space-y-3 text-sm text-white/80">
            <div className="rounded-lg bg-white/5 p-3">
              <div className="text-xs text-muted">New opportunities (7d)</div>
              <div className="text-2xl font-bold text-white">{activity?.newOpportunities ?? "—"}</div>
            </div>
            <div className="rounded-lg bg-white/5 p-3">
              <div className="text-xs text-muted">Your updates (7d)</div>
              <div className="text-2xl font-bold text-white">{activity?.newSaved ?? "—"}</div>
            </div>
            <div className="rounded-lg bg-white/5 p-3">
              <div className="text-xs text-muted">Top agencies</div>
              <div className="mt-2 space-y-1 text-muted">
                {activity?.topAgencies?.map((a: any) => (
                  <div key={a.name} className="flex justify-between">
                    <span>{a.name}</span>
                    <span>{a.count}</span>
                  </div>
                )) || "Loading..."}
              </div>
            </div>
            <div className="rounded-lg bg-white/5 p-3">
              <div className="text-xs text-muted">Top set-asides</div>
              <div className="mt-2 space-y-1 text-muted">
                {activity?.topSetAsides?.map((s: any) => (
                  <div key={s.name} className="flex justify-between">
                    <span>{s.name}</span>
                    <span>{s.count}</span>
                  </div>
                )) || "Loading..."}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-4 card-border bg-[#0f172a]/80 p-5">
        <h2 className="text-lg font-semibold">Saved searches</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3 text-sm text-white/80">
          {savedSearches.map((search) => (
            <div key={search.id} className="rounded-lg bg-white/5 p-3">
              <div className="text-base font-semibold text-white">{search.name}</div>
              <div className="text-muted line-clamp-2">{search.query}</div>
              <div className="text-xs text-muted">Frequency: {search.frequency}</div>
            </div>
          ))}
          {!savedSearches.length && <div className="text-muted">No saved searches yet.</div>}
        </div>
      </section>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const user = await getUserFromRequest(req as any);
  if (!user) return { redirect: { destination: "/login", permanent: false } };

  const [totals, pipeline, recent, savedSearches] = await Promise.all([
    prisma.savedOpportunity.groupBy({ by: ["status"], _count: true, where: { userId: user.id } }),
    prisma.savedOpportunity.findMany({
      where: { userId: user.id },
      include: { opportunity: true },
      orderBy: { updatedAt: "desc" },
      take: 9,
    }),
    prisma.opportunity.findMany({ orderBy: { postedDate: "desc" }, take: 6 }),
    prisma.savedSearch.findMany({ where: { userId: user.id }, orderBy: { updatedAt: "desc" }, take: 6 }),
  ]);

  const [totalOpps, openOpps, saved, proposals, savedSearchesCount] = await Promise.all([
    prisma.opportunity.count(),
    prisma.opportunity.count({ where: { status: "Open" } }),
    prisma.savedOpportunity.count({ where: { userId: user.id } }),
    prisma.proposalDraft.count({ where: { userId: user.id } }),
    prisma.savedSearch.count({ where: { userId: user.id } }),
  ]);

  return {
    props: {
      stats: {
        totalOpps,
        openOpps,
        saved,
        proposals,
        savedSearches: savedSearchesCount,
        pipeline: totals.map((t) => ({ status: t.status, count: t._count })),
      },
      recent: JSON.parse(JSON.stringify(recent)),
      pipeline: JSON.parse(JSON.stringify(pipeline)),
      savedSearches: JSON.parse(JSON.stringify(savedSearches)),
    },
  };
};
