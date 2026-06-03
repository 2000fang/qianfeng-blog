import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostsByCategory } from "@/lib/posts";
import { getCategory, categoryList } from "@/lib/categories";
import PostCard from "@/components/post-card";
import Timeline from "@/components/timeline";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return categoryList.map((c) => ({ category: c.key }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return { title: "未找到" };
  return {
    title: `${cat.emoji} ${cat.label}`,
    description: `${cat.label}相关的文章`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = getCategory(category);

  if (!cat) notFound();

  const posts = getPostsByCategory(category);

  return (
    <div className="mx-auto flex max-w-6xl justify-center gap-10 px-6 py-16">
      <div className="w-full max-w-3xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
        >
          ← 返回首页
        </Link>

        <header className="mb-12">
          <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </h1>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            共 {posts.length} 篇文章
          </p>
        </header>

        {posts.length === 0 ? (
          <p className="py-12 text-center text-zinc-400 dark:text-zinc-500">
            这个分类下还没有文章
          </p>
        ) : (
          <div className="grid gap-4">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
      <Timeline posts={posts} />
    </div>
  );
}
