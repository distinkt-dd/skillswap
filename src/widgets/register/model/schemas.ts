import * as yup from 'yup';

export const step1Schema = yup.object({
  email: yup.string().required('Email обязателен').email('Введите корректный email'),
  password: yup
    .string()
    .required('Пароль обязателен')
    .min(8, 'Пароль должен содержать не менее 8 символов'),
});

export const step2Schema = yup.object({
  name: yup
    .string()
    .required('Введите имя')
    .min(2, 'Имя должно быть не менее 2 символов')
    .max(50, 'Имя не может быть длиннее 50 символов'),
  birthday: yup
    .date()
    .nullable()
    .required('Укажите дату рождения')
    .max(new Date(), 'Дата рождения не может быть в будущем')
    .typeError('Введите корректную дату'),
  gender: yup.string().required('Укажите пол').oneOf(['male', 'female'], 'Укажите пол'),
  cityId: yup.string().required('Выберите город'),
  subcategoriesIds: yup
    .array()
    .of(yup.string().required())
    .min(1, 'Выберите хотя бы одну подкатегорию')
    .required('Выберите хотя бы одну подкатегорию'),
  // FIX: убрано сообщение об ошибке — аватар теперь всегда генерируется
  // автоматически в initialData, пользователь не увидит эту ошибку
  avatar: yup.string().required(),
});

export const step3Schema = yup.object({
  offerName: yup
    .string()
    .required('Введите название навыка')
    .min(3, 'Название должно быть не менее 3 символов')
    .max(100, 'Название не может быть длиннее 100 символов'),
  offerCategoryId: yup.string().required('Выберите категорию навыка'),
  offerSubcategoryId: yup.string().required('Выберите подкатегорию навыка'),
  offerDescription: yup
    .string()
    .required('Добавьте описание')
    .min(10, 'Описание должно быть не менее 10 символов')
    .max(1000, 'Описание не может быть длиннее 1000 символов'),
});

export const stepSchemas = [step1Schema, step2Schema, step3Schema] as const;
