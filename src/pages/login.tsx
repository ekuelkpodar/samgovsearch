import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      router.push("/search");
    } else {
      const data = await res.json();
      setError(data.error || "Login failed");
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-lg rounded-2xl bg-[#0f172a]/80 p-8 shadow-xl">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="mt-1 text-sm text-muted">Access AI-powered search, alerts, and proposals.</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
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
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-sm text-muted">
          No account? <a href="/signup" className="text-cyan-200">Create one</a>
        </p>
        <p className="mt-2 text-sm text-muted">
          Forgot password? <a href="/reset" className="text-cyan-200">Reset it</a>
        </p>
        <p className="mt-1 text-sm text-muted">
          Need verification? <a href="/verify" className="text-cyan-200">Verify email</a>
        </p>
      </div>
    </Layout>
  );
}
