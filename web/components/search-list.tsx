import Image from "next/image";
import Link from "next/link";
import { Cafe, Category, Menu } from "@/types";

type MenusWithCafeAndCategories = Menu & {
  cafes: Cafe;
  categories: Category;
};

interface Props {
  menu: MenusWithCafeAndCategories;
}

export function SearchList({ menu }: Props) {
  return (
    <li>
      <Link
        scroll={false}
        href={`/menus/${menu.id}`}
        className="p-4 md:p-8 flex items-center gap-4 rounded bg-custom-100 hover:bg-custom-200 duration-300 cursor-pointer"
      >
        <Image
          src={menu.cafes.logo_url}
          height={128}
          width={128}
          priority
          alt={menu.cafes.name_kor}
          className="w-16 h-16 object-contain md:w-24 md:h-24"
        />
        <hgroup>
          <h4 className="md:text-2xl font-bold">{menu.name_kor}</h4>
          <h5 className="text-xs md:text-base text-muted-foreground font-medium">
            {menu.name_eng}
          </h5>
          <div className="mt-1 p-1 px-1.5 md:px-2 w-fit text-[8px] md:text-xs font-semibold rounded-full bg-custom-700 text-custom-100">
            {menu.categories.name}
          </div>
        </hgroup>
      </Link>
    </li>
  );
}
