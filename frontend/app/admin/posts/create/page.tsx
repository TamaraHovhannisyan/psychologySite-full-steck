"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<FileList | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in");
      return;
    }

    if (!title || !description || !images || images.length === 0) {
      setError("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    Array.from(images).forEach((image) => {
      formData.append("images", image);
    });

    try {
      const res = await fetch("http://localhost:3001/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to create post");
      }

      router.push("/admin/posts");
    } catch (err) {
      console.error(err);
      setError("Something went wrong while creating the post");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h1>Create New Post</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ width: "100%" }}
          ></textarea>
        </div>
        <div>
          <label>Images:</label>
          <input
            type="file"
            multiple
            onChange={(e) => setImages(e.target.files)}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: "10px" }}>
          Create Post
        </button>
      </form>
    </div>
  );
}
