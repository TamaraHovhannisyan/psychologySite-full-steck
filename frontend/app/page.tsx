"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Post = {
  id: string;
  title: string;
  description: string;
  images: { url: string }[];
};

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:3001/posts", {
          method: "GET",
        });

        if (!res.ok) throw new Error("Failed to fetch posts");

        const data = await res.json();
        setPosts(data);
      } catch (err: any) {
        setError(err.message || "Network Error");
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">📬 Հրապարակումներ</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="border rounded-xl p-4 shadow-md">
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-700 mb-3">{post.description}</p>

            {post.images?.length > 0 && (
              <Image
                src={`http://localhost:3001/uploads/${post.images[0].url}`}
                alt={post.title}
                width={400}
                height={300}
                className="rounded-lg object-cover"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
