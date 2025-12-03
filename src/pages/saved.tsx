import Layout from "@/components/Layout";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { SavedOpportunity } from "@/types";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";

export default function SavedPage({ initial }: { initial: SavedOpportunity[] }) {
  const [items, setItems] = useState<SavedOpportunity[]>(initial);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/saved-opportunities");
      if (res.ok) {
        const data = await res.json();
        setItems(data.data);
      }
    };
    load();
  }, []);

  const updateStatus = async (id: string, status: SavedOpportunity["status"]) => {
    await fetch(`/api/saved-opportunities/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
  };

  return (
    <Layout>
      <section className="card-border bg-[#0f172a]/80 p-6">
        <h1 className="text-2xl font-bold">Saved opportunities</h1>
        <p className="text-sm text-muted">Quickly change status or open details.</p>
      </section>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="card-border bg-glass p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-white">{item.opportunity?.title}</div>
                <div className="text-sm text-muted">
                  {item.opportunity?.agency} • {item.opportunity?.setAside}
                </div>
                <div className="mt-1 text-xs text-muted">
                  Deadline: {new Date(item.opportunity?.responseDeadline || "").toLocaleDateString()}
                </div>
              </div>
              <select
                value={item.status}
                onChange={(e) => updateStatus(item.id, e.target.value as SavedOpportunity["status"])}
                className="rounded-lg bg-white/5 px-3 py-2 text-sm"
              >
                {(["Evaluating", "Pursuing", "Submitted", "Won", "Lost"] as const).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
        {!items.length && <div className="text-sm text-muted">No saved items yet.</div>}
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const user = await getUserFromRequest(req as any);
  if (!user) return { redirect: { destination: "/login", permanent: false } };

  const saved = await prisma.savedOpportunity.findMany({
    where: { userId: user.id },
    include: { opportunity: true },
  });

  return { props: { initial: JSON.parse(JSON.stringify(saved)) } };
};
