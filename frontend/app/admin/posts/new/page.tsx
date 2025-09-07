"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost, apiPostForm } from "@/app/lib/api";
import { getToken } from "@/app/lib/auth";

const CATEGORIES = [
  { value: "articles", label: "articles" },
  { value: "self-growth", label: "self-growth" },
  { value: "psychology", label: "psychology" },
] as const;

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/(^-|-$)/g, "");
}

export default function NewPostPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] =
    useState<(typeof CATEGORIES)[number]["value"]>("articles");
  const [published, setPublished] = useState(true);
  const [file, setFile] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const autoSlug = useMemo(() => slugify(title), [title]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const token = getToken();
    if (!token) {
      router.replace("/admin");
      return;
    }

    try {
      let res: Response;

      if (file) {

        const form = new FormData();
        form.append("title", title);
        form.append("slug", slug || autoSlug);
        form.append("content", content);
        form.append("category", category);
        form.append("published", String(published));
        form.append("image", file);
        res = await apiPostForm("/admin/posts", form, token);
      } else {
        res = await apiPost(
          "/admin/posts",
          {
            title,
            slug: slug || autoSlug,
            content,
            category,
            published,
          },
          token
        );
      }

      const text = await res.text();
      if (!res.ok) throw new Error(text || "Failed to create mail.");

      router.replace("/admin/posts");
    } catch (e: any) {
      setError(e?.message || "An error occurred from the server.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white shadow-sm rounded-2xl p-6 max-w-3xl">
      <h1 className="text-2xl font-semibold mb-6">new post</h1>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
          />
          <p className="text-xs text-gray-500 mt-1">
            Slug (auto): {autoSlug || "—"}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Slug (as desired)
          </label>
          <input
            value={slug}
            onChange={(e) => setSlug(slugify(e.target.value))}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Content</label>
          <textarea
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Picture (from file)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          {file && (
            <p className="text-xs text-gray-500 mt-1">
              <strong>{file.name}</strong>
            </p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full rounded-lg border px-3 py-2"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            <span className="text-sm">
              {`Published (If you don't publish it, it will remain in draft.)`}
            </span>
          </label>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving || !title}
            className="rounded-lg px-4 py-2 font-semibold bg-gray-900 text-white disabled:opacity-60"
          >
            {saving ? "Saving…" : "Create"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg px-4 py-2 border"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
}
