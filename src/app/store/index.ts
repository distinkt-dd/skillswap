import { applicationSlice } from '@entities/application';
import { categoriesSlice } from '@entities/categories/model';
import { citiesSlice } from '@entities/cities';
import { offersSlice } from '@entities/offers/model';
import { subcategoriesSlice } from '@entities/subcategories';
import { userSlice } from '@entities/user';
import { combineSlices, configureStore } from '@reduxjs/toolkit';

const rootReducer = combineSlices(
  userSlice,
  citiesSlice,
  subcategoriesSlice,
  categoriesSlice,
  offersSlice,
  applicationSlice
);

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      thunk: true,
      immutableCheck: false,
      serializableCheck: false,
    });
  },
});

declare global {
  type RootState = ReturnType<typeof rootReducer>;
  type AppDispatch = typeof store.dispatch;
}
