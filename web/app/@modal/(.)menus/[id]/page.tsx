import { Menu } from "@/types";
import { cookies } from "next/headers";
import { MenuModal } from "@/components/menu-modal";
import { createClient } from "@/lib/supabase/server";
import { ModalOverlay } from "@/components/modal-overlay";
import { Metadata } from "next";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data } = await supabase
    .from("menus")
    .select("*, categories (*), cafes (*)")
    .eq("id", id)
    .single();

  const menu = data as Menu;

  return {
    title: menu.name_kor,
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data } = await supabase
    .from("menus")
    .select("*, categories (*)")
    .eq("id", id)
    .single();

  const menu = data as Menu;

  return (
    <ModalOverlay>
      <MenuModal menu={menu} />
    </ModalOverlay>
  );
}
