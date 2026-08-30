"use client";

import { Category } from "@/types";
import { useState, useEffect } from "react";
import { CategoryChip } from "./category-chip";

interface Props {
  curCategoryId: string | null;
  cafeId: string;
  categories: Category[];
}

export function CategoryScroll({ curCategoryId, cafeId, categories }: Props) {
  const [isTopnavVisible, setIsTopnavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setIsTopnavVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }

      if (currentScrollY > lastScrollY) {
        setIsTopnavVisible(false); // Topnav 숨겨짐 -> 카테고리는 top-0으로 가야함
      } else {
        setIsTopnavVisible(true); // Topnav 보임 -> 카테고리는 top-16으로 가야함
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <section
      className={`sticky ${isTopnavVisible ? "top-16" : "top-0 md:top-16"} duration-300 bg-background border-b`}
    >
      <div className="py-2 md:py-4 px-4 md:px-8 mx-auto max-w-5xl">
        <ul
          className={`flex md:flex-wrap gap-2 overflow-x-auto no-scrollbar touch-pan-x md:overflow-visible`}
        >
          <CategoryChip
            isCurrent={curCategoryId == null}
            href={`/cafes/${cafeId}`}
            name="전체"
          />
          {categories.map((item) => (
            <CategoryChip
              key={`category-${item.id}`}
              name={item.name}
              href={`/cafes/${cafeId}?category=${item.id}`}
              isCurrent={
                curCategoryId !== null && Number(curCategoryId) === item.id
              }
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
