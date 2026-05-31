import type { TCategory } from '../api/types';

export type TCategoriesState = {
  categories: TCategory[];
  error: string;
  isResponse: boolean;
};
