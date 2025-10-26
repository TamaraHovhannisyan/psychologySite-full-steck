"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiGet, apiDelete } from "@/app/lib/api";
import { Trash2, Edit3, Plus } from "lucide-react";

interface Post {
  id: number;
  title: string;
  category: string;
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadPosts() {
    try {
      const res = await apiGet("/posts");
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setPosts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this post?")) return;
    await apiDelete(`/posts/${id}`);
    loadPosts();
  }

  useEffect(() => {
    loadPosts();
  }, []);

  if (loading)
    return <p className="text-center py-10 text-gray-600">Loading posts...</p>;

  if (error)
    return (
      <p className="text-center text-red-500 font-medium py-10">{error}</p>
    );

  if (posts.length === 0)
    return (
      <section className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">No posts found</h2>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 bg-[#017187] text-white px-4 py-2 rounded-lg hover:bg-[#015e6e] transition"
        >
          <Plus size={18} /> Create Post
        </Link>
      </section>
    );

  return (
    <section className="w-full">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-[#075E6C]">Manage Posts</h2>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center justify-center gap-2 bg-[#017187] text-white px-4 py-2 rounded-lg hover:bg-[#015e6e] transition"
        >
          <Plus size={18} /> New Post
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
        <table className="w-full border-collapse bg-white text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 w-[70px]">ID</th>
              <th className="p-3 min-w-[180px]">Title</th>
              <th className="p-3 min-w-[120px]">Category</th>
              <th className="p-3 w-[130px] text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {posts.map((post) => (
              <tr
                key={post.id}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="p-3 text-gray-700">{post.id}</td>
                <td className="p-3 text-gray-900 font-medium">{post.title}</td>
                <td className="p-3 capitalize text-gray-600">
                  {post.category}
                </td>
                <td className="p-3 text-center flex sm:justify-center gap-3">
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Edit3 size={16} />{" "}
                    <span className="hidden sm:inline">Edit</span>
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-red-600 hover:text-red-800 flex items-center gap-1"
                  >
                    <Trash2 size={16} />{" "}
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
