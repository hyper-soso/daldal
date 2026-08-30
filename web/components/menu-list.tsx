"use client";

import Link from "next/link";
import { Menu } from "@/types";

export function MenuList({ menu }: { menu: Menu }) {
  return (
    <li>
      <Link
        scroll={false}
        href={`/cafes/${menu.cafe_id}/${menu.id}`}
        className="block p-4 md:p-8 h-full rounded bg-custom-100 hover:bg-custom-200 cursor-pointer duration-300"
      >
        <h4 className="md:text-lg font-bold">{menu.name_kor}</h4>
        <p className="mt-0 md:mt-2 text-sm font-medium">
          당분:
          <strong className="ml-2 text-base md:text-lg font-bold text-custom-900">
            {menu.sugars ?? "-"}g
          </strong>
        </p>
      </Link>
    </li>
  );
}
