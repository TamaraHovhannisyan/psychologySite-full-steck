"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "@/app/lib/api";
import { setToken } from "@/app/lib/auth";

function extractToken(d: any): string | undefined {
  return (
    d?.access_token ||
    d?.token ||
    d?.jwt ||
    d?.accessToken ||
    d?.data?.access_token ||
    d?.data?.token ||
    d?.data?.jwt ||
    d?.data?.accessToken
  );
}

const TABS = ["login", "register"] as const;
type Tab = (typeof TABS)[number];

export default function AdminAuthPage() {
  const router = useRouter();
  const [active, setActive] = useState<Tab>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  async function onLogin(e: React.FormEvent) {
    e.preventDefault(); setError(null); setLoading(true);
    try {
      const res = await apiPost("/auth/login", { email, password });
      if (!res.ok) throw new Error((await res.text()) || "Մուտքն անհաջող է");
      const data = await res.json();
      const token = extractToken(data);
      if (!token) throw new Error("Token չգտնվեց պատասխանման մեջ");
      setToken(token);
      router.replace("/admin/posts");
    } catch (err: any) { setError(err?.message || "Սերվերից սխալ եկավ"); }
    finally { setLoading(false); }
  }

  async function onRegister(e: React.FormEvent) {
    e.preventDefault(); setError(null); setLoading(true);
    try {
      const res = await apiPost("/auth/register", { name, email, password });
      if (!res.ok) throw new Error((await res.text()) || "Գրանցումն անհաջող է");
      const data = await res.json();
      const token = extractToken(data);
      if (!token) throw new Error("Token չգտնվեց պատասխանման մեջ");
      setToken(token);
      router.replace("/admin/posts");
    } catch (err: any) { setError(err?.message || "Սերվերից սխալ եկավ"); }
    finally { setLoading(false); }
  }

  return (
    <div className="bg-white shadow-sm rounded-2xl p-6">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Admin Panel Authentication
      </h1>

      <div className="mb-6 grid grid-cols-2 rounded-xl bg-gray-100 p-1">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`rounded-lg py-2 text-sm font-medium transition ${active === tab ? "bg-white shadow" : "text-gray-600"}`}
          >
            {tab === "login" ? "login" : "register"}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      {active === "login" ? (
        <form onSubmit={onLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg py-2 font-semibold bg-gray-900 text-white disabled:opacity-60"
          >
            {loading ? "please wait..." : "Enter"}
          </button>
        </form>
      ) : (
        <form onSubmit={onRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Անուն</label>
            <input
              type="text"
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Գաղտնաբառ</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg py-2 font-semibold bg-gray-900 text-white disabled:opacity-60"
          >
            {loading ? "Խնդրում եմ սպասել..." : "Գրանցվել"}
          </button>
        </form>
      )}
    </div>
  );
}
