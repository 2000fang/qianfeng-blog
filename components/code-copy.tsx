"use client";

import { useEffect } from "react";

export default function CodeCopy() {
  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    const pres = article.querySelectorAll<HTMLElement>("pre");
    pres.forEach((pre) => {
      if (pre.querySelector(".copy-btn")) return; // 避免重复

      const wrapper = document.createElement("div");
      wrapper.className = "relative group/code not-prose";
      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      const btn = document.createElement("button");
      btn.className =
        "copy-btn absolute right-3 top-3 z-10 rounded-md border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-xs text-zinc-400 opacity-0 transition-all hover:border-zinc-500 hover:text-zinc-200 group-hover/code:opacity-100";
      btn.textContent = "复制";
      btn.onclick = async () => {
        const code = pre.querySelector("code")?.textContent || pre.textContent || "";
        await navigator.clipboard.writeText(code);
        btn.textContent = "已复制 ✓";
        setTimeout(() => {
          btn.textContent = "复制";
        }, 2000);
      };
      wrapper.appendChild(btn);
    });
  }, []);

  return null;
}
