export type Gender = 'male' | 'female';

export interface RegisterFormData {
  email: string;
  password: string;

  name: string;
  birthday: Date | null;
  gender: Gender | '';
  cityId: string;
  avatar: string;
  avatarIsCustom: boolean;
  learnCategoryIds: string[];
  subcategoriesIds: string[];

  offerName: string;
  offerCategoryId: string;
  offerSubcategoryId: string;
  offerDescription: string;
  offerImages: string[];
}
