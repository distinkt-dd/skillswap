import type { FC } from 'react';
import { Fragment } from 'react';
import type { SkillItem } from '@entities/user/ui/UserCard';
import { CATALOG_SECTION_TITLES, type CatalogDisplayItem } from '../model/types';
import { CatalogUserCard } from './CatalogUserCard';
import styles from './Catalog.module.css';

type CatalogListProps = {
  items: CatalogDisplayItem[];
  lastElementRef: (el: HTMLElement | null) => void;
  buildSkillItem: (subcategoryId: string | undefined) => SkillItem | null;
  getCanTeachData: (userId: string) => SkillItem[];
  getCityName: (cityId: string) => string;
  getLikesCount: (userId: string) => number;
};

export const CatalogList: FC<CatalogListProps> = ({
  items,
  lastElementRef,
  buildSkillItem,
  getCanTeachData,
  getCityName,
  getLikesCount,
}) => {
  return (
    <div className={styles.grid}>
      {items.map((item, index) => {
        const user = item.user;
        const prev = items[index - 1];
        const showSectionHeading =
          item.variant === 'section' &&
          (index === 0 || prev.variant !== 'section' || prev.section !== item.section);

        const isLastElement = index === items.length - 1;

        return (
          <Fragment key={`${item.variant === 'section' ? item.section : 'flat'}-${user.id}`}>
            {showSectionHeading && (
              <h2 className={styles.sectionTitle}>{CATALOG_SECTION_TITLES[item.section]}</h2>
            )}
            <CatalogUserCard
              ref={isLastElement ? lastElementRef : undefined}
              user={user}
              buildSkillItem={buildSkillItem}
              getCanTeachData={getCanTeachData}
              getCityName={getCityName}
              getLikesCount={getLikesCount}
            />
          </Fragment>
        );
      })}
    </div>
  );
};
