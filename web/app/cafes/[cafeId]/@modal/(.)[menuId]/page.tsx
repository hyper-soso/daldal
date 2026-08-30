import { Menu } from "@/types";
import { cookies } from "next/headers";
import { MenuModal } from "@/components/menu-modal";
import { createClient } from "@/lib/supabase/server";
import { ModalOverlay } from "@/components/modal-overlay";

interface Props {
  params: Promise<{
    menuId: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { menuId } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data } = await supabase
    .from("menus")
    .select("*, categories (*)")
    .eq("id", menuId)
    .single();

  const menu = data as Menu;

  return (
    <ModalOverlay>
      <MenuModal menu={menu} />
    </ModalOverlay>
  );
}
