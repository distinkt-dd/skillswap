import type { CategoryWithSubcategories } from './categories/types';

export type THeaderUIProps = {
  isSkillsOpen?: boolean;
  onSkillsToggle?: () => void;
  categories?: CategoryWithSubcategories[];
  isLoading?: boolean;
  error?: string | null;
  onCategoryClick?: (categoryType: string) => void;
  onSubcategoryClick?: (subcategoryId: string) => void;
  variant?: 'default' | 'pure';
  onClose?: () => void;
  className?: string;
};
