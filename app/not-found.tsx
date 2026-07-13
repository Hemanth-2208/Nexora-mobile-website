import Link from "next/link";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalNotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 select-none">
      <div className="flex flex-col items-center justify-center text-center p-10 md:p-16 bg-zinc-50/40 dark:bg-zinc-900/10 border border-zinc-150 dark:border-zinc-850 rounded-3xl max-w-md mx-auto shadow-sm">
        <div className="size-14 rounded-full bg-zinc-100 dark:bg-zinc-900/60 flex items-center justify-center mb-6 text-zinc-550 border border-zinc-200/50 dark:border-zinc-800">
          <HelpCircle className="size-7 stroke-[1.8]" />
        </div>
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          Page Not Found
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-455 max-w-xs mb-8 leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Button
          asChild
          className="bg-zinc-950 text-white dark:bg-zinc-50 dark:text-zinc-950 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white dark:hover:text-white rounded-xl py-5 px-5 text-xs font-bold shadow-md cursor-pointer transition-all duration-300 flex items-center gap-2"
        >
          <Link href="/">
            <ArrowLeft className="size-4 shrink-0" />
            <span>Go Back Home</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
