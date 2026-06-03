"use client";

import { useEffect, useState } from "react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200/80 bg-white/90 shadow-sm backdrop-blur transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-700/80 dark:bg-zinc-900/90 dark:hover:border-zinc-600"
      aria-label="返回顶部"
    >
      <svg className="h-4 w-4 text-zinc-500 dark:text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
}
