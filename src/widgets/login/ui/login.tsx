import {
  login,
  selectedUserError,
  selectedUserIsResponse,
  userLoginSchema,
  type TLoginUser,
} from '@entities/user';
import { useFormValidation } from '@shared/api';
import { useDispatch, useSelector } from '@shared/store';
import { Button, IconUI, Input } from '@shared/ui';
import Form from '@shared/ui/form';
import clsx from 'clsx';
import { useState, type ChangeEvent } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './login.module.css';

interface LoginFormProps {
  onSuccess?: () => void;
  classNames?: string;
}

export const LoginForm = ({ onSuccess, classNames }: LoginFormProps) => {
  const [formData, setFormData] = useState<TLoginUser>({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const { errors, validateField, validateForm, getCounterErrors } =
    useFormValidation(userLoginSchema);

  const dispatch = useDispatch();
  const error = useSelector(selectedUserError);
  const isResponse = useSelector(selectedUserIsResponse);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, field: keyof typeof formData) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleSubmit = async () => {
    const isValid = await validateForm(formData);
    if (isValid) {
      const result = await dispatch(login(formData));

      if (result.payload && onSuccess) {
        onSuccess();
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Form classNames={classNames} onSubmit={handleSubmit} error={error}>
      <Button
        className={clsx(styles.social)}
        type="button"
        variant="secondary"
        icon={<IconUI name="google" />}
      >
        Продолжить с Google
      </Button>
      <Button
        className={clsx(styles.social)}
        type="button"
        variant="secondary"
        icon={<IconUI name="apple" />}
      >
        Продолжить с Apple
      </Button>

      <hr className={clsx(styles.hr)} />

      <Input
        value={formData.email}
        label="Email"
        type="email"
        placeholder="Введите email"
        error={errors.email}
        onChange={(e) => handleChange(e, 'email')}
        disabled={isResponse}
      />

      <Input
        value={formData.password}
        label="Пароль"
        type={showPassword ? 'text' : 'password'}
        placeholder="Введите ваш пароль"
        error={errors.password}
        onChange={(e) => handleChange(e, 'password')}
        disabled={isResponse}
        rightIcon={<IconUI name="eye" size={24} />}
        showRightIcon={true}
        onRightIconClick={togglePasswordVisibility}
      />

      <Button type="submit" disabled={getCounterErrors(errors) > 0 || isResponse}>
        {isResponse ? 'Вход...' : 'Войти'}
      </Button>
      <NavLink className={clsx(styles.navlink)} to="/registration">
        {' '}
        Зарегистрироваться{' '}
      </NavLink>
    </Form>
  );
};
