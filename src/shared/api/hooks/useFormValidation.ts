import { useState } from 'react';
import * as yup from 'yup';

export const useFormValidation = <T extends object>(schema: yup.Schema<T>) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const validateField = async (field: keyof T, value: string) => {
    try {
      await schema.validateAt(field as string, { [field]: value });
      setErrors((prev) => ({ ...prev, [field]: '' }));
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setErrors((prev) => ({ ...prev, [field]: err.message }));
      }
    }
  };

  const validateForm = async (data: T): Promise<boolean> => {
    try {
      await schema.validate(data, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const validationErrors = err.inner.reduce(
          (acc, err) => {
            if (err.path) {
              acc[err.path] = err.message;
            }
            return acc;
          },
          {} as Record<string, string>
        );
        setErrors(validationErrors);
      }
      return false;
    }
  };

  const clearErrors = () => {
    setErrors({});
  };

  const clearFieldError = (field: keyof T) => {
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const getCounterErrors = (errors: Record<string, string>) => {
    return Object.values(errors).filter(Boolean).length;
  };

  return { errors, validateField, validateForm, clearErrors, clearFieldError, getCounterErrors };
};
