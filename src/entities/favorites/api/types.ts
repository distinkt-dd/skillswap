export interface TUser {
  id: string;
  name: string;
  email: string;
  description: string;
  avatar: string;
  gender: string;
  birthday: string;
  cityId: string;
  subcategoriesIds: (string | undefined)[];
  favorites: string[];
}
