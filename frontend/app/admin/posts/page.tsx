"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { apiGet, apiDelete } from "@/app/lib/api";
import { getToken, clearToken } from "@/app/lib/auth";
import { AdminListResp, Post } from "@/app/types";
import Image from "next/image";
const AdminHeader = dynamic(() => import("@/components/admin/AdminHeader"), {
  ssr: false,
});

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
const API_ORIGIN = new URL(API_BASE).origin;

function resolveImageUrl(image?: string | null) {
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return image;

  if (image.startsWith("/uploads")) {
    return `${API_ORIGIN}${image}`;
  }

  return `${API_ORIGIN}/uploads/${image.replace(/^\/+/, "")}`;
}

export default function AdminPostsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function load() {
    const t = getToken();
    if (!t) {
      router.replace("/admin");
      return;
    }
    try {
      setError(null);
      const res = await apiGet("/admin/posts", t);
      if (res.status === 401) {
        clearToken();
        router.replace("/admin");
        return;
      }
      if (!res.ok)
        throw new Error((await res.text()) || "Failed to load posts.");
      const data: AdminListResp | Post[] = await res.json();
      const items = Array.isArray(data)
        ? data
        : Array.isArray(data?.items)
          ? data.items
          : [];
      setPosts(items);
    } catch (e: any) {
      setError(e?.message || "Error from server");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function handleLogout() {
    clearToken();
    router.replace("/admin");
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this email? The action is irreversible.")) return;
    const t = getToken();
    if (!t) {
      router.replace("/admin");
      return;
    }
    try {
      setDeletingId(id);
      setError(null);
      const res = await apiDelete(`/admin/posts/${id}`, t);
      const text = await res.text();
      if (!res.ok) throw new Error(text || "Failed to delete");
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (e: any) {
      setError(e?.message || "An error occurred from the server.");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return <div className="bg-white shadow-sm rounded-2xl p-6">Loading…</div>;
  }

  return (
    <div className="bg-white shadow-sm rounded-2xl p-6">
      <AdminHeader onLogout={handleLogout} />

      <div className="mb-4 flex justify-end">
        <Link
          href="/admin/posts/new"
          className="rounded-lg px-3 py-1.5 bg-gray-900 text-white"
        >
          + new post
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      {posts.length === 0 ? (
        <p className="text-gray-600">Empty (no posts)։</p>
      ) : (
        <ul className="divide-y border rounded-lg">
          {posts.map((p) => (
            <li key={p.id} className="p-3 flex items-center gap-3">
              {p.image ? (
                <Image
                  width={48}
                  height={48}
                  src={resolveImageUrl(p.image)}
                  alt=""
                  className="h-12 w-12 rounded object-cover border"
                />
              ) : (
                <div className="h-12 w-12 rounded bg-gray-100 border grid place-items-center text-xs text-gray-500">
                  No img
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{p.title}</div>
                <div className="text-xs text-gray-500">
                  {p.category} • {p.slug || "—"} •{" "}
                  {new Date(p.createdAt).toLocaleDateString()} •{" "}
                  {p.published ? "Published" : "Draft"}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/posts/${p.id}/edit`}
                  className="rounded-md px-3 py-1.5 border text-sm"
                >
                  Edit
                </Link>
                <button
                  onClick={() => onDelete(p.id)}
                  disabled={deletingId === p.id}
                  className="rounded-md px-3 py-1.5 border text-sm text-red-600 disabled:opacity-60"
                >
                  {deletingId === p.id ? "Delete..." : "Delete"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
