import React, { useEffect } from 'react';
import { Checkbox, Button, IconUI } from '@shared/ui';
import type { TCategory } from '@entities/categories';
import type { TSubCategory } from '@entities/subcategories';
import styles from './CategoryFilter.module.css';

interface CategoryFilterProps {
  categories: TCategory[];
  subcategories: TSubCategory[];
  selectedSkillIds: string[];
  expandedCategories: string[];
  onSkillToggle: (skillId: string) => void;
  onCategoryToggle: (categoryId: string) => void;
  onShowAllClick: () => void;
  showAllCategories?: boolean;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  subcategories,
  selectedSkillIds,
  expandedCategories,
  onSkillToggle,
  onCategoryToggle,
  onShowAllClick,
  showAllCategories = false,
}) => {
  useEffect(() => {
    if (showAllCategories) {
      categories.forEach((category) => {
        if (!expandedCategories.includes(category.id)) {
          onCategoryToggle(category.id);
        }
      });
    } else {
      categories.forEach((category) => {
        if (expandedCategories.includes(category.id)) {
          onCategoryToggle(category.id);
        }
      });
    }
  }, [showAllCategories]);

  return (
    <div className={styles.categoryFilter}>
      <h4>Навыки</h4>

      {categories.map((category) => {
        const categorySubcategories = subcategories.filter((sub) => sub.categoryId === category.id);
        const isExpanded = expandedCategories.includes(category.id);

        return (
          <div key={category.id} className={styles.category}>
            {/* Категория - с isSubcategory для минуса */}
            <div
              className={styles.categoryHeader}
              onClick={() => onCategoryToggle(category.id)}
              role="button"
              tabIndex={0}
            >
              <Checkbox
                label={category.name}
                checked={isExpanded}
                onChange={() => onCategoryToggle(category.id)}
                isSubcategory={true}
                className={styles.categoryCheckbox}
              />
            </div>

            {/* Подкатегории - обычные чекбоксы с галочкой */}
            {isExpanded && (
              <div className={styles.subcategories}>
                {categorySubcategories.map((sub) => (
                  <Checkbox
                    key={sub.id}
                    label={sub.name}
                    checked={selectedSkillIds.includes(sub.id)}
                    onChange={() => onSkillToggle(sub.id)}
                    className={styles.subcategoryCheckbox}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}

      <Button
        variant="tertiary"
        onClick={onShowAllClick}
        icon={<IconUI name={showAllCategories ? 'chevronUp' : 'chevronDown'} />}
        iconPosition="right"
        className={styles.showAllButton}
      >
        Все категории
      </Button>
    </div>
  );
};
