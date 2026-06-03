import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于",
  description: "关于 qianfeng 和他的博客",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        关于我
      </h1>

      <div className="mt-8 space-y-6 text-zinc-600 leading-relaxed dark:text-zinc-400">
        <p>
          你好，我是 qianfeng。一名热爱技术、热爱生活的开发者。
        </p>
        <p>
          这个博客是我个人的数字花园 🌱，用来记录日常工作中的技术思考、生活中的有趣片段，
          以及学习新知识过程中的心得与总结。
        </p>
        <p>
          我相信写作是最好的思考方式。把想法写下来，不仅能加深理解，
          还能在未来的某一天回顾时，看到自己的成长轨迹。
        </p>

        <h2 className="mt-10 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          关于这个博客
        </h2>
        <p>
          博客使用 Next.js 构建，部署在 Vercel 上。设计风格追求简洁易读，
          让文字本身成为焦点。所有文章以 Markdown 格式编写，存放在 posts/
          目录下。
        </p>
        <p>
          如果你对我的文章有任何想法或建议，欢迎通过邮件或社交媒体联系我，
          一起交流讨论 🤝
        </p>
      </div>
    </div>
  );
}
