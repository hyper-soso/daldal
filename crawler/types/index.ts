export type Cafe = {
  id: string;
  name: string;
  categories: {
    id: string;
    code: string | null;
    path?: string;
    name: string;
    subCategories?: {
      id: string;
      name: string;
      code: string;
    }[];
  }[];
};
