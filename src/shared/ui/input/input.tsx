import React, { useId } from 'react';
import styles from './input.module.css';
import type { InputProps } from './types';

export const Input: React.FC<InputProps> = ({
  value,
  onChange,
  onBlur,
  type = 'text',
  name,
  id,
  placeholder,
  disabled = false,
  readOnly = false,
  required = false,
  autoFocus = false,
  label,
  error,
  success,
  hint,
  variant = 'default',
  fullWidth = false,
  className = '',
  leftIcon,
  rightIcon,
  onLeftIconClick,
  onRightIconClick,
  showLeftIcon = true,
  showRightIcon = true,
  ...rest
}) => {
  const generatedId = useId();
  const inputId = id || `input-${generatedId}`;

  const wrapperClasses = [styles.wrapper, fullWidth && styles.fullWidth, className]
    .filter(Boolean)
    .join(' ');

  const inputClasses = [
    styles.input,
    variant && styles[variant],
    error && styles.error,
    success && styles.success,
    disabled && styles.disabled,
    leftIcon && showLeftIcon && styles.withLeftIcon,
    rightIcon && showRightIcon && styles.withRightIcon,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClasses}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}

      <div className={styles.inputWrapper}>
        {leftIcon && showLeftIcon && (
          <div
            className={`${styles.icon} ${styles.leftIcon} ${onLeftIconClick ? styles.clickable : ''}`}
            onClick={onLeftIconClick}
          >
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          type={variant === 'search' ? 'text' : type}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          autoFocus={autoFocus}
          className={inputClasses}
          {...rest}
        />

        {rightIcon && showRightIcon && (
          <div
            className={`${styles.icon} ${styles.rightIcon} ${onRightIconClick ? styles.clickable : ''}`}
            onClick={onRightIconClick}
          >
            {rightIcon}
          </div>
        )}
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {hint && !error && <div className={styles.hint}>{hint}</div>}
    </div>
  );
};
