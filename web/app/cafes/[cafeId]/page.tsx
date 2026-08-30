import { cookies } from "next/headers";
import { Cafe, Category, Menu } from "@/types";
import { MenuList } from "@/components/menu-list";
import { createClient } from "@/lib/supabase/server";
import { CategoryScroll } from "@/components/category-scroll";
import Image from "next/image";
import { Metadata } from "next";

interface Props {
  params: Promise<{
    cafeId: string;
  }>;
  searchParams: Promise<{
    category: string;
    menu: string;
  }>;
}

type CafeWithCategories = Cafe & {
  categories: Category[];
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cafeId } = await params;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: cafeDetail } = await supabase
    .from("cafes")
    .select("*, categories (*)")
    .eq("id", cafeId)
    .single();

  const cafe = cafeDetail as CafeWithCategories;

  return {
    title: cafe.name_kor,
  };
}

export default async function CafesIdPage({ params, searchParams }: Props) {
  const { cafeId } = await params;
  const { category: categoryId } = await searchParams;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: cafeDetail } = await supabase
    .from("cafes")
    .select("*, categories (*)")
    .eq("id", cafeId)
    .single();

  // 안전한 타입 단언 (필요 시 에러 핸들링)
  const cafe = cafeDetail as CafeWithCategories;

  // 메뉴 조회 쿼리 빌더 생성 (변수명: menuQuery)
  let menuQuery = supabase.from("menus").select("*").eq("cafe_id", cafeId);

  // 카테고리 ID가 있을 때만 필터링 추가
  if (categoryId) {
    menuQuery = menuQuery.eq("category_id", categoryId);
  }

  // 최종 메뉴 데이터 가져오기 (변수명: menuList / menusError)
  const { data: _menuList } = await menuQuery;
  const menuList = _menuList as Menu[];

  return (
    <main className="pt-16">
      <header className="relative p-4 md:p-8 mx-auto max-w-5xl overflow-hidden">
        <div className="relative">
          <Image
            src={cafe.logo_url}
            alt={cafe.name_kor}
            height={180}
            width={180}
            className="mx-auto h-32 w-32 object-contain md:h-auto md:w-auto max-w-72 max-h-72"
          />

          <hgroup className="mt-8 md:mt-16 text-center">
            <h1 className="text-6xl font-bold">{cafe.name_kor}</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              {cafe.name_eng}
            </p>
          </hgroup>
        </div>
      </header>

      <CategoryScroll
        cafeId={cafeId}
        curCategoryId={categoryId}
        categories={cafe.categories}
      />

      <section className="p-4 md:p-8 mx-auto max-w-5xl">
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {menuList.map((item) => (
            <MenuList key={item.id} menu={item} />
          ))}
        </ul>
      </section>
    </main>
  );
}
