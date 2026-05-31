import { createBrowserRouter } from 'react-router-dom';
import {
  TempAbout,
  TempDashboard,
  TempLogin,
  TempRegister,
  TempNotFound,
} from './temp-test-components';
import { LayoutAuth, LayoutPure } from '@pages/index';
import { ProtectedRoute } from '../router/ProtectedRoute'; // ← импортируем защиту
import { Catalog } from '@pages/catalog/ui'; // ← импортируем каталог
import { CatalogFiltersProvider } from '@features/filters';

export const testRouter = createBrowserRouter([
  {
    path: '/',
    // Главная страница с каталогом
    element: (
      <CatalogFiltersProvider>
        <LayoutAuth>
          <Catalog />
        </LayoutAuth>
      </CatalogFiltersProvider>
    ),
  },
  {
    path: '/about',
    element: (
      <CatalogFiltersProvider>
        <LayoutAuth>
          <TempAbout />
        </LayoutAuth>
      </CatalogFiltersProvider>
    ),
  },
  {
    path: '/dashboard',
    // Защищенный маршрут
    element: (
      <ProtectedRoute>
        <CatalogFiltersProvider>
          <LayoutAuth>
            <TempDashboard />
          </LayoutAuth>
        </CatalogFiltersProvider>
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    // Защищенный маршрут
    element: (
      <ProtectedRoute>
        <CatalogFiltersProvider>
          <LayoutAuth>
            <TempDashboard />
          </LayoutAuth>
        </CatalogFiltersProvider>
      </ProtectedRoute>
    ),
  },
  {
    path: '/login',
    // Только для неавторизованных
    element: (
      <ProtectedRoute onlyUnAuth>
        <CatalogFiltersProvider>
          <LayoutPure>
            <TempLogin />
          </LayoutPure>
        </CatalogFiltersProvider>
      </ProtectedRoute>
    ),
  },
  {
    path: '/register',
    // Только для неавторизованных
    element: (
      <ProtectedRoute onlyUnAuth>
        <CatalogFiltersProvider>
          <LayoutPure>
            <TempRegister />
          </LayoutPure>
        </CatalogFiltersProvider>
      </ProtectedRoute>
    ),
  },
  {
    path: '/catalog',
    element: (
      <CatalogFiltersProvider>
        <LayoutAuth>
          <Catalog />
        </LayoutAuth>
      </CatalogFiltersProvider>
    ),
  },
  {
    path: '*',
    element: (
      <CatalogFiltersProvider>
        <LayoutAuth>
          <TempNotFound />
        </LayoutAuth>
      </CatalogFiltersProvider>
    ),
  },
]);
