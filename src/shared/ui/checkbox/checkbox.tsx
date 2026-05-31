import React from 'react';
import styles from './checkbox.module.css';

export type CheckboxProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: React.ReactNode;
  isSubcategory?: boolean;
};

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  isSubcategory = false,
  className = '',
  id,
  disabled,
  ...inputProps
}) => {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  const classNames = [
    styles.root,
    disabled && styles.disabled,
    isSubcategory && styles.subcategory,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <label htmlFor={inputId} className={classNames}>
      <input
        id={inputId}
        type="checkbox"
        disabled={disabled}
        className={styles.input}
        {...inputProps}
      />
      <span aria-hidden="true" className={styles.control}>
        <span className={styles.icon} />
      </span>
      {label ? <span className={styles.label}>{label}</span> : null}
    </label>
  );
};
