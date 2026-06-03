"use client";

import { useEffect, useState } from "react";
import type { Post } from "@/lib/posts";

interface TimeMarker {
  label: string;
  count: number;
  id: string;
}

export default function Timeline({ posts }: { posts: Post[] }) {
  const [markers, setMarkers] = useState<TimeMarker[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    // 按年月分组
    const grouped = new Map<string, number>();
    posts.forEach((post) => {
      if (!post.date) return;
      const d = new Date(post.date);
      const key = `${d.getFullYear()}年${d.getMonth() + 1}月`;
      grouped.set(key, (grouped.get(key) || 0) + 1);
    });

    const items: TimeMarker[] = Array.from(grouped.entries()).map(
      ([label, count]) => ({
        label,
        count,
        id: `time-${label}`,
      })
    );
    setMarkers(items);
    if (items.length > 0) setActiveId(items[0].id);
  }, [posts]);

  if (markers.length < 2) return null;

  return (
    <aside className="sticky top-32 hidden w-44 shrink-0 self-start xl:block">
      <h4 className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
        时间线
      </h4>
      <ul className="relative space-y-0 border-l border-zinc-200 dark:border-zinc-800">
        {markers.map((m, i) => {
          const isActive = m.id === activeId;
          const isLast = i === markers.length - 1;
          return (
            <li key={m.id} className="relative">
              <button
                onClick={() => setActiveId(m.id)}
                className={`block w-full py-1.5 pl-4 text-left text-sm transition-colors ${
                  isActive
                    ? "border-l-2 -ml-px border-zinc-900 font-medium text-zinc-900 dark:border-zinc-100 dark:text-zinc-100"
                    : "border-l-2 -ml-px border-transparent text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{m.label}</span>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500">
                    {m.count}
                  </span>
                </div>
              </button>
              {/* 时间点 */}
              <span
                className={`absolute left-0 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 ${
                  isActive
                    ? "border-zinc-900 bg-white dark:border-zinc-100 dark:bg-zinc-950"
                    : "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-950"
                }`}
              />
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
