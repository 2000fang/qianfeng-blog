"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("article h2, article h3")
    );
    const items: TocItem[] = elements.map((el) => ({
      id: el.id,
      text: el.textContent || "",
      level: Number(el.tagName.charAt(1)),
    }));
    setHeadings(items);

    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  if (headings.length < 2) return null;

  return (
    <aside className="sticky top-32 hidden w-48 shrink-0 self-start xl:block">
      <h4 className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
        目录
      </h4>
      <ul className="space-y-1 border-l border-zinc-200 dark:border-zinc-800">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? "pl-4" : ""}>
            <a
              href={`#${h.id}`}
              className={`block truncate py-0.5 text-sm transition-colors ${
                activeId === h.id
                  ? "border-l-2 -ml-px border-zinc-900 pl-3 font-medium text-zinc-900 dark:border-zinc-100 dark:text-zinc-100"
                  : "border-l-2 -ml-px border-transparent pl-3 text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
