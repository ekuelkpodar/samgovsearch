import Layout from "@/components/Layout";
import StatCard from "@/components/StatCard";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { Opportunity, SavedOpportunity } from "@/types";
import { GetServerSideProps } from "next";

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
}

export default function DashboardPage({ stats, recent, pipeline }: Props) {
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
        <h2 className="text-lg font-semibold">Pipeline activity</h2>
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
      </section>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const user = await getUserFromRequest(req as any);
  if (!user) return { redirect: { destination: "/login", permanent: false } };

  const [totals, pipeline, recent] = await Promise.all([
    prisma.savedOpportunity.groupBy({ by: ["status"], _count: true, where: { userId: user.id } }),
    prisma.savedOpportunity.findMany({
      where: { userId: user.id },
      include: { opportunity: true },
      orderBy: { updatedAt: "desc" },
      take: 9,
    }),
    prisma.opportunity.findMany({ orderBy: { postedDate: "desc" }, take: 6 }),
  ]);

  const [totalOpps, openOpps, saved, proposals, savedSearches] = await Promise.all([
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
        savedSearches,
        pipeline: totals.map((t) => ({ status: t.status, count: t._count })),
      },
      recent: JSON.parse(JSON.stringify(recent)),
      pipeline: JSON.parse(JSON.stringify(pipeline)),
    },
  };
};
