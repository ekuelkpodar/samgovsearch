import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });
    if (res.ok) {
      router.push("/search");
    } else {
      const data = await res.json();
      setError(data.error || "Signup failed");
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-lg rounded-2xl bg-[#0f172a]/80 p-8 shadow-xl">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="mt-1 text-sm text-muted">Launch AI-powered capture workflows in minutes.</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm text-muted">Name</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full" />
          </div>
          <div>
            <label className="text-sm text-muted">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full" />
          </div>
          <div>
            <label className="text-sm text-muted">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full"
            />
          </div>
          {error && <div className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</div>}
          <button type="submit" className="w-full primary" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>
        <p className="mt-4 text-sm text-muted">
          Already have an account? <a href="/login" className="text-cyan-200">Log in</a>
        </p>
      </div>
    </Layout>
  );
}
