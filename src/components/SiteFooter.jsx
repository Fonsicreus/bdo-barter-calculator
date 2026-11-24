import { Anchor, Heart } from "lucide-react";

export function SiteFooter({ description, t = (label) => label }) {
  return (
    <footer className="mt-auto border-t border-slate-200 dark:border-satella-border/60 py-6 bg-white/50 dark:bg-satella-base/50 text-xs text-slate-500 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Anchor
              aria-hidden="true"
              className="w-4 h-4 text-purple-600 dark:text-satella-primary"
            />
            <span>{description}</span>
          </div>

          <div className="flex items-center space-x-1.5 text-xs">
            <span>{t("Crafted with")}</span>
            <Heart
              aria-hidden="true"
              className="w-3.5 h-3.5 text-purple-500 fill-purple-500 inline"
            />
            <span>{t("by")}</span>
            <a
              href="https://github.com/Fonsicreus"
              className="rounded-sm font-semibold text-purple-600 underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-purple-500 dark:text-satella-glow"
            >
              Satella
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
