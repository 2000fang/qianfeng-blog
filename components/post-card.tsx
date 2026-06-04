import Link from "next/link";
import type { Post } from "@/lib/posts";
import { getCategory } from "@/lib/categories";

export default function PostCard({ post }: { post: Post }) {
  const cat = getCategory(post.category);
  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group block rounded-xl border border-zinc-200/60 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800/60 dark:bg-zinc-900 dark:hover:border-zinc-700"
    >
      <div className="mb-3 flex items-center gap-3">
        {cat && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${cat.bg} ${cat.text}`}
          >
            {cat.emoji} {cat.label}
          </span>
        )}
        <span className="text-xs text-zinc-400 dark:text-zinc-500">
          {post.readingTime} min 阅读
        </span>
      </div>
      <h2 className="text-xl font-semibold text-zinc-900 transition-colors group-hover:text-zinc-600 dark:text-zinc-100 dark:group-hover:text-zinc-300">
        {post.title}
      </h2>
      {post.excerpt && (
        <p className="mt-2 line-clamp-2 text-zinc-600 dark:text-zinc-400">
          {post.excerpt}
        </p>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-zinc-400 dark:text-zinc-500">
        {formattedDate && <time dateTime={post.date}>{formattedDate}</time>}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-zinc-400 dark:text-zinc-500"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
