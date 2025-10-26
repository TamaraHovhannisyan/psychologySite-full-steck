import { CircleArrowRight } from "lucide-react";
import Link from "next/link";
import { apiGet } from "@/app/lib/api";

export const metadata = {
  title: "Psychology | MentalWeb",
  description:
    "Explore psychology articles to help you understand yourself, manage fears, and build emotional stability.",
};

interface Post {
  id: number;
  title: string;
  subtitle?: string;
  articleText1?: string;
  category: string;
  imageUrl?: string | null;
}

export default async function PsychologyPreview() {
  const res = await apiGet("/posts?category=psychology");

  if (!res.ok) {
    console.error("Failed to fetch psychology posts");
    return <p className="text-center text-gray-500">Failed to load posts.</p>;
  }

  const allPosts: Post[] = await res.json();
  const posts = allPosts.slice(-3).reverse();

  return (
    <section className="w-full flex flex-col items-center mx-auto px-4 sm:px-6 lg:px-8 py-14 bg-white text-[#404040]">
      <div className="w-full my-10 border-[#017187] border-2" />

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
        Psychology
      </h1>

      <p className="text-base sm:text-lg text-center text-gray-600 max-w-2xl mx-auto mb-12">
        Discover the depths of the human mind — fears, subconscious patterns,
        and ways of thinking. Find scientifically grounded articles that help
        you achieve mental balance and self-understanding.
      </p>

      <div className="w-full max-w-7xl grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white border hover:bg-[#CCE3E7] border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-200 flex flex-col h-full"
          >
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
              {post.title}
            </h2>
            <p className="text-gray-600 mb-4 flex-1 line-clamp-3">
              {post.articleText1 || "No description available."}
            </p>

            <Link
              href={`/articles/${post.id}`}
              className="text-[#017187] hover:underline font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#017187] rounded transition"
              aria-label={`Read more about ${post.title}`}
            >
              Read More →
            </Link>
          </div>
        ))}

        <div className="flex justify-center sm:col-span-2 lg:col-span-3 mt-4">
          <Link
            href="/psychology"
            className="bg-[#017187] justify-between flex w-[200px] text-white px-4 py-2 rounded-lg hover:bg-[#015f6c] transition-colors duration-300"
          >
            <p>View More</p>
            <CircleArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
