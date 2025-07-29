"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [images, setImages] = useState<FileList | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin");
      return;
    }

    fetch(`http://localhost:3001/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch post");
        const data = await res.json();
        setTitle(data.title);
        setDescription(data.description);
        if (data.images) {
          const urls = data.images.map((img: any) => img.url);
          setExistingImages(urls);
        }
      })
      .catch(() => {
        setError("Failed to load post data");
      });
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    if (images && images.length > 0) {
      Array.from(images).forEach((image) => {
        formData.append("images", image);
      });
    }

    try {
      const res = await fetch(`http://localhost:3001/posts/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to update post");
      }

      router.push("/admin/posts");
    } catch (err) {
      setError("Error updating post");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h1>Edit Post</h1>
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
        {existingImages.length > 0 && (
          <div>
            <p>Existing Images:</p>
            {existingImages.map((url, index) => (
              <img
                key={index}
                src={`http://localhost:3001/uploads/${url}`}
                alt={`Image ${index}`}
                style={{ maxWidth: "100%", marginBottom: "10px" }}
              />
            ))}
          </div>
        )}
        <div>
          <label>Add New Images (optional):</label>
          <input
            type="file"
            multiple
            onChange={(e) => setImages(e.target.files)}
          />
        </div>
        <button type="submit" style={{ marginTop: "10px" }}>
          Update Post
        </button>
      </form>
    </div>
  );
}
