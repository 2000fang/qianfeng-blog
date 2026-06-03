"use client";

import { useEffect, useState } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const article = document.querySelector("article");
      if (!article) return;
      const top = article.getBoundingClientRect().top;
      const height = article.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrolled = Math.max(0, -top);
      const total = height - windowHeight;
      if (total <= 0) {
        setProgress(100);
      } else {
        setProgress(Math.min(100, Math.round((scrolled / total) * 100)));
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 z-[60] h-0.5 w-full">
      <div
        className="h-full bg-zinc-900 transition-[width] duration-150 ease-out dark:bg-zinc-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
