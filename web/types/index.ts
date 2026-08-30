export type Cafe = {
  id: string;
  name_kor: string;
  name_eng: string;
  logo_url: string;
  created_at: string;
};

export type Category = {
  id: number;
  name: string;
  type: string;
  cafe_id: string;
};

/**
 * 사이즈(menu_variant)별 1행.
 *
 * 영양성분은 브랜드가 공개하지 않는 경우가 있어 null 이 될 수 있다.
 * (쥬씨 / 텐퍼센트커피는 전 메뉴가 null)
 */
export type Menu = {
  id: number;
  cafe_id: string;
  category_id: number;
  name_kor: string;
  name_eng: string;
  description: string;
  is_seasonal: boolean;
  image_url: string | null;
  size_name: string;
  serving_size: number | null;
  serving_unit: string | null;
  calories: number | null;
  carbohydrate: number | null;
  sugars: number | null;
  protein: number | null;
  fat: number | null;
  saturated_fat: number | null;
  trans_fat: number | null;
  sodium: number | null;
  caffeine: number | null;
  allergens: string[];
};
