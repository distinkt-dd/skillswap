import React from 'react';
import styles from './radio.module.css';

export type RadioProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: React.ReactNode;
};

export const Radio: React.FC<RadioProps> = ({
  label,
  className = '',
  id,
  disabled,
  ...inputProps
}) => {
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  const classNames = [styles.root, disabled && styles.disabled, className]
    .filter(Boolean)
    .join(' ');

  return (
    <label htmlFor={inputId} className={classNames}>
      <input
        id={inputId}
        type="radio"
        disabled={disabled}
        className={styles.input}
        {...inputProps}
      />
      <span aria-hidden="true" className={styles.control}>
        <span className={styles.dot} />
      </span>
      {label ? <span className={styles.label}>{label}</span> : null}
    </label>
  );
};
