export { CitiesApi } from './api/cities-api';

export { getCitiesSchema } from './api/citiesValidate';

export type { TCity } from './api/types';

export {
  citiesSlice,
  selectCities,
  setCities,
  setSelectedCityById,
  selectSelectedCity,
} from './model/slice';

export { fetchCities } from './model/actions';
