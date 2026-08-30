import { SearchList } from "@/components/search-list";
import { createClient } from "@/lib/supabase/server";
import { Cafe, Category, Menu } from "@/types";
import { Frown } from "lucide-react";
import { Metadata } from "next";
import { cookies } from "next/headers";

type MenusWithCafeAndCategories = Menu & {
  cafes: Cafe;
  categories: Category;
};

interface Props {
  searchParams: Promise<{
    q: string;
  }>;
}

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { q } = await searchParams;

  return {
    title: `검색: ${q}`,
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data } = await supabase
    .from("menus")
    .select(
      `
      *,
      cafes:cafe_id ( * ),
      categories:category_id ( * )
      `,
    )
    .ilike("name_kor", `%${q}%`);

  const result = data as MenusWithCafeAndCategories[];

  return (
    <main className="p-4 md:p-8 pt-20 md:pt-24 mx-auto max-w-5xl">
      <header>
        <h1 className="mt-4 text-2xl font-semibold">
          &#39;{q}&#39; 검색결과 총 {result.length}건
        </h1>
      </header>

      <section className="mt-4">
        {result.length === 0 && (
          <div className="p-4 md:p-8 rounded bg-custom-100 text-center">
            <Frown className="mx-auto" size={32} />
            <h4 className="mt-2 text-lg font-semibold">검색 결과가 없습니다</h4>
            <p className="mt-2 text-sm text-muted-foreground">
              다른 검색어로 다시 시도해 보세요.
            </p>
          </div>
        )}
      </section>

      <section className="mt-4">
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {result.map((item) => (
            <SearchList key={`search-${item.id}`} menu={item} />
          ))}
        </ul>
      </section>
    </main>
  );
}
