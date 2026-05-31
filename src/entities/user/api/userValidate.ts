import * as yup from 'yup';

export const userSchema = yup.object({
  id: yup
    .string()
    .required()
    .matches(/^[a-zA-Z0-9]+$/, 'ID может содержать только латинские буквы и цифры'),
  name: yup.string().required('Имя отсутствует'),
  email: yup.string().email('Некорректный email').required('Email обязателен'),
  description: yup.string().required('Описание обязательно'),
  gender: yup.string().required('Пол обязателен для заполнения'),
  birthday: yup.string().required('Заполните дату'),
  cityId: yup
    .string()
    .required('Отсутсвует город')
    .matches(/^[a-zA-Z0-9]+$/, 'ID может содержать только латинские буквы и цифры'),
  subcategoriesIds: yup
    .array()
    .of(yup.string().matches(/^[a-zA-Z0-9]+$/, 'ID может содержать только латинские буквы и цифры'))
    .default([]),
  avatar: yup.string().required(),
});

export const userPassUpdateSchema = yup
  .object({
    password: yup.string().required('Введите пароль').min(8, 'Более 8 символов'),
    // .max(50, 'Менее 50 символов')
    // .matches(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву')
    // .matches(/[a-z]/, 'Пароль должен содержать хотя бы одну строчную букву')
    // .matches(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру')
    // .matches(/[!@#$%^&*]/, 'Пароль должен содержать хотя бы один спецсимвол (!@#$%^&*)'),
  })
  .concat(userSchema.pick(['id']));
export const getUserByIdSchema = userSchema;
export const getUsersSchema = yup.array().of(userSchema).required().min(0);
export const userDataUpdateSchema = userSchema
  .pick(['id'])
  .concat(userSchema.partial().omit(['id']));
export const userLoginSchema = userSchema.pick(['email']).concat(userPassUpdateSchema.omit(['id']));
export const userRegisterSchema = userSchema.concat(userPassUpdateSchema).omit(['id']);
