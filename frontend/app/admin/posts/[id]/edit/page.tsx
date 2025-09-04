"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiGet, apiPatch, apiPatchForm } from "@/app/lib/api";
import { getToken, clearToken } from "@/app/lib/auth";

const CATEGORIES = [
  { value: "articles", label: "Հոդվածներ" },
  { value: "self-growth", label: "Ինքնազարգացում" },
  { value: "psychology", label: "Հոգեբանություն" },
] as const;

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/(^-|-$)/g, "");
}

export default function EditPostPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] =
    useState<(typeof CATEGORIES)[number]["value"]>("articles");
  const [published, setPublished] = useState(true);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);

  const autoSlug = useMemo(() => slugify(title), [title]);

  useEffect(() => {
    const t = getToken();
    if (!t) return router.replace("/admin");

    (async () => {
      try {
        const res = await apiGet(`/admin/posts/${id}`, t);
        if (res.status === 401) {
          clearToken();
          return router.replace("/admin");
        }
        if (!res.ok) throw new Error(await res.text());
        const p = await res.json();
        setTitle(p.title ?? "");
        setSlug(p.slug ?? "");
        setContent(p.content ?? "");
        setCategory(p.category ?? "articles");
        setPublished(!!p.published);
        setCurrentImage(p.image ?? null);
      } catch (e: any) {
        setError(e?.message || "Չհաջողվեց բեռնել");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, router]);

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const t = getToken();
    if (!t) return router.replace("/admin");

    try {
      let res: Response;
      if (file) {
        const form = new FormData();
        form.append("title", title);
        if (slug) form.append("slug", slug);
        form.append("content", content);
        form.append("category", category);
        form.append("published", String(published));
        form.append("image", file);
        res = await apiPatchForm(`/admin/posts/${id}`, form, t);
      } else {
        const body: any = { title, content, category, published };
        if (slug) body.slug = slug;
        if (removeImage) body.image = null;
        res = await apiPatch(`/admin/posts/${id}`, body, t);
      }

      const text = await res.text();
      if (!res.ok) throw new Error(text || "Չհաջողվեց պահպանել");
      router.replace("/admin/posts");
    } catch (e: any) {
      setError(e?.message || "Սխալ սերվերից");
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <div className="bg-white shadow-sm rounded-2xl p-6">Բեռնվում է…</div>
    );

  return (
    <div className="bg-white shadow-sm rounded-2xl p-6 max-w-3xl">
      <h1 className="text-2xl font-semibold mb-6">Փոստի խմբագրում</h1>
      {error && (
        <div className="mb-4 rounded bg-red-50 p-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={onSave} className="space-y-5">
        <div>
          <label className="block text-sm mb-1">Վերնագիր *</label>
          <input
            className="w-full rounded-lg border px-3 py-2"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Slug</label>
            <input
              className="w-full rounded-lg border px-3 py-2"
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              placeholder={autoSlug}
            />
            <p className="text-xs text-gray-500 mt-1">
              Auto: {autoSlug || "—"}
            </p>
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            <span className="text-sm">Հրապարակված</span>
          </label>
        </div>

        <div>
          <label className="block text-sm mb-1">Բովանդակություն</label>
          <textarea
            className="w-full rounded-lg border px-3 py-2"
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Կատեգորիա *</label>
            <select
              className="w-full rounded-lg border px-3 py-2"
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">
              Նոր նկար (ըստ ցանկության)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            {currentImage && !file && (
              <label className="mt-2 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={removeImage}
                  onChange={(e) => setRemoveImage(e.target.checked)}
                />
                Հեռացնել ընթացիկ նկարը
              </label>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving || !title}
            className="rounded-lg px-4 py-2 font-semibold bg-gray-900 text-white disabled:opacity-60"
          >
            {saving ? "Պահպանում…" : "Պահպանել"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg px-4 py-2 border"
          >
            Ետ
          </button>
        </div>
      </form>
    </div>
  );
}
