import React from 'react';
import { useState, useRef, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import styles from './Dropdown.module.css';
import { Checkbox } from '../checkbox';
import arrowIcon from '../../assets/icons/chevron-down.svg?url';
import closeIcon from '../../assets/icons/cross.svg?url';

export type DropdownOption = {
  id: string | number;
  name: string;
};

export type DropdownProps = {
  /** Список опций */
  options: DropdownOption[];
  /** Выбранное значение (для single mode) */
  name?: string;
  value?: DropdownOption | null;
  /** Выбранные значения (для multi mode) */
  values?: DropdownOption[];
  /** Колбэк при выборе (для single mode) */
  onChange?: (option: DropdownOption | null) => void;
  /** Колбэк при выборе (для multi mode) */
  onValuesChange?: (options: DropdownOption[]) => void;
  /** Подпись над полем */
  label?: string;
  /** Плейсхолдер */
  placeholder?: string;
  /** Тип дропдауна */
  variant?: 'arrow' | 'clearable';
  /** Режим выбора */
  mode?: 'single' | 'multi';
  /** Отключен ли компонент */
  disabled?: boolean;
  /** Дополнительный CSS класс */
  className?: string;
  /** Включить поиск */
  searchable?: boolean;
  error?: string;
};

export const Dropdown = ({
  options,
  value,
  values = [],
  onChange,
  onValuesChange,
  label,
  placeholder = 'Выберите',
  variant = 'arrow',
  mode = 'single',
  disabled = false,
  className,
  searchable = false,
  error,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLUListElement>(null);
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;

    const searchLower = searchTerm.toLowerCase();
    return options.filter((opt) => opt.name.toLowerCase().includes(searchLower));
  }, [options, searchTerm]);

  const displayText = useMemo(() => {
    if (mode === 'single') {
      return value ? value.name : '';
    } else {
      if (values.length === 0) return '';
      if (values.length === 1) return values[0].name;
      return `Выбрано: ${values.length}`;
    }
  }, [mode, value, values]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchable && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const updateThumbPosition = () => {
    if (!contentContainerRef.current || !thumbRef.current || !contentRef.current) return;

    const container = contentContainerRef.current;
    const thumb = thumbRef.current;
    const content = contentRef.current;

    const scrollHeight = content.scrollHeight;
    const clientHeight = container.clientHeight;

    if (scrollHeight <= clientHeight) {
      thumb.style.display = 'none';
      return;
    }

    thumb.style.display = 'block';

    const scrollTop = container.scrollTop;
    const scrollRatio = scrollTop / (scrollHeight - clientHeight);
    const maxThumbTop = clientHeight - 40;
    const thumbTop = scrollRatio * maxThumbTop;

    thumb.style.top = `${thumbTop}px`;
  };

  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!contentContainerRef.current || !thumbRef.current) return;

    isDraggingRef.current = true;
    const container = contentContainerRef.current;
    const startY = e.clientY;
    const startTop = parseInt(thumbRef.current.style.top || '0');

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !container || !thumbRef.current || !contentRef.current) return;

      e.preventDefault();

      const deltaY = e.clientY - startY;
      const containerHeight = container.clientHeight;
      const content = contentRef.current;

      const scrollHeight = content.scrollHeight;
      const clientHeight = container.clientHeight;

      if (scrollHeight <= clientHeight) return;

      const maxThumbTop = containerHeight - 40;
      let newTop = startTop + deltaY;
      newTop = Math.max(0, Math.min(maxThumbTop, newTop));

      thumbRef.current.style.top = `${newTop}px`;

      const scrollRatio = newTop / maxThumbTop;
      const scrollTop = scrollRatio * (scrollHeight - clientHeight);
      container.scrollTop = scrollTop;
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    if (!isOpen || !contentContainerRef.current || !contentRef.current) return;

    const container = contentContainerRef.current;

    const handleScroll = () => {
      updateThumbPosition();
    };

    container.addEventListener('scroll', handleScroll);

    updateThumbPosition();

    const observer = new ResizeObserver(() => {
      updateThumbPosition();
    });

    observer.observe(contentRef.current);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [isOpen, filteredOptions]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchTerm('');
      }
    }
  };

  const handleSelect = (option: DropdownOption) => {
    if (mode === 'single') {
      onChange?.(option);
      setIsOpen(false);
      setSearchTerm('');
    } else {
      const isSelected = values.some((v) => v.id === option.id);
      let newValues: DropdownOption[];

      if (isSelected) {
        newValues = values.filter((v) => v.id !== option.id);
      } else {
        newValues = [...values, option];
      }

      onValuesChange?.(newValues);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (mode === 'single') {
      onChange?.(null);
    } else {
      onValuesChange?.([]);
    }
    setSearchTerm('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) {
      setIsOpen(true);
    }
  };

  const isSelected = (option: DropdownOption) => {
    if (mode === 'single') {
      return value?.id === option.id;
    } else {
      return values.some((v) => v.id === option.id);
    }
  };

  return (
    <div ref={containerRef} className={clsx(styles.container, className)}>
      {label && <label className={styles.label}>{label}</label>}

      <div className={styles.dropdownWrapper}>
        <div
          className={clsx(styles.inputWrapper, {
            [styles.open]: isOpen,
            [styles.disabled]: disabled,
          })}
        >
          {searchable ? (
            <input
              ref={inputRef}
              type="text"
              className={styles.input}
              value={searchTerm}
              onChange={handleInputChange}
              onClick={handleInputClick}
              placeholder={displayText || placeholder}
              disabled={disabled}
            />
          ) : (
            <button
              type="button"
              className={styles.triggerButton}
              onClick={handleToggle}
              disabled={disabled}
            >
              {displayText ? (
                <span className={styles.value}>{displayText}</span>
              ) : (
                <span className={styles.placeholder}>{placeholder}</span>
              )}
            </button>
          )}
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.icons}>
            {variant === 'clearable' &&
              ((mode === 'single' && value) || (mode === 'multi' && values.length > 0)) && (
                <button
                  type="button"
                  className={styles.clearButton}
                  onClick={handleClear}
                  aria-label="Очистить"
                >
                  <img src={closeIcon} alt="close" />
                </button>
              )}

            {!(
              variant === 'clearable' &&
              ((mode === 'single' && value) || (mode === 'multi' && values.length > 0))
            ) && (
              <span
                className={clsx(styles.arrow, { [styles.open]: isOpen })}
                onClick={handleToggle}
              >
                <img src={arrowIcon} alt="arrow" />
              </span>
            )}
          </div>
        </div>

        {isOpen && (
          <div className={styles.dropdown}>
            <div ref={contentContainerRef} className={styles.dropdownContent}>
              <ul ref={contentRef} className={styles.optionsList}>
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <li
                      key={option.id}
                      className={clsx(styles.option, {
                        [styles.selected]: isSelected(option),
                      })}
                      onClick={() => mode === 'single' && handleSelect(option)}
                    >
                      {mode === 'multi' && (
                        <Checkbox
                          checked={isSelected(option)}
                          onChange={() => handleSelect(option)}
                          label={option.name}
                        />
                      )}
                      {mode === 'single' && (
                        <span className={styles.optionName}>{option.name}</span>
                      )}
                    </li>
                  ))
                ) : (
                  <li className={clsx(styles.option, styles.noResults)}>Ничего не найдено</li>
                )}
              </ul>
            </div>
            <div className={styles.customScrollbar}>
              <div
                ref={thumbRef}
                className={styles.customScrollbarThumb}
                onMouseDown={handleThumbMouseDown}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
