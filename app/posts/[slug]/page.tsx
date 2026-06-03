import { getPostBySlug, getAllPostSlugs, getSortedPosts } from "@/lib/posts";
import { getCategory } from "@/lib/categories";
import { notFound } from "next/navigation";
import Link from "next/link";
import TableOfContents from "@/components/toc";
import FloatingToc from "@/components/floating-toc";
import ReadingProgress from "@/components/reading-progress";
import CodeCopy from "@/components/code-copy";
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

  const allPosts = getSortedPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  const cat = getCategory(post.category);
  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <>
      <ReadingProgress />
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

          {/* 上一篇 / 下一篇 */}
          <nav className="mt-16 grid grid-cols-2 gap-4 border-t border-zinc-200 pt-8 dark:border-zinc-800">
            {prevPost ? (
              <Link
                href={`/posts/${prevPost.slug}`}
                className="group rounded-lg border border-zinc-200/60 p-4 transition-colors hover:border-zinc-300 dark:border-zinc-800/60 dark:hover:border-zinc-700"
              >
                <span className="text-xs text-zinc-400 dark:text-zinc-500">
                  ← 上一篇
                </span>
                <p className="mt-1 text-sm font-medium text-zinc-700 group-hover:text-zinc-900 dark:text-zinc-300 dark:group-hover:text-zinc-100">
                  {prevPost.title}
                </p>
              </Link>
            ) : (
              <div />
            )}
            {nextPost ? (
              <Link
                href={`/posts/${nextPost.slug}`}
                className="group rounded-lg border border-zinc-200/60 p-4 text-right transition-colors hover:border-zinc-300 dark:border-zinc-800/60 dark:hover:border-zinc-700"
              >
                <span className="text-xs text-zinc-400 dark:text-zinc-500">
                  下一篇 →
                </span>
                <p className="mt-1 text-sm font-medium text-zinc-700 group-hover:text-zinc-900 dark:text-zinc-300 dark:group-hover:text-zinc-100">
                  {nextPost.title}
                </p>
              </Link>
            ) : (
              <div />
            )}
          </nav>
        </article>
        <TableOfContents />
        <FloatingToc />
      </div>
      <CodeCopy />
    </>
  );
}
