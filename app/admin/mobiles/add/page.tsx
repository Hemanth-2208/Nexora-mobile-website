import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import MobileForm from "@/components/admin/mobile-form";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Add Mobile | Admin Portal",
  description: "Create a new smartphone listing in the inventory.",
};

export default function AddMobilePage() {
  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto flex flex-col gap-6">
      
      {/* 1. Header & navigation */}
      <section className="flex flex-col gap-2 pb-4 border-b border-zinc-150 dark:border-zinc-850 select-none">
        <div className="flex items-center gap-1">
          <Button
            asChild
            variant="ghost"
            size="xs"
            className="p-1 -ml-1 text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-300 rounded-lg shrink-0 cursor-pointer"
          >
            <Link href="/admin/mobiles" className="flex items-center gap-1 text-xs font-bold">
              <ChevronLeft className="size-4" />
              <span>Back to Mobiles</span>
            </Link>
          </Button>
        </div>

        <div className="flex flex-col">
          <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight mb-1">
            Add New Mobile
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium font-sans">
            Add a new smartphone with specifications and pricing indexes to the storefront.
          </p>
        </div>
      </section>

      {/* 2. Admin Form Panel */}
      <section className="mt-2">
        <MobileForm />
      </section>

    </div>
  );
}
