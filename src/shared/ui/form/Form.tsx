import React from 'react';
import styles from './Form.module.css';
import clsx from 'clsx';

export interface FormProps {
  onSubmit: () => void;
  children: React.ReactNode;
  error?: string | null;
}

export const Form = ({ onSubmit, children, error }: FormProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form className={clsx(styles.form)} onSubmit={handleSubmit}>
      {children}
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
};

export default Form;
