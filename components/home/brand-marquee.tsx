'use client';

import Link from "next/link";
import Image from "next/image";
import { Award } from "lucide-react";

const brands = [
  { name: "Apple", slug: "apple", logo: "/brands/apple.svg" },
  { name: "Samsung", slug: "samsung", logo: "/brands/samsung.svg" },
  { name: "OnePlus", slug: "oneplus", logo: "/brands/oneplus.svg" },
  { name: "Google Pixel", slug: "google", logo: "/brands/google.svg" },
  { name: "Xiaomi", slug: "xiaomi", logo: "/brands/xiaomi.svg" },
  { name: "Nothing", slug: "nothing", logo: "/brands/nothing.svg" },
  { name: "Motorola", slug: "motorola", logo: "/brands/motorola.svg" },
  { name: "Vivo", slug: "vivo", logo: "/brands/vivo.svg" },
  { name: "Oppo", slug: "oppo", logo: "/brands/oppo.svg" },
  { name: "Realme", slug: "realme", logo: "/brands/realme.svg" },
  { name: "Honor", slug: "honor", logo: "/brands/honor.svg" },
  { name: "IQOO", slug: "iqoo", logo: "/brands/iqoo.svg" },
];

export default function BrandMarquee() {
  // Duplicate array three times to guarantee seamless scrolling on wide desktop screens
  const marqueeItems = [...brands, ...brands, ...brands];

  return (
    <section className="bg-white dark:bg-zinc-950 py-16 lg:py-24 border-t border-zinc-100 dark:border-zinc-900 relative overflow-hidden select-none">
      
      {/* Inline styles for performance marquee loop */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marqueeScroll {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-33.333%, 0, 0);
          }
        }
        .animate-marquee-container {
          display: flex;
          width: max-content;
          animation: marqueeScroll 45s linear infinite;
        }
        .animate-marquee-container:hover {
          animation-play-state: paused;
        }
      `}} />

      <div className="container mx-auto px-4 md:px-8 mb-12 flex flex-col items-center text-center">
        {/* Section Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 text-[10px] font-bold text-zinc-600 dark:text-zinc-400 mb-4 uppercase tracking-wider">
          <Award className="size-3 text-blue-600" />
          <span>Trusted Brands</span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 mb-4">
          Choose Your Favorite Brand
        </h2>

        {/* Description */}
        <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-xl">
          We bring together the world&apos;s leading smartphone brands in one premium shopping experience.
        </p>
      </div>

      {/* Marquee Track Wrapper */}
      <div className="relative w-full overflow-hidden py-4">
        {/* Soft edge fade masks */}
        <div className="absolute top-0 left-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-white dark:from-zinc-950 to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 right-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-white dark:from-zinc-950 to-transparent z-20 pointer-events-none" />

        {/* Marquee Inner Scroller */}
        <div className="animate-marquee-container gap-5 px-4">
          {marqueeItems.map((brand, idx) => (
            <Link
              key={`${brand.slug}-${idx}`}
              href={`/mobiles?brand=${brand.name}`}
              className="group block outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-2xl"
              aria-label={`View mobiles from ${brand.name}`}
            >
              <div className="w-32 sm:w-40 md:w-44 h-20 sm:h-24 md:h-28 flex items-center justify-center bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] dark:shadow-none hover:shadow-md hover:border-zinc-200 dark:hover:border-zinc-700 hover:-translate-y-1.5 transition-all duration-300 ease-out">
                <div className="relative w-20 sm:w-24 md:w-28 h-8 sm:h-10 md:h-12 flex items-center justify-center text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors duration-300">
                  <Image
                    src={brand.logo}
                    alt={`${brand.name} brand logo`}
                    fill
                    className="object-contain p-1 filter dark:invert opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                    loading="lazy"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
