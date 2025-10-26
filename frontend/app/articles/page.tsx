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

export default async function ArticlesPage() {
  const res = await apiGet("/posts");

  if (!res.ok) {
    throw new Error("Failed to load articles");
  }

  const posts: Post[] = await res.json();

  return (
    <section className="mt-10 w-full min-h-screen bg-white text-gray-800 px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Articles</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/articles/${post.id}`}
            className="block rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 bg-gray-50"
          >
            {post.imageUrl && (
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
        ))}
      </div>
    </section>
  );
}
