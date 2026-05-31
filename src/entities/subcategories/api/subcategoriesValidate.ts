import * as yup from 'yup';

export const subcategoriesSchema = yup.object({
  id: yup
    .string()
    .required('ID обязателен')
    .matches(/^[a-zA-Z0-9]+$/, 'ID может содержать только латинские буквы и цифры'),
  name: yup
    .string()
    .required('Название отсутствует')
    .min(3, 'Название должно быть минимум 3 символа')
    .max(100, 'Название не может быть длиннее 100 символов'),
  categoryId: yup
    .string()
    .required('ID обязателен')
    .matches(/^[a-zA-Z0-9]+$/, 'ID может содержать только латинские буквы и цифры'),
});

export const getSubcategoriesSchema = yup.array().of(subcategoriesSchema).required().min(0);
