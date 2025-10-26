"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiGet, apiPatchForm } from "@/app/lib/api";

interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  imageUrl: string | null;
}

export default function EditPostPage() {
  const router = useRouter();
  const { id } = useParams();

  const [post, setPost] = useState<Post | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await apiGet(`/posts/${id}`);
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setPost(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [id]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!post) return;

    setSaving(true);
    setError(null);

    try {
      const form = new FormData();
      form.append("title", post.title);
      form.append("content", post.content);
      form.append("category", post.category);
      if (image) form.append("image", image);

      const res = await apiPatchForm(`/posts/${id}`, form);
      if (!res.ok) throw new Error(await res.text());

      router.replace("/admin/posts");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return <p className="text-center py-10 text-gray-600">Loading post...</p>;
  if (error) return <p className="text-center text-red-500 py-10">{error}</p>;
  if (!post) return <p className="text-center py-10">Post not found.</p>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow mt-6 sm:mt-10">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">
        Edit Post #{post.id}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 sm:space-y-5 text-sm sm:text-base"
      >
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#017187]"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Content</label>
          <textarea
            value={post.content}
            onChange={(e) => setPost({ ...post, content: e.target.value })}
            className="w-full p-3 border rounded-lg min-h-[160px] sm:min-h-[200px] focus:outline-none focus:ring-2 focus:ring-[#017187]"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Category</label>
          <select
            value={post.category}
            onChange={(e) => setPost({ ...post, category: e.target.value })}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#017187]"
          >
            <option value="article">Article</option>
            <option value="psychology">Psychology</option>
            <option value="selfgrowth">Self Development</option>
          </select>
        </div>

        {post.imageUrl && (
          <div>
            <p className="text-sm text-gray-600 mb-1">Current Image:</p>
            <div className="relative w-full h-56 sm:h-72 rounded-lg overflow-hidden border">
              <img
                src={
                  post.imageUrl.startsWith("http")
                    ? post.imageUrl
                    : `${process.env.NEXT_PUBLIC_API_URL}${post.imageUrl}`
                }
                alt="Current post"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">
            Upload new image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="w-full text-sm border p-2 rounded-md bg-gray-50 cursor-pointer hover:bg-gray-100"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#017187] text-white py-2 rounded-lg hover:bg-[#015e6e] transition font-semibold"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
