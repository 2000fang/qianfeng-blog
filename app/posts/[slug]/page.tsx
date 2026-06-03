import { getPostBySlug, getAllPostSlugs } from "@/lib/posts";
import { getCategory } from "@/lib/categories";
import { notFound } from "next/navigation";
import Link from "next/link";
import TableOfContents from "@/components/toc";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPostSlugs();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "未找到" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const cat = getCategory(post.category);
  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="mx-auto flex max-w-6xl justify-center gap-10 px-6 py-16">
      <article className="w-full max-w-3xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
        >
          ← 返回首页
        </Link>

        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
            {cat && (
              <Link
                href={`/category/${cat.key}`}
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${cat.bg} ${cat.text}`}
              >
                {cat.emoji} {cat.label}
              </Link>
            )}
            {formattedDate && (
              <time dateTime={post.date}>{formattedDate}</time>
            )}
            <span>· 阅读 {post.readingTime} min</span>
            {post.tags.length > 0 && (
              <div className="flex gap-1.5">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${tag}`}
                    className="text-xs text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </header>

        <div
          className="prose prose-zinc max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:scroll-mt-24 prose-a:text-zinc-900 prose-a:underline prose-a:underline-offset-4 dark:prose-a:text-zinc-100 prose-pre:rounded-lg prose-pre:bg-zinc-900 prose-pre:text-sm dark:prose-pre:bg-zinc-800"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
      <TableOfContents />
    </div>
  );
}
