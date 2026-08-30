import Link from "next/link";
import { Cafe, Category, Menu } from "@/types";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import { Metadata } from "next";

type MenuWithCafeAndCategories = Menu & {
  cafes: Cafe;
  categories: Category;
};

interface Props {
  params: Promise<{
    menuId: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { menuId } = await params;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data } = await supabase
    .from("menus")
    .select("*, categories (*), cafes (*)")
    .eq("id", menuId)
    .single();

  const menu = data as MenuWithCafeAndCategories;

  return {
    title: menu.name_kor,
  };
}

export default async function Page({ params }: Props) {
  const { menuId } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data } = await supabase
    .from("menus")
    .select("*, categories (*), cafes (*)")
    .eq("id", menuId)
    .single();

  const menu = data as MenuWithCafeAndCategories;

  return (
    <main className="pt-16 mx-auto max-w-5xl">
      <div className="mt-8 px-4 md:px-8 flex items-center gap-2">
        <Link href={"/cafes"} className="hover:underline underline-offset-2">
          카페
        </Link>
        <span>›</span>
        <Link
          href={`/cafes/${menu.cafes.id}`}
          className="hover:underline underline-offset-2"
        >
          {menu.cafes.name_kor}
        </Link>
        <span>›</span>
        <span>{menu.name_kor}</span>
      </div>

      <header className="mt-2 px-4 md:px-8">
        <div className="p-4 md:p-8 flex items-center gap-4 md:gap-8 rounded bg-secondary">
          <Image
            src={menu.cafes.logo_url}
            alt={menu.cafes.name_kor}
            height={256}
            width={256}
            className="h-16 w-16 object-contain md:h-32 md:w-32"
          />
          <hgroup className="">
            <h1 className="text-lg md:text-4xl font-bold">{menu.name_kor}</h1>
            <h2 className="md:mt-2 text-lg md:text-4xl font-bold">
              {menu.cafes.name_kor}
            </h2>
            <div className="md:mt-2 md:ml-1 p-1 px-1.5 md:px-2 w-fit text-[8px] md:text-xs font-semibold rounded-full bg-custom-400 text-custom-900">
              {menu.categories.name}
            </div>
          </hgroup>
        </div>
      </header>

      <section className="mt-16 px-4 md:px-8">
        <h2 className="py-2 text-lg md:text-2xl font-semibold border-b">
          영양성분
        </h2>
        <ul className="mt-4 grid grid-cols-2 gap-4 md:gap-8">
          <NutrientList name="칼로리" value={menu.calories} unit="kcal" />
          <NutrientList name="당분" value={menu.sugars} unit="g" />
          <NutrientList name="탄수화물" value={menu.carbohydrate} unit="g" />
          <NutrientList name="단백질" value={menu.protein} unit="g" />
          <NutrientList name="지방" value={menu.fat} unit="g" />
          <NutrientList name="카페인" value={menu.caffeine} unit="mg" />
        </ul>
      </section>
      {/* <MenuModal menu={menu} /> */}
    </main>
  );
}

interface Props2 {
  name: string;
  value: number | null;
  unit: string;
}

function NutrientList({ name, value, unit }: Props2) {
  return (
    <li className="p-4 md:p-8 flex justify-between rounded bg-custom-100">
      <span className="text-muted-foreground font-medium">{name}</span>
      <span className="font-bold">
        {value ?? "-"} {unit}
      </span>
    </li>
  );
}
