import { useMemo } from 'react';
import type { TUser } from '@entities/user';
import type { TOffer } from '@entities/offers';
import type { TSubCategory } from '@entities/subcategories';
import type { TCategory } from '@entities/categories';
import type { FiltersState } from './types';

const normalize = (value: string): string => value.trim().toLowerCase();

interface UseFilteredUsersProps {
  users: TUser[];
  offers: TOffer[];
  subcategories: TSubCategory[];
  categories: TCategory[];
  filters: FiltersState;
}

export const useFilteredUsers = ({
  users = [],
  offers = [],
  subcategories = [],
  categories = [],
  filters,
}: UseFilteredUsersProps) => {
  const filteredUsers = useMemo(() => {
    if (!users.length) {
      return [];
    }

    const categoriesById = new Map(categories.map((c) => [c.id, c]));

    const searchQuery = normalize(filters.searchQuery);
    const searchMatches: string[] | null =
      searchQuery.length > 0
        ? subcategories
            .filter((sub) => {
              const cat = categoriesById.get(sub.categoryId);
              if (!cat) return false;
              return (
                normalize(sub.name).includes(searchQuery) ||
                normalize(cat.name).includes(searchQuery) ||
                normalize(cat.type).includes(searchQuery)
              );
            })
            .map((s) => s.id)
        : null;

    const skillIdSet = filters.skillIds.filter((id) => subcategories.some((sub) => sub.id === id));
    const hasSearch = searchMatches !== null;
    const hasSkillChips = skillIdSet.length > 0;

    let effectiveSubcategoryIds: string[];

    if (searchMatches !== null && hasSkillChips) {
      const skillSet = new Set(skillIdSet);
      effectiveSubcategoryIds = searchMatches.filter((id) => skillSet.has(id));
    } else if (searchMatches !== null) {
      effectiveSubcategoryIds = searchMatches;
    } else {
      effectiveSubcategoryIds = skillIdSet;
    }

    const hasSkillFilter = hasSearch || hasSkillChips;

    return users.filter((user) => {
      if (filters.gender && user.gender !== filters.gender) {
        return false;
      }

      // Фильтр по городам
      if (filters.cityIds?.length && !filters.cityIds.includes(user.cityId)) {
        return false;
      }

      if (!hasSkillFilter) {
        return true;
      }

      if (effectiveSubcategoryIds.length === 0) {
        return false;
      }

      const selectedSubcategoryIds = effectiveSubcategoryIds;

      // Фильтр по режиму
      switch (filters.mode) {
        case 'wantToLearn':
          return (
            user.subcategoriesIds?.some(
              (subId): subId is string =>
                subId !== undefined && selectedSubcategoryIds.includes(subId)
            ) ?? false
          );

        case 'canTeach': {
          const userOffers = offers.filter((offer) => offer?.userId === user.id);
          return userOffers.some(
            (offer) => offer && selectedSubcategoryIds.includes(offer.subcategoryId)
          );
        }

        case 'all':
        default: {
          const wantsToLearn =
            user.subcategoriesIds?.some(
              (subId): subId is string =>
                subId !== undefined && selectedSubcategoryIds.includes(subId)
            ) ?? false;
          const canTeach = offers
            .filter((offer) => offer?.userId === user.id)
            .some((offer) => offer && selectedSubcategoryIds.includes(offer.subcategoryId));

          return wantsToLearn || canTeach;
        }
      }
    });
  }, [
    users,
    offers,
    subcategories,
    categories,
    filters.mode,
    filters.gender,
    filters.cityIds,
    filters.skillIds,
    filters.searchQuery,
  ]);

  return {
    filteredUsers,
    filteredCount: filteredUsers.length,
  };
};
