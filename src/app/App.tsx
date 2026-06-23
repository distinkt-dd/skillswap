import './App.css';

import {
  checkUserAuth,
  fetchCities,
  fetchUsers,
  getCategories,
  getSubcategories,
  selectedUser,
  selectedUserIsAuthChecked,
} from '@entities/index';
import { CatalogFiltersProvider } from '@features/filters';
import { Catalog } from '@pages/catalog/ui';
import { ErrorPage, LayoutAuth, LayoutNauth, LayoutPure, LoginPage } from '@pages/index';
import { useSelector } from '@shared/store';
import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { fetchAcceptedOffers, fetchReceivedApplications } from '@entities/application';
import { getOfferByUser, getOffers } from '@entities/offers/model/actions';
import { LayoutProfile } from '@pages/layouts';
import { useDispatch } from '@shared/store';
import { RegisterForm } from '@widgets/register/ui';
import { RequestsWidget } from '@widgets/requests';
import { useEffect } from 'react';
import { ProtectedRoute } from './router/ProtectedRoute';
import { TempAbout } from './test/temp-test-components';

const ProfileForm = lazy(() =>
  import('@widgets/profile/ui').then((module) => ({ default: module.ProfileForm }))
);
const Favorites = lazy(() =>
  import('@widgets/favorites').then((module) => ({ default: module.Favorites }))
);
const MyOffers = lazy(() =>
  import('@widgets/my-offers').then((module) => ({ default: module.MyOffers }))
);
const Exchanges = lazy(() =>
  import('@widgets/exchanges').then((module) => ({ default: module.Exchanges }))
);
const OfferPage = lazy(() =>
  import('@pages/index').then((module) => ({ default: module.OfferPage }))
);

const LoadingFallback = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}
  >
    Loading...
  </div>
);

export const App = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectedUser);
  const authChecked = useSelector(selectedUserIsAuthChecked);
  const ErrorLayout = user && authChecked ? LayoutAuth : LayoutNauth;

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getSubcategories());
    dispatch(fetchCities());
    dispatch(getOffers());
    dispatch(fetchUsers());
    dispatch(checkUserAuth());
  }, [dispatch]);

  useEffect(() => {
    if (!user) {
      return;
    }
    dispatch(getOfferByUser(user.id));
    dispatch(fetchReceivedApplications());
    dispatch(fetchAcceptedOffers());
  }, [user, dispatch]);

  return (
    <CatalogFiltersProvider>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route
            path="/"
            element={
              <LayoutAuth>
                <Catalog />
              </LayoutAuth>
            }
          />
          <Route
            path="/catalog"
            element={
              <LayoutAuth>
                <Catalog />
              </LayoutAuth>
            }
          />
          <Route
            path="/offers/:id"
            element={
              <LayoutNauth>
                <OfferPage />
              </LayoutNauth>
            }
          />
          <Route
            path="/about"
            element={
              <LayoutNauth>
                <TempAbout />
              </LayoutNauth>
            }
          />

          <Route
            path="/login"
            element={
              <ProtectedRoute onlyUnAuth>
                <LayoutPure>
                  <LoginPage />
                </LayoutPure>
              </ProtectedRoute>
            }
          />

          <Route
            path="/registration"
            element={
              <ProtectedRoute onlyUnAuth>
                <Navigate to="/registration/1" replace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/registration/:step"
            element={
              <ProtectedRoute onlyUnAuth>
                <LayoutPure>
                  <RegisterForm />
                </LayoutPure>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <LayoutProfile>
                  <ProfileForm />
                </LayoutProfile>
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-skills"
            element={
              <ProtectedRoute>
                <LayoutProfile>
                  <MyOffers />
                </LayoutProfile>
              </ProtectedRoute>
            }
          />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <LayoutProfile>
                  <Favorites />
                </LayoutProfile>
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-exchanges"
            element={
              <ProtectedRoute>
                <LayoutProfile>
                  <Exchanges />
                </LayoutProfile>
              </ProtectedRoute>
            }
          />

          <Route
            path="/requests"
            element={
              <ProtectedRoute>
                <LayoutProfile>
                  <RequestsWidget />
                </LayoutProfile>
              </ProtectedRoute>
            }
          />

          <Route
            path="500"
            element={
              <ErrorLayout>
                <ErrorPage variant="500" />
              </ErrorLayout>
            }
          />
          <Route
            path="*"
            element={
              <ErrorLayout>
                <ErrorPage variant="404" />
              </ErrorLayout>
            }
          />
        </Routes>
      </Suspense>
    </CatalogFiltersProvider>
  );
};
