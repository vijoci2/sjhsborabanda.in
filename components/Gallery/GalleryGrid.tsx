"use client";

import { useMemo, useState } from "react";
import { galleryItems } from "@/lib/data";
import { SmartImage } from "@/components/UI/SmartImage";

const categories = ["All", ...Array.from(new Set(galleryItems.map((item) => item.category)))];

export function GalleryGrid() {
  const [active, setActive] = useState("All");

  const visibleItems = useMemo(() => {
    if (active === "All") {
      return galleryItems;
    }

    return galleryItems.filter((item) => item.category === active);
  }, [active]);

  return (
    <div>
      <div className="mb-8 flex flex-wrap justify-center gap-3">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActive(category)}
            className={`focus-ring rounded-md border px-4 py-2 text-sm font-bold transition ${
              active === category
                ? "border-navy bg-navy text-white"
                : "border-slate-200 bg-white text-navy hover:border-gold hover:text-navy-dark"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visibleItems.map((item) => (
          <article
            key={`${item.title}-${item.category}`}
            className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
          >
            <SmartImage
              src={item.image}
              alt={item.title}
              fallbackLabel={item.title}
              className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">
                {item.category}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-navy">{item.title}</h3>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
