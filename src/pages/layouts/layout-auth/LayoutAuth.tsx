import type { FC, ReactNode } from 'react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Footer, Header } from '@widgets/index';
import { useSelector } from '@shared/store';
import styles from './LayoutAuth.module.css';
import { selectedCategories } from '@entities/categories/model';
import { selectedSubcategories } from '@entities/subcategories';
import { useCatalogFilters } from '@features/filters';

const CATALOG_PATHS = ['/', '/catalog'];

const useGoToCatalogIfNeeded = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return () => {
    if (!CATALOG_PATHS.includes(location.pathname)) {
      navigate('/');
    }
  };
};

interface LayoutAuthProps {
  children: ReactNode;
}

export const LayoutAuth: FC<LayoutAuthProps> = ({ children }) => {
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);
  const { filters, actions } = useCatalogFilters();
  const goToCatalogIfNeeded = useGoToCatalogIfNeeded();

  const categories = useSelector(selectedCategories);
  const subcategories = useSelector(selectedSubcategories);

  const categoriesWithSubcategories = categories.map((category) => ({
    ...category,
    subcategories: subcategories.filter((sub) => sub.categoryId === category.id),
  }));

  const handleSkillsToggle = () => {
    setIsSkillsOpen((prev) => !prev);
  };

  const handleCategoryClick = (categoryType: string) => {
    const category = categories.find((c) => c.type === categoryType);
    if (!category) {
      setIsSkillsOpen(false);
      return;
    }

    const ids = subcategories.filter((sub) => sub.categoryId === category.id).map((sub) => sub.id);
    actions.setSkillIds(ids);
    actions.setSearchQuery('');
    if (!filters.expandedCategories.includes(category.id)) {
      actions.toggleCategory(category.id);
    }
    setIsSkillsOpen(false);
    goToCatalogIfNeeded();
  };

  const handleSubcategoryClick = (subcategoryId: string) => {
    const sub = subcategories.find((s) => s.id === subcategoryId);
    if (sub && !filters.expandedCategories.includes(sub.categoryId)) {
      actions.toggleCategory(sub.categoryId);
    }
    actions.toggleSkill(subcategoryId);
    actions.setSearchQuery('');
    setIsSkillsOpen(false);
    goToCatalogIfNeeded();
  };

  return (
    <div className={styles.layout}>
      <div className={styles.headerContainer}>
        <Header
          variant="default"
          isSkillsOpen={isSkillsOpen}
          onSkillsToggle={handleSkillsToggle}
          categories={categoriesWithSubcategories}
          onCategoryClick={handleCategoryClick}
          onSubcategoryClick={handleSubcategoryClick}
        />
      </div>
      <main className={styles.content}>{children}</main>
      <div className={styles.footerContainer}>
        <Footer />
      </div>
    </div>
  );
};
