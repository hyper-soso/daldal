import { Cafe } from "@/types";
import { cookies } from "next/headers";
import { CafeList } from "@/components/cafe-list";
import { MainHeader } from "@/components/main-header";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase.from("cafes").select("*");
  const cafes = data as Cafe[];

  return (
    <main className="p-4 md:p-8 pt-20 md:pt-24 mx-auto max-w-5xl">
      <MainHeader />

      <section className="mt-16">
        <h2 className="py-2 text-lg md:text-2xl font-semibold border-b">
          목록
        </h2>
        <ul className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {cafes.map((cafe) => (
            <CafeList key={`cafe-${cafe.id}`} cafe={cafe} />
          ))}
        </ul>
      </section>
    </main>
  );
}
