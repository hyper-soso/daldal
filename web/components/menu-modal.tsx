import { Menu } from "@/types";
import { CloseButton } from "./close-button";

interface Props {
  menu: Menu;
}

export function MenuModal({ menu }: Props) {
  return (
    <article className="relative p-4 md:p-8 max-w-xl w-full bg-background rounded">
      <header className="flex items-start justify-between gap-4">
        <hgroup>
          <h2 className="text-lg font-semibold">{menu.name_kor}</h2>
          <h4 className="text-sm text-muted-foreground">{menu.name_eng}</h4>
        </hgroup>

        <CloseButton />
      </header>

      <p className="mt-4 p-4 text-sm font-medium text-secondary-foreground bg-secondary rounded">
        {menu.description}
      </p>

      <section className="mt-8">
        <header className="pb-2 flex items-end justify-between border-b">
          <h4 className="text-lg font-medium">영양성분</h4>
          <div className="text-sm text-muted-foreground">
            기준: {menu.serving_size ? `${menu.serving_size} ${menu.serving_unit ?? ""}` : "-"}
          </div>
        </header>

        <ul className="grid grid-cols-2">
          <NutrientList name="칼로리" value={menu.calories} unit="kcal" />
          <NutrientList name="당분" value={menu.sugars} unit="g" />
          <NutrientList name="탄수화물" value={menu.carbohydrate} unit="g" />
          <NutrientList name="단백질" value={menu.protein} unit="g" />
          <NutrientList name="지방" value={menu.fat} unit="g" />
          <NutrientList name="카페인" value={menu.caffeine} unit="mg" />
        </ul>
      </section>

      <section className="mt-8 text-sm font-medium text-muted-foreground">
        알레르기 성분: {menu.allergens.length > 0 ? menu.allergens.join(", ") : "정보 없음"}
      </section>
    </article>
  );
}

interface Props2 {
  name: string;
  value: number | null;
  unit: string;
}

function NutrientList({ name, value, unit }: Props2) {
  return (
    <li className="flex justify-between border-b p-2">
      <span className="text-muted-foreground font-medium">{name}</span>
      <span className="font-bold">
        {value ?? "-"} {unit}
      </span>
    </li>
  );
}
