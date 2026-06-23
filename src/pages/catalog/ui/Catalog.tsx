import type { FC } from 'react';
import { Fragment, useState } from 'react';

import { useCatalogFilters } from '@features/filters';
import { Button } from '@shared/index';
import { AsideFilters } from '@widgets/aside-filters/ui';
import { useCatalogViewModel } from '../model/hooks/useCatalogViewModel';
import { CardSkeleton } from './CardSkeleton/CardSkeleton';
import styles from './Catalog.module.css';
import { CatalogActiveFilterChips } from './CatalogActiveFilterChips';
import { CatalogList } from './CatalogList';
import { CatalogSectionedBlocks } from './CatalogSectionedBlocks';

export const Catalog: FC = () => {
  const { filters, actions: filterActions } = useCatalogFilters();
  const [showAllPopular, setShowAllPopular] = useState(false);
  const [showAllNew, setShowAllNew] = useState(false);

  const {
    users,
    sectionBuckets,
    displayedCatalogItems,
    loading,
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
  } = useCatalogViewModel(filters);

  const [prevSectionBuckets, setPrevSectionBuckets] = useState(sectionBuckets);
  const [filterIsOpen, setFilterIsOpen] = useState<boolean>(false);
  if (sectionBuckets !== prevSectionBuckets) {
    setPrevSectionBuckets(sectionBuckets);
    if (!sectionBuckets) {
      setShowAllPopular(false);
      setShowAllNew(false);
    }
  }

  const handleFilter = () => {
    setFilterIsOpen(!filterIsOpen);
  };

  if (isAnyLoading && isInitialLoading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (!isAnyLoading && firstError) {
    return (
      <div className={styles.empty}>
        <h2 className={styles.emptyTitle}>Карточки не нашли</h2>
        <p className={styles.emptyText}>Ошибка загрузки страницы</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {firstError && <div className={styles.errorBanner}>{firstError}</div>}
        <div className={styles.filters}>
          <Button
            variant="secondary"
            width={147}
            onClick={handleFilter}
            className={styles.filterBTN}
          >
            {filterIsOpen ? 'Закрыть фильтры' : 'Открыть фильтры'}
          </Button>
          <AsideFilters
            categories={categories}
            subcategories={subcategories}
            cities={cities}
            filters={filters}
            actions={filterActions}
            classNames={`${styles.filterAside} ${filterIsOpen ? styles.filterOpen : ''}`}
          />
        </div>

        <div className={styles.gridContainer}>
          {sectionBuckets ? (
            <CatalogSectionedBlocks
              popular={sectionBuckets.popular}
              newUsers={sectionBuckets.newUsers}
              recommendedItems={displayedCatalogItems}
              showAllPopular={showAllPopular}
              showAllNew={showAllNew}
              onTogglePopular={() => setShowAllPopular((v) => !v)}
              onToggleNew={() => setShowAllNew((v) => !v)}
              lastElementRef={lastElementRef}
              buildSkillItem={buildSkillItem}
              getCanTeachData={getCanTeachData}
              getCityName={getCityName}
              getLikesCount={getLikesCount}
            />
          ) : (
            <Fragment>
              <CatalogActiveFilterChips
                filters={filters}
                cities={cities}
                subcategories={subcategories}
                actions={filterActions}
              />
              <div className={styles.sectionHeaderRow}>
                <h2 className={styles.sectionHeading} id="catalog-filtered-heading">
                  Подходящие предложения: {users.length}
                </h2>
              </div>
              {users.length !== 0 ? (
                <CatalogList
                  items={displayedCatalogItems}
                  lastElementRef={lastElementRef}
                  buildSkillItem={buildSkillItem}
                  getCanTeachData={getCanTeachData}
                  getCityName={getCityName}
                  getLikesCount={getLikesCount}
                />
              ) : (
                <div className={styles.empty}>
                  <h2 className={styles.emptyTitle}>Карточки не нашли</h2>
                  <p className={styles.emptyText}>Попробуйте изменить фильтры или зайти позже.</p>
                </div>
              )}
            </Fragment>
          )}

          {loading && (
            <div className={styles.skeletonGrid}>
              {[...Array(3)].map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
