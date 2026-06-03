"use client";

import { useEffect, useState, useRef } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function FloatingToc() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState("");
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

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

  // 点击外部关闭
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  // 点击链接后关闭
  const handleClick = (id: string) => {
    setActiveId(id);
    setOpen(false);
  };

  if (headings.length < 2) return null;

  return (
    <>
      {/* 浮动按钮 */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border shadow-sm backdrop-blur transition-all ${
          open
            ? "bottom-6 border-zinc-300 bg-zinc-900 text-white dark:border-zinc-600 dark:bg-zinc-100 dark:text-zinc-900"
            : "bottom-20 border-zinc-200/80 bg-white/90 text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 dark:border-zinc-700/80 dark:bg-zinc-900/90 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-200"
        }`}
        aria-label="目录"
      >
        {open ? (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        )}
      </button>

      {/* 展开面板 */}
      {open && (
        <div
          ref={panelRef}
          className="fixed bottom-28 right-6 z-50 w-56 rounded-xl border border-zinc-200/80 bg-white/95 p-4 shadow-lg backdrop-blur dark:border-zinc-700/80 dark:bg-zinc-900/95"
        >
          <h4 className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            目录
          </h4>
          <ul className="max-h-60 space-y-0.5 overflow-y-auto border-l border-zinc-200 dark:border-zinc-800">
            {headings.map((h) => (
              <li key={h.id} className={h.level === 3 ? "pl-3" : ""}>
                <a
                  href={`#${h.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleClick(h.id);
                    document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`block truncate py-1 text-sm transition-colors ${
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
        </div>
      )}
    </>
  );
}
