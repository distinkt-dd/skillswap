import { forwardRef } from 'react';
import { UserCard } from '@entities/user/ui';
import type { TUser } from '@entities/user/api/types';
import type { SkillItem } from '@entities/user/ui/UserCard';
import { calculateAge } from '@shared/index';
import styles from './Catalog.module.css';

export type CatalogUserCardProps = {
  user: TUser;
  buildSkillItem: (subcategoryId: string | undefined) => SkillItem | null;
  getCanTeachData: (userId: string) => SkillItem[];
  getCityName: (cityId: string) => string;
  getLikesCount: (userId: string) => number;
};

export const CatalogUserCard = forwardRef<HTMLDivElement, CatalogUserCardProps>(
  ({ user, buildSkillItem, getCanTeachData, getCityName, getLikesCount }, ref) => {
    const wantsToLearn: SkillItem[] = (user.subcategoriesIds || [])
      .filter((id): id is string => typeof id === 'string')
      .map((id) => buildSkillItem(id))
      .filter((item): item is SkillItem => item !== null);

    const canTeach = getCanTeachData(user.id);
    const likesCount = getLikesCount(user.id);

    return (
      <div ref={ref} className={styles.cardWrapper}>
        <UserCard
          className={styles.catalogUserCard}
          detailed
          id={user.id}
          name={user.name}
          avatar={user.avatar}
          location={getCityName(user.cityId)}
          age={calculateAge(user.birthday)}
          wantsToLearn={wantsToLearn}
          canTeach={canTeach}
          likesCount={likesCount}
        />
      </div>
    );
  }
);

CatalogUserCard.displayName = 'CatalogUserCard';
