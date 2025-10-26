import Image from "next/image";
import Link from "next/link";
import { apiGet } from "@/app/lib/api";

interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  imageUrl: string | null;
}

export default async function PsychologyPage() {
  const res = await apiGet("/posts?category=psychology");

  if (!res.ok) {
    console.error("Failed to load psychology posts:", res.statusText);
    throw new Error("Failed to fetch psychology posts");
  }

  const posts: Post[] = await res.json();

  return (
    <section className="mt-10 w-full min-h-screen bg-white text-gray-800 px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Psychology</h1>

      {posts.length === 0 && (
        <p className="text-center text-gray-500">No posts found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => {
          const imageSrc = post.imageUrl
            ? post.imageUrl.startsWith("http")
              ? post.imageUrl
              : `http://localhost:3009${
                  post.imageUrl.startsWith("/") ? "" : "/"
                }${post.imageUrl}`
            : null;

          return (
            <Link
              key={post.id}
              href={`/psychology/${post.id}`}
              className="block rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 bg-gray-50"
            >
              {imageSrc && (
                <div className="relative w-full h-52 bg-gray-100 flex items-center justify-center overflow-hidden rounded-xl">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}${post.imageUrl}`}
                    alt={post.title}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              )}

              <div className="p-5">
                <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {post.content}
                </p>
                <div className="mt-3 text-sm text-[#017187] font-medium">
                  #{post.category}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
