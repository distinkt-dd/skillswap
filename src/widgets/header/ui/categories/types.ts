export type Category = {
  id: string;
  name: string;
  type: string;
};

export type Subcategory = {
  id: string;
  name: string;
  categoryId: string;
};

export type CategoryWithSubcategories = Category & {
  subcategories: Subcategory[];
};
