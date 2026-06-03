import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于",
  description: "关于谦锋 和他的博客",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        关于我
      </h1>

      <div className="mt-8 space-y-5 text-zinc-600 leading-relaxed dark:text-zinc-400">
        <p>
          我是谦锋，一名热爱技术的开发者。
        </p>
        <p>
          这个博客是我的数字花园 🌱，用来记录日常工作中的技术探索、项目实践的踩坑与收获，
          读书后的思考与感悟，以及生活中的有趣碎片。
        </p>
        <p>
          我相信<strong>写作是最好的思考方式</strong>——把模糊的想法变成清晰的文字，
          本身就是一种深度思考。也希望这些记录能给偶然路过的你带来一点启发。
        </p>

        <h2 className="mt-10 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          关于博客
        </h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>使用 Next.js + Tailwind CSS 构建</li>
          <li>部署在 Vercel，全球 CDN 加速</li>
          <li>所有文章用 Markdown 编写，简洁纯粹</li>
          <li>支持暗色模式、代码高亮、文章目录</li>
        </ul>

        <h2 className="mt-10 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          联系我
        </h2>
        <div className="flex flex-wrap gap-4">
          <a
            href="mailto:fangqianfeng0412@163.com"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm transition-colors hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-700 dark:hover:border-zinc-500 dark:hover:text-zinc-100"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            fangqianfeng0412@163.com
          </a>
        </div>
      </div>
    </div>
  );
}
