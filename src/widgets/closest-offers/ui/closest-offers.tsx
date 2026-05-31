import type { FC } from 'react';
import { useSelector } from '@shared/store';
import type { TOffer } from '@entities/offers';
import styles from './closest-offers.module.css';
import { selectedUserIsResponse, selectedUsers, UserCard } from '@entities/user';
import { selectedSubcategories } from '@entities/subcategories';
import { selectedCategories } from '@entities/categories/model';
import { selectCities } from '@entities/cities';
import { calculateAge, IconUI } from '@shared/index';
import type { SkillItem } from '@entities/user/ui/UserCard';
import { selectedOffers } from '@entities/offers/model';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import { getRandomItems } from '@shared/utils/randomItems';

type TClosestOffers = {
  offer: TOffer;
};

export const ClosestOffers: FC<TClosestOffers> = ({ offer }) => {
  const isLoading = useSelector(selectedUserIsResponse);
  const categories = useSelector(selectedCategories);
  const subCategories = useSelector(selectedSubcategories);

  const closeSubCat = subCategories.find((item) => item.id === offer.subcategoryId);
  const closeCat = categories.find((item) => item.id === closeSubCat?.categoryId);
  const closeSubs = subCategories
    .filter((item) => item.categoryId === closeCat?.id)
    .map((item) => item.id);

  const offers = useSelector(selectedOffers);
  const closeOffersUserIds = offers
    .filter((item) => closeSubs.includes(item.subcategoryId))
    .map((item) => item.userId);

  const users = useSelector(selectedUsers);
  const closeUsers = users
    .filter((item) => closeOffersUserIds.includes(item.id))
    .filter((item) => item.id !== offer.userId);
  const randomUserOffers = getRandomItems(closeUsers, 10);

  const cities = useSelector(selectCities);

  if (isLoading) {
    return <p>LOADING...</p>;
  }

  if (!isLoading) {
    if (!closeUsers) return;

    if (closeUsers.length < 4) {
      return (
        <div className={styles.closestOffers__container}>
          <h2>Похожие предложения</h2>
          <ul className={styles.closestOffers__list}>
            {randomUserOffers.map((item) => {
              const wantsSubCategories = subCategories
                .filter((sub) => item?.subcategoriesIds.includes(sub.id))
                .map((sub) => {
                  const category = categories.find((cat) => cat.id === sub.categoryId);

                  return {
                    name: sub.name,
                    type: category?.type,
                  };
                });

              const userOffer = offers.find((of) => of.userId === item.id);
              const canSubCategories = subCategories
                .filter((sub) => sub.id === userOffer?.subcategoryId)
                .map((sub) => {
                  const category = categories.find((cat) => cat.id === sub.categoryId);

                  return {
                    name: sub.name,
                    type: category?.type,
                  };
                });
              const city = cities?.find((sub) => sub.id === item?.cityId);

              return (
                <li key={item.id} className={styles.closestOffers__item}>
                  <UserCard
                    className={styles.userCard}
                    detailed
                    id={item.id}
                    name={item.name}
                    avatar={item.avatar}
                    location={city?.name}
                    age={calculateAge(item.birthday)}
                    canTeach={canSubCategories as SkillItem[]}
                    wantsToLearn={wantsSubCategories as SkillItem[]}
                    description={item.description}
                    likesCount={userOffer?.userLikedIds.length}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      );
    }

    return (
      <div className={styles.closestOffers__container}>
        <h2>Похожие предложения</h2>
        <ul className={styles.closestOffers__list}>
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            navigation={{
              nextEl: '.custom-swiper-next',
              prevEl: '.custom-swiper-prev',
            }}
            className={styles.slider}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
          >
            {randomUserOffers.map((item) => {
              const wantsSubCategories = subCategories
                .filter((sub) => item?.subcategoriesIds.includes(sub.id))
                .map((sub) => {
                  const category = categories.find((cat) => cat.id === sub.categoryId);

                  return {
                    name: sub.name,
                    type: category?.type,
                  };
                });

              const userOffer = offers.find((of) => of.userId === item.id);
              const canSubCategories = subCategories
                .filter((sub) => sub.id === userOffer?.subcategoryId)
                .map((sub) => {
                  const category = categories.find((cat) => cat.id === sub.categoryId);

                  return {
                    name: sub.name,
                    type: category?.type,
                  };
                });
              const city = cities?.find((sub) => sub.id === item?.cityId);

              return (
                <li className={styles.closestOffers__item}>
                  <SwiperSlide key={item.id}>
                    <UserCard
                      className={styles.userCard}
                      detailed
                      id={item.id}
                      name={item.name}
                      avatar={item.avatar}
                      location={city?.name}
                      age={calculateAge(item.birthday)}
                      canTeach={canSubCategories as SkillItem[]}
                      wantsToLearn={wantsSubCategories as SkillItem[]}
                      description={item.description}
                      likesCount={userOffer?.userLikedIds.length}
                    />
                  </SwiperSlide>
                </li>
              );
            })}
          </Swiper>
        </ul>
        <button className="custom-swiper-prev">
          <IconUI name="chevronLeft" />
        </button>
        <button className="custom-swiper-next">
          <IconUI name="chevronRight" />
        </button>
      </div>
    );
  }
};
