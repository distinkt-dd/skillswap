import type { TUser } from '@entities/user/api/types';

export type CatalogSectionId = 'popular' | 'new' | 'recommended';

export type CatalogDisplayItem =
  | { variant: 'flat'; user: TUser }
  | { variant: 'section'; section: CatalogSectionId; user: TUser };

export const CATALOG_SECTION_TITLES: Record<CatalogSectionId, string> = {
  popular: 'Популярное',
  new: 'Новое',
  recommended: 'Рекомендуемое',
};

export const CATALOG_SECTION_HINTS: Record<CatalogSectionId, string> = {
  popular: 'Специалисты с наибольшим числом лайков на предложениях',
  new: 'Недавно добавленные предложения',
  recommended: 'Подборка для знакомства с каталогом',
};
