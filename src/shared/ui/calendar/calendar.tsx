import React, { useId, useMemo, useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button, IconUI } from '@shared/ui';
import { getDaysInMonth, setMonth, setYear } from 'date-fns';
import { ru } from 'date-fns/locale/ru';
import styles from './calendar.module.css';

registerLocale('ru', ru);

const MONTHS_RU = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

type CalendarInputProps = {
  value?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  readOnly?: boolean;
  name?: string;
  id?: string;
};

const CalendarInput = React.forwardRef<HTMLInputElement, CalendarInputProps>(
  (
    { value, onClick, onChange, onBlur, onFocus, placeholder, label, disabled, readOnly, name, id },
    ref
  ) => (
    <div className={styles.field}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.inputWrapper}>
        <input
          ref={ref}
          id={id}
          name={name}
          className={styles.input}
          value={value ?? ''}
          onClick={onClick}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
        />
        <button
          type="button"
          className={styles.iconButton}
          onClick={onClick}
          disabled={disabled || readOnly}
          aria-label="Открыть календарь"
        >
          <IconUI name="calendar" size={24} />
        </button>
      </div>
    </div>
  )
);

CalendarInput.displayName = 'CalendarInput';

export type CalendarProps = {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  label?: string;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  width?: number | string;
  name?: string;
  id?: string;
  error?: string | undefined;
};

export const Calendar: React.FC<CalendarProps> = ({
  value,
  onChange,
  label,
  placeholder = 'дд.мм.гггг',
  minDate,
  maxDate,
  disabled = false,
  readOnly = false,
  className = '',
  width,
  name,
  id,
  error,
}) => {
  const generatedId = useId();
  const inputId = id ?? `calendar-${generatedId}`;

  const [internalValue, setInternalValue] = useState<Date | null>(value ?? null);
  const committedValue = value !== undefined ? value : internalValue;

  const [draftDate, setDraftDate] = useState<Date | null>(committedValue ?? null);
  const [isOpen, setIsOpen] = useState(false);
  const canInteract = !disabled && !readOnly;

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const startYear = minDate ? minDate.getFullYear() : currentYear - 100;
    const endYear = maxDate ? maxDate.getFullYear() : currentYear + 10;
    const result: number[] = [];
    for (let y = startYear; y <= endYear; y += 1) {
      result.push(y);
    }
    return result;
  }, [minDate, maxDate]);

  const commitDate = (date: Date | null) => {
    if (value === undefined) {
      setInternalValue(date);
    }
    onChange?.(date);
  };

  const getClampedDate = (baseDate: Date, nextDate: Date) => {
    const maxDay = getDaysInMonth(nextDate);
    const day = Math.min(baseDate.getDate(), maxDay);
    const result = new Date(nextDate);
    result.setDate(day);
    return result;
  };

  const handleCancel = () => {
    setDraftDate(committedValue ?? null);
    setIsOpen(false);
  };

  const handleSelect = () => {
    commitDate(draftDate ?? null);
    setIsOpen(false);
  };

  const CalendarContainer: React.FC<{ className?: string; children: React.ReactNode }> = ({
    className: containerClassName,
    children,
  }) => (
    <div className={`${styles.calendarContainer} ${containerClassName ?? ''}`}>
      {children}
      <div className={styles.footer}>
        <Button variant="secondary" onClick={handleCancel} width="100%">
          Отменить
        </Button>
        <Button variant="primary" onClick={handleSelect} width="100%">
          Выбрать
        </Button>
      </div>
    </div>
  );

  return (
    <div
      className={[styles.wrapper, className].filter(Boolean).join(' ')}
      style={{
        ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
      }}
    >
      <DatePicker
        selected={draftDate}
        onChange={(date: Date | null) => setDraftDate(date as Date | null)}
        open={isOpen}
        onInputClick={() => {
          if (canInteract) {
            setIsOpen(true);
          }
        }}
        onFocus={() => {
          if (canInteract) {
            setIsOpen(true);
          }
        }}
        onClickOutside={handleCancel}
        onCalendarOpen={() => setDraftDate(committedValue ?? null)}
        shouldCloseOnSelect={false}
        showPopperArrow={false}
        popperPlacement="bottom-start"
        locale="ru"
        dateFormat="dd.MM.yyyy"
        placeholderText={placeholder}
        minDate={minDate}
        maxDate={maxDate}
        disabled={disabled}
        readOnly={readOnly}
        popperClassName={styles.popper}
        calendarClassName={styles.calendar}
        calendarContainer={CalendarContainer}
        renderCustomHeader={({ date, changeMonth, changeYear }) => (
          <div className={styles.header}>
            <div className={styles.selectWrapper}>
              <select
                className={styles.select}
                value={date.getMonth()}
                onChange={(e) => {
                  const month = Number(e.target.value);
                  const baseDate = draftDate ?? date;
                  const nextDate = setMonth(baseDate, month);
                  setDraftDate(getClampedDate(baseDate, nextDate));
                  changeMonth(month);
                }}
              >
                {MONTHS_RU.map((month, index) => (
                  <option key={month} value={index}>
                    {month}
                  </option>
                ))}
              </select>
              <IconUI name="chevronDown" size={20} className={styles.selectIcon} />
            </div>
            <div className={styles.selectWrapper}>
              <select
                className={styles.select}
                value={date.getFullYear()}
                onChange={(e) => {
                  const year = Number(e.target.value);
                  const baseDate = draftDate ?? date;
                  const nextDate = setYear(baseDate, year);
                  setDraftDate(getClampedDate(baseDate, nextDate));
                  changeYear(year);
                }}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <IconUI name="chevronDown" size={20} className={styles.selectIcon} />
            </div>
          </div>
        )}
        customInput={
          <CalendarInput
            id={inputId}
            name={name}
            label={label}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
          />
        }
      />
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};
