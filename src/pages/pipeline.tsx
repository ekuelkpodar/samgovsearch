import Layout from "@/components/Layout";
import PipelineBoard from "@/components/PipelineBoard";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { SavedOpportunity } from "@/types";
import { GetServerSideProps } from "next";
import { useState } from "react";

export default function PipelinePage({ initial }: { initial: SavedOpportunity[] }) {
  const [items, setItems] = useState<SavedOpportunity[]>(initial);

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
        <h1 className="text-2xl font-bold">Pipeline</h1>
        <p className="text-sm text-muted">Kanban view of saved opportunities by status.</p>
      </section>
      <div className="mt-4">
        <PipelineBoard items={items} onUpdateStatus={updateStatus} />
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
