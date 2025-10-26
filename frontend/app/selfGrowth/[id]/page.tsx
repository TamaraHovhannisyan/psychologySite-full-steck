import Image from "next/image";
import { apiGet } from "@/app/lib/api";

interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  imageUrl: string | null;
}

export default async function SelfGrowthArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const res = await apiGet(`/posts/${params.id}`);

  if (!res.ok) {
    console.error("❌ Failed to load article:", res.statusText);
    throw new Error("Failed to fetch article");
  }

  const post: Post = await res.json();

  const imageSrc = post.imageUrl
    ? post.imageUrl.startsWith("http")
      ? post.imageUrl
      : `http://localhost:3009${
          post.imageUrl.startsWith("/") ? "" : "/"
        }${post.imageUrl}`
    : null;

  return (
    <article className="max-w-3xl mx-auto px-6 py-12 text-gray-800 flex flex-col gap-8">
      <div>
        <h1 className="text-4xl font-bold mb-3 leading-tight">{post.title}</h1>
        <p className="text-[#017187] mb-6 font-medium">#{post.category}</p>

        <div className="text-lg leading-8 whitespace-pre-line text-gray-700">
          {post.content}
        </div>
      </div>

      {imageSrc && (
        <div className="w-full flex justify-center mt-4">
          <div
            className="
              relative
              w-full max-w-2xl
              rounded-3xl
              overflow-hidden
              shadow-[0_8px_30px_rgba(0,0,0,0.08)]
              border border-gray-100
              hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]
              transition-all duration-300 ease-in-out
            "
          >
            <Image
              src={imageSrc}
              alt={post.title}
              width={800}
              height={600}
              className="object-contain w-full h-auto bg-white"
              unoptimized
              priority
            />
          </div>
        </div>
      )}
    </article>
  );
}
