import { useSelector } from '@shared/store';
import { useMemo } from 'react';

import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

import type { TCategory } from '@entities/categories';
import { selectedCategories } from '@entities/categories/model';
import type { TCity } from '@entities/cities';
import {
  selectCities,
  selectCitiesError,
  selectCitiesIsLoading,
} from '@entities/cities/model/slice';
import type { TOffer } from '@entities/offers/api/types';
import {
  selectedOffers,
  selectedOffersError,
  selectedOffersIsResponse,
} from '@entities/offers/model';
import type { TSubCategory } from '@entities/subcategories';
import {
  selectedSubcategories,
  selectedSubcategoriesError,
  selectedSubcategoriesIsResponse,
} from '@entities/subcategories';
import { selectedUserError, selectedUserIsResponse, selectedUsers } from '@entities/user';
import type { TUser } from '@entities/user/api/types';
import type { SkillItem } from '@entities/user/ui/UserCard';
import { useFilteredUsers, type FiltersState } from '@features/filters';
import type { CatalogSectionBuckets } from '../buildCatalogSectionItems';
import { partitionCatalogSections } from '../buildCatalogSectionItems';
import { isDefaultCatalogFilters } from '../isDefaultCatalogFilters';
import type { CatalogDisplayItem } from '../types';

const EMPTY_CITIES: TCity[] = [];

const ITEMS_PER_PAGE = 3;
const LOADING_DELAY_MS = 500;

export type CatalogViewModel = {
  users: TUser[];
  sectionBuckets: CatalogSectionBuckets | null;
  displayedCatalogItems: CatalogDisplayItem[];
  loading: boolean;
  hasMore: boolean;
  lastElementRef: (el: HTMLElement | null) => void;

  isAnyLoading: boolean;
  isInitialLoading: boolean;
  firstError: string | undefined;

  getCityName: (cityId: string) => string;
  buildSkillItem: (subcategoryId: string | undefined) => SkillItem | null;
  getCanTeachData: (userId: string) => SkillItem[];
  getLikesCount: (userId: string) => number;
  categories: TCategory[];
  subcategories: TSubCategory[];
  cities: TCity[];
};

export const useCatalogViewModel = (filters: FiltersState): CatalogViewModel => {
  const users = useSelector(selectedUsers);
  const subcategories = useSelector(selectedSubcategories);
  const cities = useSelector(selectCities) ?? EMPTY_CITIES;
  const offers = useSelector(selectedOffers);
  const categories = useSelector(selectedCategories);

  const isUsersLoading = useSelector(selectedUserIsResponse);
  const isSubcategoriesLoading = useSelector(selectedSubcategoriesIsResponse);
  const isOffersLoading = useSelector(selectedOffersIsResponse);
  const isCitiesLoading = useSelector(selectCitiesIsLoading);

  const userError = useSelector(selectedUserError);
  const subcategoriesError = useSelector(selectedSubcategoriesError);
  const offersError = useSelector(selectedOffersError);
  const citiesError = useSelector(selectCitiesError);

  const citiesById = useMemo(() => new Map(cities.map((city) => [city.id, city])), [cities]);
  const subcategoriesById = useMemo(
    () => new Map(subcategories.map((subcategory) => [subcategory.id, subcategory])),
    [subcategories]
  );
  const categoriesById = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories]
  );

  const offersByUserId = useMemo(() => {
    const map = new Map<string, TOffer[]>();

    offers.forEach((offer) => {
      const userIdKey = String(offer.userId);
      const list = map.get(userIdKey) ?? [];
      list.push(offer);
      map.set(userIdKey, list);
    });

    return map;
  }, [offers]);

  const isAnyLoading =
    isUsersLoading || isSubcategoriesLoading || isOffersLoading || isCitiesLoading;
  const isInitialLoading = isAnyLoading && !users.length;

  const firstError = userError || subcategoriesError || offersError || citiesError || undefined;

  const { filteredUsers } = useFilteredUsers({
    users,
    offers,
    subcategories,
    categories,
    filters,
  });

  const sectionBuckets = useMemo((): CatalogSectionBuckets | null => {
    if (!isDefaultCatalogFilters(filters)) return null;
    return partitionCatalogSections(filteredUsers, offers);
  }, [filters, filteredUsers, offers]);

  const catalogScrollItems = useMemo((): CatalogDisplayItem[] => {
    if (sectionBuckets) {
      return sectionBuckets.recommended.map((user) => ({
        variant: 'section' as const,
        section: 'recommended' as const,
        user,
      }));
    }
    return filteredUsers.map((user) => ({ variant: 'flat' as const, user }));
  }, [sectionBuckets, filteredUsers]);

  const {
    displayedItems: displayedCatalogItems,
    loading,
    hasMore,
    lastElementRef,
  } = useInfiniteScroll({
    items: catalogScrollItems,
    itemsPerPage: ITEMS_PER_PAGE,
    loadingDelay: LOADING_DELAY_MS,
  });

  const getCityName = (cityId: string): string => {
    const city = citiesById.get(cityId);
    return city?.name || cityId;
  };

  const buildSkillItem = (subcategoryId: string | undefined): SkillItem | null => {
    if (!subcategoryId) return null;

    const subcategory = subcategoriesById.get(subcategoryId);
    if (!subcategory) return null;

    const category = categoriesById.get(subcategory.categoryId);

    return {
      name: subcategory.name,
      type: (category?.type || 'other') as SkillItem['type'],
    };
  };

  const getCanTeachData = (userId: string): SkillItem[] => {
    const userOffers = offersByUserId.get(String(userId)) ?? [];

    return userOffers
      .map((offer) => buildSkillItem(offer.subcategoryId))
      .filter((item): item is SkillItem => item !== null);
  };

  const getLikesCount = (userId: string): number => {
    const userOffers = offersByUserId.get(String(userId)) ?? [];

    return userOffers.reduce((sum, offer) => {
      const likedCount = offer.userLikedIds.filter((id) => id !== undefined && id !== null).length;
      return sum + likedCount;
    }, 0);
  };

  return {
    users: filteredUsers,
    sectionBuckets,
    displayedCatalogItems,
    loading,
    hasMore,
    lastElementRef,
    isAnyLoading,
    isInitialLoading,
    firstError,
    getCityName,
    buildSkillItem,
    getCanTeachData,
    getLikesCount,
    categories,
    subcategories,
    cities,
  };
};
