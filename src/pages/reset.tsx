import Layout from "@/components/Layout";
import { FormEvent, useState } from "react";

export default function ResetPage() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState<"request" | "reset">("request");

  const requestReset = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/auth/request-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setMessage(data.message || "If valid, an email was sent.");
  };

  const submitReset = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/auth/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    setMessage(data.message || data.error || "Done");
  };

  return (
    <Layout>
      <div className="mx-auto max-w-lg space-y-4 rounded-2xl bg-[#0f172a]/80 p-8">
        <h1 className="text-2xl font-bold">Password reset</h1>
        <div className="flex gap-3 text-sm">
          <button
            className={`rounded-lg px-3 py-2 ${mode === "request" ? "bg-white/10" : "bg-white/5"}`}
            onClick={() => setMode("request")}
          >
            Request link
          </button>
          <button
            className={`rounded-lg px-3 py-2 ${mode === "reset" ? "bg-white/10" : "bg-white/5"}`}
            onClick={() => setMode("reset")}
          >
            Submit token
          </button>
        </div>

        {mode === "request" && (
          <form className="space-y-3" onSubmit={requestReset}>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
            <button className="primary" type="submit">Send reset token</button>
          </form>
        )}

        {mode === "reset" && (
          <form className="space-y-3" onSubmit={submitReset}>
            <input
              placeholder="Token from email"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full"
            />
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
            <button className="primary" type="submit">Update password</button>
          </form>
        )}

        {message && <div className="text-sm text-muted">{message}</div>}
      </div>
    </Layout>
  );
}
