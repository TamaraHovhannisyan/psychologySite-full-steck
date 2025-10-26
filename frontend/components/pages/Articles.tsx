"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CircleArrowRight } from "lucide-react";
import { apiGet } from "@/app/lib/api";

interface Article {
  id: number;
  title: string;
  content: string;
  category: string;
  imageUrl: string | null;
}

const Articles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await apiGet("/posts");
        if (!res.ok) throw new Error("Failed to load articles");
        const data: Article[] = await res.json();
        setArticles(data.slice(0, 6));
      } catch (error) {
        console.error(" Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading...</div>;
  }

  return (
    <div className="w-full bg-white text-[#404040] bg-cover bg-center mt-8 py-10">
      <div className="max-w-6xl flex flex-col items-center gap-15 mx-auto px-4">
        <h3 className="text-3xl font-bold mb-8 text-center">Latest articles</h3>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 place-items-center">
          {articles.map((item) => {
            const imageSrc = item.imageUrl
              ? `${process.env.NEXT_PUBLIC_API_URL}${item.imageUrl}`
              : "https://via.placeholder.com/400x300?text=No+Image";

            return (
              <Link
                key={item.id}
                href={`/articles/${item.id}`}
                className="bg-[#CCE3E7] w-full max-w-xs rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative w-full h-52 bg-gray-100 flex items-center justify-center overflow-hidden rounded-xl">
                  <Image
                    src={imageSrc}
                    alt={item.title}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>

                <div className="p-4 flex flex-col justify-between h-[calc(100%-12rem)]">
                  <div>
                    <h4 className="text-lg font-semibold mb-2 line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {item.content}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-[#017187]">
                    <CircleArrowRight />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <Link
          href="/articles"
          className="bg-[#017187] flex justify-between w-[200px] text-white px-4 py-2 rounded-lg hover:bg-[#015f6c] transition-colors duration-300 mt-8"
        >
          <p>More</p>
          <CircleArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default Articles;
