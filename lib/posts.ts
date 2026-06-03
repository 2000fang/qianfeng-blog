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

// 递归获取所有 .md 文件（支持子目录分类）
function getAllMdFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith("_") || entry.name.startsWith(".")) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllMdFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(fullPath);
    }
  }

  return files;
}

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
  const filePaths = getAllMdFiles(postsDirectory);
  const allPosts = filePaths.map((fullPath) => {
      const fileName = path.basename(fullPath);
      const slug = fileName.replace(/\.md$/, "");
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
  return getAllMdFiles(postsDirectory)
    .map((fullPath) => ({ slug: path.basename(fullPath).replace(/\.md$/, "") }));
}

export function findPostFile(slug: string): string | null {
  const allFiles = getAllMdFiles(postsDirectory);
  return allFiles.find((f) => path.basename(f) === `${slug}.md`) || null;
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
  const filePath = findPostFile(slug);
  if (filePath) {
    return readPostFile(filePath, slug);
  }

  // 尝试 URL 解码后再匹配
  const decodedSlug = decodeURIComponent(slug);
  const matchPath = getAllMdFiles(postsDirectory).find((f) => {
    const s = path.basename(f).replace(/\.md$/, "");
    return s === decodedSlug || s === slug;
  });

  if (matchPath) {
    return readPostFile(matchPath, path.basename(matchPath).replace(/\.md$/, ""));
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
