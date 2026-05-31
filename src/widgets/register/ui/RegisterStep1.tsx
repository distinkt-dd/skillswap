import { useState } from 'react';
import { Input, IconUI } from '@shared/ui';
import * as yup from 'yup';
import { step1Schema } from '../model/schemas';
import type { RegisterFormData } from '../model/types';
import styles from './register.module.css';

type Props = {
  data: RegisterFormData;
  onChange: (patch: Partial<RegisterFormData>) => void;
  errors: Record<string, string>;
  onErrorChange?: (patch: Record<string, string>) => void;
};

export const RegisterStep1 = ({ data, onChange, errors, onErrorChange }: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  const validateField = async (field: keyof typeof data, value: string) => {
    if (!onErrorChange) return;
    try {
      await step1Schema.validateAt(field as string, { ...data, [field]: value });
      onErrorChange({ [field]: '' });
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        onErrorChange({ [field]: err.message });
      }
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange({ email: value });
    void validateField('email', value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange({ password: value });
    void validateField('password', value);
  };

  return (
    <>
      <div className={styles.oauthGroup}>
        <button type="button" className={styles.oauthBtn}>
          <IconUI name="google" size={18} />
          Продолжить с Google
        </button>
        <button type="button" className={styles.oauthBtn}>
          <IconUI name="apple" size={18} />
          Продолжить с Apple
        </button>
      </div>

      <div className={styles.divider}>
        <span>или</span>
      </div>

      <Input
        type="email"
        label="Email"
        value={data.email}
        onChange={handleEmailChange}
        error={errors.email}
        placeholder="Введите email"
        fullWidth
      />

      <Input
        type={showPassword ? 'text' : 'password'}
        label="Пароль"
        value={data.password}
        onChange={handlePasswordChange}
        error={errors.password}
        hint={!errors.password ? 'Пароль должен содержать не менее 8 знаков' : undefined}
        placeholder="Придумайте надёжный пароль"
        fullWidth
        rightIcon={<IconUI name={showPassword ? 'eye' : 'eyeSlash'} size={20} />}
        showRightIcon
        onRightIconClick={() => setShowPassword((p) => !p)}
      />
    </>
  );
};
