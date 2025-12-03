import Layout from "@/components/Layout";

export default function PrivacyPage() {
  return (
    <Layout>
      <div className="card-border bg-[#0f172a]/80 p-6">
        <h1 className="text-2xl font-bold">Privacy</h1>
        <p className="mt-2 text-sm text-muted">We prioritize security and do not train AI models on your data.</p>
      </div>
    </Layout>
  );
}
