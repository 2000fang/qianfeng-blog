export type Category = "reading" | "thoughts" | "work" | "project";

export interface CategoryInfo {
  key: Category;
  label: string;
  emoji: string;
  color: string;
  bg: string;
  text: string;
}

export const categories: Record<Category, CategoryInfo> = {
  reading: {
    key: "reading",
    label: "读书心得",
    emoji: "📚",
    color: "amber",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-700 dark:text-amber-400",
  },
  thoughts: {
    key: "thoughts",
    label: "个人感悟",
    emoji: "💭",
    color: "rose",
    bg: "bg-rose-50 dark:bg-rose-950/30",
    text: "text-rose-700 dark:text-rose-400",
  },
  work: {
    key: "work",
    label: "工作思考",
    emoji: "💼",
    color: "violet",
    bg: "bg-violet-50 dark:bg-violet-950/30",
    text: "text-violet-700 dark:text-violet-400",
  },
  project: {
    key: "project",
    label: "项目实践",
    emoji: "🛠️",
    color: "emerald",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    text: "text-emerald-700 dark:text-emerald-400",
  },
};

export const categoryList = Object.values(categories);

export function getCategory(key: string): CategoryInfo | undefined {
  return categories[key as Category];
}
