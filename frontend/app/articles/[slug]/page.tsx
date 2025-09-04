import { notFound } from "next/navigation";

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

async function getPost(slug: string): Promise<Post | null> {
  const res = await fetch(
    `${API_BASE}/posts/slug/${encodeURIComponent(slug)}`,
    {
      cache: "no-store",
    }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug).catch(() => null);
  return {
    title: post?.title ?? "Հոդված",
    description: post?.content?.slice(0, 160) ?? "Հոդված",
  };
}

export default async function ArticleBySlug({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);
  if (!post || post.category !== "articles") return notFound();

  return (
    <section className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="text-sm text-gray-500">
        {new Date(post.createdAt).toLocaleDateString("hy-AM")}
      </p>

      {post.image && (
        <img
          src={resolveImageUrl(post.image)}
          alt=""
          className="rounded-xl border w-full object-cover"
        />
      )}

      {post.content && (
        <article className="prose max-w-none">{post.content}</article>
      )}
    </section>
  );
}
