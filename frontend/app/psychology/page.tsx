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
  const res = await fetch(`${API_BASE}/posts?category=psychology`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data?.items) ? data.items : [];
}

export default async function PsychologyPage() {
  const posts = await getPosts();

  return (
    <section className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold">Հոգեբանություն</h1>

      {posts.length === 0 ? (
        <p className="text-gray-600">Դեռ հոգեբանական նյութեր չկան։</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {posts.map((p) => {
            const href = p.slug ? `/psychology/${p.slug}` : "#";
            return (
              <li key={p.id}>
                <Link
                  href={href}
                  className="block rounded-xl border p-4 bg-white hover:shadow transition"
                >
                  {p.image && (
                    <img
                      src={resolveImageUrl(p.image)}
                      alt=""
                      className="mb-3 h-40 w-full object-cover rounded-lg"
                    />
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
