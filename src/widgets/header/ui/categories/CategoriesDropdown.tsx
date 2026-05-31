import type { FC } from 'react';
import styles from './CategoriesDropdown.module.css';
import { IconUI, Subcategory } from '@shared/ui';
import type { IconsMap } from '@shared/ui/icons/types';
import type { CategoryWithSubcategories } from './types';
import type { TSubcategoryProps } from '@shared/ui/subcategory/Subcategory';

const categoryConfig: Record<
  string,
  {
    icon: keyof IconsMap;
    type: TSubcategoryProps['type'];
  }
> = {
  business: { icon: 'briefcase', type: 'business' },
  creative: { icon: 'pallete', type: 'creative' },
  languages: { icon: 'global', type: 'languages' },
  education: { icon: 'book', type: 'education' },
  home: { icon: 'home', type: 'home' },
  health: { icon: 'lifestyle', type: 'health' },
};

const getCategoryConfig = (categoryType: string) => {
  return categoryConfig[categoryType];
};

type CategoriesProps = {
  categories: CategoryWithSubcategories[];
  onCategoryClick?: (categoryType: string) => void;
  onSubcategoryClick?: (subcategoryId: string) => void;
};

export const CategoriesDropdown: FC<CategoriesProps> = ({
  categories,
  onCategoryClick,
  onSubcategoryClick,
}) => {
  return (
    <div className={styles.categoriesDropdown}>
      {categories.map((category) => {
        const config = getCategoryConfig(category.type);
        const hasSubcategories = category.subcategories && category.subcategories.length > 0;

        return (
          <div key={category.id} className={styles.categoryGroup}>
            <div className={styles.categoryTitle} onClick={() => onCategoryClick?.(category.type)}>
              <div className={styles.categoryIcon}>
                <Subcategory
                  type={config.type}
                  title={category.name}
                  icon={<IconUI name={config.icon} />}
                />
              </div>
              <span className={styles.categoryName}>{category.name}</span>
            </div>

            {hasSubcategories && (
              <div className={styles.subcategoriesList}>
                {category.subcategories.map((sub) => (
                  <div
                    key={sub.id}
                    className={styles.dropdownItem}
                    onClick={() => onSubcategoryClick?.(sub.id)}
                  >
                    {sub.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
