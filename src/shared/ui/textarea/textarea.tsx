import React, { useId } from 'react';
import styles from './textarea.module.css';
import type { TextAreaProps } from './types';
import clsx from 'clsx';

export const TextAreaUI: React.FC<TextAreaProps> = ({
  value,
  maxLength,
  onChange,
  onBlur,
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
  className = '',
  leftIcon,
  rightIcon,
  onLeftIconClick,
  onRightIconClick,
  showLeftIcon = false,
  showRightIcon = false,
  ...rest
}) => {
  const generatedId = useId();
  const inputId = id || `input-${generatedId}`;

  return (
    <div className={clsx(styles.wrapper, className)}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}

      <div className={styles.textareaWrapper}>
        {leftIcon && showLeftIcon && (
          <div
            className={clsx(styles.icon, styles.rightIcon, {
              [styles.clickable]: onLeftIconClick,
            })}
            onClick={onLeftIconClick}
          >
            {leftIcon}
          </div>
        )}

        <textarea
          id={inputId}
          name={name}
          value={value}
          maxLength={maxLength}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          autoFocus={autoFocus}
          className={clsx(styles.textarea, {
            [styles.error]: error,
            [styles.success]: success,
            [styles.disabled]: disabled,
            [styles.withLeftIcon]: leftIcon && showLeftIcon,
            [styles.withRightIcon]: rightIcon && showRightIcon,
          })}
          {...rest}
        ></textarea>

        {rightIcon && showRightIcon && (
          <div
            className={clsx(styles.icon, styles.rightIcon, {
              [styles.clickable]: onRightIconClick,
            })}
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
