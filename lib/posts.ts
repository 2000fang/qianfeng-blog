import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import type { Category } from "./categories";

const postsDirectory = path.join(process.cwd(), "posts");

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  category: Category;
  tags: string[];
  content: string;
  readingTime: number;
}

function getReadingTime(text: string): number {
  const wordsPerMinute = 300;
  const chars = text.replace(/\s/g, "").length;
  return Math.max(1, Math.ceil(chars / wordsPerMinute));
}

export function getSortedPosts(): Post[] {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPosts = fileNames
    .filter((fileName) => fileName.endsWith(".md") && !fileName.startsWith("_"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || slug,
        date: data.date || "",
        excerpt: data.excerpt || "",
        category: data.category || "thoughts",
        tags: data.tags || [],
        content,
        readingTime: getReadingTime(content),
      } as Post;
    });

  return allPosts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getAllPostSlugs() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith(".md") && !fileName.startsWith("_"))
    .map((fileName) => ({ slug: fileName.replace(/\.md$/, "") }));
}

export function findPostFile(slug: string): string | null {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.find((name) => name === `${slug}.md`) || null;
}

async function readPostFile(fullPath: string, slug: string): Promise<Post> {
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const processedContent = await remark()
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeHighlight)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    title: data.title || slug,
    date: data.date || "",
    excerpt: data.excerpt || "",
    category: data.category || "thoughts",
    tags: data.tags || [],
    content: contentHtml,
    readingTime: getReadingTime(content),
  };
}

export async function getPostBySlug(slug: string): Promise<Post> {
  // 通过遍历目录找到真实文件名，避免中文编码问题
  const fileName = findPostFile(slug);
  if (fileName) {
    const fullPath = path.join(postsDirectory, fileName);
    return readPostFile(fullPath, slug);
  }

  // 尝试 URL 解码后再匹配
  const decodedSlug = decodeURIComponent(slug);
  const matchName = fs.readdirSync(postsDirectory).find((name) => {
    const s = name.replace(/\.md$/, "");
    return s === decodedSlug || s === slug;
  });

  if (matchName) {
    const fullPath = path.join(postsDirectory, matchName);
    return readPostFile(fullPath, matchName.replace(/\.md$/, ""));
  }

  throw new Error(`文章不存在: ${slug}`);
}

export function getPostsByTag(tag: string): Post[] {
  return getSortedPosts().filter((post) => post.tags.includes(tag));
}

export function getPostsByCategory(category: string): Post[] {
  return getSortedPosts().filter((post) => post.category === category);
}

export function getAllTags(): { tag: string; count: number }[] {
  const posts = getSortedPosts();
  const tagMap = new Map<string, number>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    });
  });

  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}
