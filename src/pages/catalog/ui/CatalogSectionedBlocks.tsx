import type { FC } from 'react';
import type { TUser } from '@entities/user/api/types';
import type { SkillItem } from '@entities/user/ui/UserCard';
import { CATALOG_SECTION_TITLES, type CatalogDisplayItem } from '../model/types';
import { CatalogUserCard } from './CatalogUserCard';
import styles from './Catalog.module.css';
import { Button, IconUI } from '@shared/index';

const PREVIEW_COUNT = 3;

type CatalogSectionedBlocksProps = {
  popular: TUser[];
  newUsers: TUser[];
  recommendedItems: CatalogDisplayItem[];
  showAllPopular: boolean;
  showAllNew: boolean;
  onTogglePopular: () => void;
  onToggleNew: () => void;
  lastElementRef: (el: HTMLElement | null) => void;
  buildSkillItem: (subcategoryId: string | undefined) => SkillItem | null;
  getCanTeachData: (userId: string) => SkillItem[];
  getCityName: (cityId: string) => string;
  getLikesCount: (userId: string) => number;
};

export const CatalogSectionedBlocks: FC<CatalogSectionedBlocksProps> = ({
  popular,
  newUsers,
  recommendedItems,
  showAllPopular,
  showAllNew,
  onTogglePopular,
  onToggleNew,
  lastElementRef,
  buildSkillItem,
  getCanTeachData,
  getCityName,
  getLikesCount,
}) => {
  const popularShown = showAllPopular ? popular : popular.slice(0, PREVIEW_COUNT);
  const newShown = showAllNew ? newUsers : newUsers.slice(0, PREVIEW_COUNT);

  return (
    <div className={styles.sectionedRoot}>
      {popular.length > 0 && (
        <section className={styles.sectionBlock} aria-labelledby="catalog-popular-heading">
          <div className={styles.sectionHeaderRow}>
            <h2 id="catalog-popular-heading" className={styles.sectionHeading}>
              {CATALOG_SECTION_TITLES.popular}
            </h2>
            {popular.length > PREVIEW_COUNT && (
              <Button
                type="button"
                variant="tertiary"
                onClick={onTogglePopular}
                aria-expanded={showAllPopular}
                icon={<IconUI name="chevronRight" />}
                iconPosition="right"
              >
                {showAllPopular ? 'Свернуть' : 'Смотреть все'}
              </Button>
            )}
          </div>
          <div className={styles.grid}>
            {popularShown.map((user) => (
              <CatalogUserCard
                key={user.id}
                user={user}
                buildSkillItem={buildSkillItem}
                getCanTeachData={getCanTeachData}
                getCityName={getCityName}
                getLikesCount={getLikesCount}
              />
            ))}
          </div>
        </section>
      )}

      {newUsers.length > 0 && (
        <section className={styles.sectionBlock} aria-labelledby="catalog-new-heading">
          <div className={styles.sectionHeaderRow}>
            <h2 id="catalog-new-heading" className={styles.sectionHeading}>
              {CATALOG_SECTION_TITLES.new}
            </h2>
            {newUsers.length > PREVIEW_COUNT && (
              <Button
                type="button"
                variant="tertiary"
                onClick={onToggleNew}
                aria-expanded={showAllNew}
                icon={<IconUI name="chevronRight" />}
                iconPosition="right"
              >
                {showAllNew ? 'Свернуть' : 'Смотреть все'}
              </Button>
            )}
          </div>
          <div className={styles.grid}>
            {newShown.map((user) => (
              <CatalogUserCard
                key={user.id}
                user={user}
                buildSkillItem={buildSkillItem}
                getCanTeachData={getCanTeachData}
                getCityName={getCityName}
                getLikesCount={getLikesCount}
              />
            ))}
          </div>
        </section>
      )}

      {recommendedItems.length > 0 && (
        <section className={styles.sectionBlock} aria-labelledby="catalog-recommended-heading">
          <div className={styles.sectionHeaderRow}>
            <h2 id="catalog-recommended-heading" className={styles.sectionHeading}>
              {CATALOG_SECTION_TITLES.recommended}
            </h2>
          </div>
          <div className={styles.grid}>
            {recommendedItems.map((item, index) => {
              const isLast = index === recommendedItems.length - 1;
              return (
                <CatalogUserCard
                  key={item.user.id}
                  ref={isLast ? lastElementRef : undefined}
                  user={item.user}
                  buildSkillItem={buildSkillItem}
                  getCanTeachData={getCanTeachData}
                  getCityName={getCityName}
                  getLikesCount={getLikesCount}
                />
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
