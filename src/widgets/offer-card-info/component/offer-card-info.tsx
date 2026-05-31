import type { FC } from 'react';
// import React, { useMemo, useRef, useState } from 'react';
import styles from './offer-card-info.module.css';
import { selectedUser, selectedUserIsResponse, selectedUsers, UserCard } from '@entities/user';
import { useSelector } from '@shared/store';
import { selectedSubcategories } from '@entities/subcategories/model/slice';
import { selectCities } from '@entities/cities/model/slice';

import { OfferCardUI } from '@widgets/offer-card/ui';
import type { TOffer } from '@entities/offers/api/types';
import { selectedCategories } from '@entities/categories/model';
import type { SkillItem } from '@entities/user/ui/UserCard';
import { calculateAge } from '@shared/index';

type TOfferCardInfo = {
  offer: TOffer;
};

export const OfferCardInfo: FC<TOfferCardInfo> = ({ offer }) => {
  const isLoading = useSelector(selectedUserIsResponse);
  const currentUser = useSelector(selectedUser);

  const user = useSelector(selectedUsers).find((item) => item.id == offer.userId);
  const subCategories = useSelector(selectedSubcategories);
  const categories = useSelector(selectedCategories);
  const cities = useSelector(selectCities);

  const wantsSubCategories = subCategories
    .filter((sub) => user?.subcategoriesIds.includes(sub.id))
    .map((sub) => {
      const category = categories.find((cat) => cat.id === sub.categoryId);

      return {
        name: sub.name,
        type: category?.type,
      };
    });

  const canSubCategories = subCategories
    .filter((sub) => sub.id === offer.subcategoryId)
    .map((sub) => {
      const category = categories.find((cat) => cat.id === sub.categoryId);

      return {
        name: sub.name,
        type: category?.type,
      };
    });

  const city = cities?.find((sub) => sub.id === user?.cityId);

  if (isLoading) {
    return <p>LOADING...</p>;
  }

  if (!isLoading) {
    if (!user) return;
    return (
      <div className={styles.offerCardInfo__container}>
        <UserCard
          id={user.id}
          name={user.name}
          avatar={user.avatar}
          location={city?.name}
          age={calculateAge(user.birthday)}
          canTeach={canSubCategories as SkillItem[]}
          wantsToLearn={wantsSubCategories as SkillItem[]}
          description={user.description}
          likesCount={offer.userLikedIds.length}
          className={styles['offer-card-info__user-card']}
        />
        <OfferCardUI offer={offer} userId={currentUser?.id} />
      </div>
    );
  }
};
