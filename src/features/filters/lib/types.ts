export type FilterMode = 'all' | 'wantToLearn' | 'canTeach';

export type FiltersState = {
  mode: FilterMode;
  gender: 'male' | 'female' | null;
  cityIds: string[];
  skillIds: string[];
  searchQuery: string; /** Поиск по названию категории или подкатегории (хедер) */
  expandedCategories: string[];
  showAllCategories: boolean;
  showAllCities: boolean;
};

export type FiltersActions = {
  setMode: (mode: FilterMode) => void;
  setGender: (gender: 'male' | 'female' | null) => void;
  toggleCity: (cityId: string) => void;
  toggleSkill: (skillId: string) => void;
  setSkillIds: (skillIds: string[]) => void;
  toggleCategory: (categoryId: string) => void;
  toggleShowAllCategories: () => void;
  toggleShowAllCities: () => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
};

export const initialFiltersState: FiltersState = {
  mode: 'all',
  gender: null,
  cityIds: [],
  skillIds: [],
  searchQuery: '',
  expandedCategories: [],
  showAllCategories: false,
  showAllCities: false,
};
