import Image from "next/image";
import Link from "next/link";

type Post = {
  id: string;
  title: string;
  slug?: string | null;
  image?: string | null;
  content?: string | null;
  category: string;
  createdAt: string;
};

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3009"
).replace(/\/$/, "");

function resolveImageUrl(image?: string | null) {
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return image;
  return `${API_BASE}${image.startsWith("/") ? image : `/${image}`}`;
}

async function getPosts(): Promise<Post[]> {
  const res = await fetch(`${API_BASE}/posts?category=self-growth`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data?.items) ? data.items : [];
}

export default async function SelfGrowthPage() {
  const posts = await getPosts();

  return (
    <section className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold">Self-growth</h1>

      {posts.length === 0 ? (
        <p className="text-gray-600">There are no materials yet.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {posts.map((p) => {
            const href = p.slug ? `/selfGrowth/${p.slug}` : "#";
            return (
              <li key={p.id}>
                <Link
                  href={href}
                  className="block rounded-xl border p-4 bg-white hover:shadow transition"
                >
                  {p.image && (
                    <div className="relative w-full h-52 bg-gray-100 flex items-center justify-center overflow-hidden rounded-xl">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}`}
                        alt={p.title}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  )}
                  <h3 className="font-semibold text-lg">{p.title}</h3>
                  <p className="text-xs text-gray-500 mb-2">
                    {new Date(p.createdAt).toLocaleDateString("hy-AM")}
                  </p>
                  {p.content && (
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {p.content}
                    </p>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
