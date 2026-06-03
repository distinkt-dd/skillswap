import clsx from 'clsx';
import React from 'react';
import styles from './Form.module.css';

export interface FormProps {
  onSubmit: () => void;
  children: React.ReactNode;
  error?: string | null;
  classNames?: string;
}

export const Form = ({ onSubmit, children, error, classNames }: FormProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form className={clsx(styles.form, classNames)} onSubmit={handleSubmit}>
      {children}
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
};

export default Form;
