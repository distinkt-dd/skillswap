// types.ts
export interface TUser {
  id: string;
  name: string;
  email: string;
  description: string;
  avatar: string;
  gender: string;
  birthday: string;
  cityId: string;
  subcategoriesIds: (string | undefined)[];
}

export interface TServerUser extends TUser {
  passwordHash: string;
}

// Регистрация: отправляем plain password
export type TRegisterUser = Omit<TUser, 'id'> & {
  password: string;
};

// Логин: отправляем email и plain password
export type TLoginUser = {
  email: string;
  password: string;
};

// Обновление пароля: отправляем newPassword (plain)
export type TUpdateUserPass = {
  id: string;
  password: string; // новый пароль в открытом виде
};

export type TUpdateUser = Omit<Partial<Omit<TUser, 'id'>>, 'subcategoriesIds'> & { id: string };

// Ответ сервера при логине/регистрации
export type TAuthResponse = {
  user: TUser;
  token: string;
};
