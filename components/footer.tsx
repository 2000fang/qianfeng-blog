export default function Footer() {
  return (
    <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80">
      <div className="mx-auto max-w-3xl px-6 py-8 text-center text-sm text-zinc-400 dark:text-zinc-500">
        <p>© {new Date().getFullYear()} Qianfeng</p>
      </div>
    </footer>
  );
}
