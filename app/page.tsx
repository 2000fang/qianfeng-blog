import Link from "next/link";
import { getSortedPosts } from "@/lib/posts";
import { categoryList } from "@/lib/categories";
import PostList from "@/components/post-list";

export default function Home() {
  const posts = getSortedPosts();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      {/* 个人介绍 */}
      <section className="mb-16">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          你好，欢迎来到我的博客 
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
          用文字记录技术探索、项目实践、读书心得与工作思考。让每一个想法都有迹可循。
        </p>
      </section>

      {/* 分类导航 - 简洁横排 */}
      <section className="mb-16">
        <div className="flex flex-wrap gap-2">
          {categoryList.map((cat) => {
            const count = posts.filter((p) => p.category === cat.key).length;
            return (
              <Link
                key={cat.key}
                href={`/category/${cat.key}`}
                className={`inline-flex items-center gap-1.5 rounded-full border border-zinc-200/60 px-4 py-2 text-sm transition-all hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800/60 dark:hover:border-zinc-700 ${count > 0 ? cat.bg : ""}`}
              >
                <span className="text-base">{cat.emoji}</span>
                <span className={`${count > 0 ? cat.text : "text-zinc-400 dark:text-zinc-500"}`}>
                  {cat.label}
                </span>
                <span className="ml-0.5 text-xs text-zinc-400 dark:text-zinc-500">
                  {count}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 文章列表 */}
      <section>
        <h2 className="mb-8 text-sm font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          最新文章
        </h2>
        {posts.length === 0 ? (
          <p className="py-12 text-center text-zinc-400 dark:text-zinc-500">
            还没有文章，在 posts/ 目录下添加 .md 文件吧 ✨
          </p>
        ) : (
          <PostList posts={posts} />
        )}
      </section>
    </div>
  );
}
