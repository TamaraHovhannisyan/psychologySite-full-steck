"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

interface Post {
  id: string;
  title: string;
  description: string;
  images: { url: string }[];
}

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    axios.get(`http://localhost:3001/posts/${id}`).then((res) => {
      setPost(res.data);
    });
  }, [id]);

  if (!post) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{post.title}</h1>
      <p>{post.description}</p>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {post.images.map((img, i) => (
          <img
            key={i}
            src={`http://localhost:3001/uploads/${img.url}`}
            className="rounded w-full h-60 object-cover"
            alt={`image-${i}`}
          />
        ))}
      </div>
    </div>
  );
}
