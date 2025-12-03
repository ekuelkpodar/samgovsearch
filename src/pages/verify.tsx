import Layout from "@/components/Layout";
import { FormEvent, useState } from "react";

export default function VerifyPage() {
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const data = await res.json();
    setMessage(data.message || data.error || "Done");
  };

  const resend = async () => {
    const res = await fetch("/api/auth/request-verification", { method: "POST" });
    const data = await res.json();
    setMessage(data.message || data.error || "Requested");
  };

  return (
    <Layout>
      <div className="mx-auto max-w-lg rounded-2xl bg-[#0f172a]/80 p-8">
        <h1 className="text-2xl font-bold">Verify your email</h1>
        <p className="text-sm text-muted">Enter the token you received to verify this account.</p>
        <form className="mt-4 space-y-3" onSubmit={submit}>
          <input value={token} onChange={(e) => setToken(e.target.value)} placeholder="Verification token" className="w-full" />
          <button className="primary" type="submit">Verify</button>
        </form>
        <button className="mt-3 w-full secondary" onClick={resend}>Resend token</button>
        {message && <div className="mt-3 text-sm text-muted">{message}</div>}
      </div>
    </Layout>
  );
}
