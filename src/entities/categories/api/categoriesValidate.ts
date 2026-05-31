import * as yup from 'yup';

export const categoriesSchema = yup.object({
  id: yup
    .string()
    .required('ID обязателен')
    .matches(/^[a-zA-Z0-9]+$/, 'ID может содержать только латинские буквы и цифры'),
  name: yup
    .string()
    .required('Название отсутствует')
    .min(3, 'Название должно быть минимум 3 символа')
    .max(100, 'Название не может быть длиннее 100 символов'),
  type: yup.string().required('Тип обязателен').max(100, 'Тип не может быть длиннее 100 символов'),
});

export const getCategoriesSchema = yup.array().of(categoriesSchema).required().min(0);
