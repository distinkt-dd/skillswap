import { useEffect } from 'react';
import { useDispatch, useSelector } from '@shared/store';

import { selectedSubcategories, getSubcategories } from '@entities/subcategories';
import { selectedUsers, fetchUsers } from '@entities/user';
import { selectCities } from '@entities/cities/model/slice';
import { fetchCities } from '@entities/cities/model/actions';
import { selectedOffers, getOffers } from '@entities/offers/model';

const isEmptyArray = (arr: unknown[] | null | undefined): boolean => !arr?.length;

export const useCatalogInit = (): void => {
  const dispatch = useDispatch();

  const users = useSelector(selectedUsers);
  const subcategories = useSelector(selectedSubcategories);
  const cities = useSelector(selectCities);
  const offers = useSelector(selectedOffers);

  useEffect(() => {
    if (isEmptyArray(users)) {
      dispatch(fetchUsers());
    }

    if (isEmptyArray(subcategories)) {
      dispatch(getSubcategories());
    }

    if (isEmptyArray(cities)) {
      dispatch(fetchCities());
    }

    if (isEmptyArray(offers)) {
      dispatch(getOffers());
    }
  }, [dispatch, users?.length, subcategories?.length, cities?.length, offers?.length]);
};
