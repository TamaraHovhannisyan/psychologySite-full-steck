import { apiGet } from "@/app/lib/api";
import Image from "next/image";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await apiGet(`/posts/${id}`);

  if (!res.ok) {
    console.error("❌ Failed to load article:", res.statusText);
    throw new Error("Failed to fetch article");
  }

  const post = await res.json();

  const imageSrc = post.imageUrl
    ? post.imageUrl.startsWith("http")
      ? post.imageUrl
      : `http://localhost:3009${
          post.imageUrl.startsWith("/") ? "" : "/"
        }${post.imageUrl}`
    : null;

  return (
    <main className="mt-10 max-w-4xl mx-auto py-12 px-6 text-gray-800 flex flex-col gap-8">
      <div>
        <h1 className="text-4xl font-bold mb-4 leading-tight">{post.title}</h1>
        <p className="text-[#017187] mb-6 font-medium">#{post.category}</p>
        <p className="text-lg leading-8 whitespace-pre-line text-gray-700">
          {post.content}
        </p>
      </div>

      {imageSrc && (
        <div className="w-full flex justify-center mt-4">
          <div
            className="
              relative
              w-full max-w-3xl
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
              width={1000}
              height={700}
              className="object-contain w-full h-auto bg-white"
              unoptimized
              priority
            />
          </div>
        </div>
      )}
    </main>
  );
}
