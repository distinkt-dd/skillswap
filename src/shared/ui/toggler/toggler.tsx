import React from 'react';
import styles from './toggler.module.css';

export type TogglerProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: React.ReactNode;
};

export const Toggler: React.FC<TogglerProps> = ({
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
        type="checkbox"
        disabled={disabled}
        className={styles.input}
        {...inputProps}
      />
      <span aria-hidden="true" className={styles.track}>
        <span className={styles.thumb} />
      </span>
      {label ? <span className={styles.label}>{label}</span> : null}
    </label>
  );
};
