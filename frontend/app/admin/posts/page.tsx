"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();

  const fetchPosts = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      setError("Error loading posts");
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:3001/posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Delete failed");

      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (err) {
      alert("Failed to delete post");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6">All Posts (Admin)</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="flex justify-end mb-4">
        <button
          onClick={() => router.push("/admin/posts/create")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Create New Post
        </button>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="border p-4 rounded shadow-sm">
            <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-700 mb-2">{post.description}</p>

            {post.images?.[0]?.url && (
              <Image
                src={`http://localhost:3001/uploads/${post.images[0].url}`}
                alt={post.title}
                width={300}
                height={200}
                className="rounded mb-2"
              />
            )}

            <div className="flex gap-4">
              <button
                onClick={() => router.push(`/admin/posts/edit/${post.id}`)}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(post.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
