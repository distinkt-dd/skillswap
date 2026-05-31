import type React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Calendar } from './calendar';

vi.mock('react-datepicker/dist/react-datepicker.css', () => ({}));

vi.mock('react-datepicker', async () => {
  const React = await import('react');

  type MockCustomInputProps = {
    value?: string;
    onClick?: () => void;
    onChange?: () => void;
    onFocus?: () => void;
    placeholder?: string;
    disabled?: boolean;
    readOnly?: boolean;
  };

  type MockDatePickerProps = {
    selected?: Date | null;
    customInput: React.ReactElement<MockCustomInputProps>;
    open?: boolean;
    onInputClick?: () => void;
    onFocus?: () => void;
    onChange?: (date: Date | null) => void;
    onClickOutside?: () => void;
    calendarContainer?: (props: {
      children: React.ReactNode;
      className?: string;
    }) => React.ReactNode;
    renderCustomHeader?: (props: {
      date: Date;
      changeMonth: (month: number) => void;
      changeYear: (year: number) => void;
    }) => React.ReactNode;
    placeholderText?: string;
    disabled?: boolean;
    readOnly?: boolean;
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const MockDatePicker = ({
    selected,
    customInput,
    open,
    onInputClick,
    onFocus,
    onChange,
    onClickOutside,
    calendarContainer,
    renderCustomHeader,
    placeholderText,
    disabled,
    readOnly,
  }: MockDatePickerProps) => {
    const input = React.cloneElement(customInput, {
      value: formatDate(selected),
      onClick: onInputClick,
      onChange: () => undefined,
      onFocus,
      placeholder: placeholderText,
      disabled,
      readOnly,
    });

    const content = (
      <div data-testid="mock-datepicker">
        {renderCustomHeader?.({
          date: selected ?? new Date(2024, 0, 15),
          changeMonth: vi.fn(),
          changeYear: vi.fn(),
        })}
        <button type="button" onClick={() => onChange?.(new Date(2024, 0, 15))}>
          Выбрать 15.01.2024
        </button>
        <button type="button" onClick={() => onChange?.(new Date(2024, 1, 20))}>
          Выбрать 20.02.2024
        </button>
        <button type="button" onClick={() => onClickOutside?.()}>
          Клик вне календаря
        </button>
      </div>
    );

    const wrapped = open
      ? calendarContainer
        ? calendarContainer({ children: content, className: 'mock-calendar' })
        : content
      : null;

    return (
      <div>
        {input}
        {wrapped}
      </div>
    );
  };

  return {
    default: MockDatePicker,
    registerLocale: vi.fn(),
  };
});

describe('Calendar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('отрисовывает метку и placeholder', () => {
    render(<Calendar label="Дата рождения" placeholder="дд.мм.гггг" />);

    expect(screen.getByLabelText('Дата рождения')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('дд.мм.гггг')).toBeInTheDocument();
  });

  it('открывает календарь по клику', async () => {
    const user = userEvent.setup();

    render(<Calendar label="Дата рождения" />);

    await user.click(screen.getByRole('button', { name: 'Открыть календарь' }));

    expect(screen.getByTestId('mock-datepicker')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Выбрать' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Отменить' })).toBeInTheDocument();
  });

  it('подтверждает выбранную дату в неконтролируемом режиме', async () => {
    const user = userEvent.setup();

    render(<Calendar label="Дата рождения" />);

    await user.click(screen.getByRole('button', { name: 'Открыть календарь' }));
    await user.click(screen.getByRole('button', { name: 'Выбрать 15.01.2024' }));
    await user.click(screen.getByRole('button', { name: 'Выбрать' }));

    expect(screen.getByLabelText('Дата рождения')).toHaveValue('15.01.2024');
  });

  it('вызывает onChange только после нажатия на кнопку "Выбрать"', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Calendar label="Дата рождения" onChange={onChange} value={null} />);

    await user.click(screen.getByRole('button', { name: 'Открыть календарь' }));
    await user.click(screen.getByRole('button', { name: 'Выбрать 20.02.2024' }));

    expect(onChange).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Выбрать' }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toEqual(new Date(2024, 1, 20));
  });

  it('не подтверждает черновик даты после нажатия на кнопку "Отменить"', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Calendar label="Дата рождения" onChange={onChange} value={null} />);

    await user.click(screen.getByRole('button', { name: 'Открыть календарь' }));
    await user.click(screen.getByRole('button', { name: 'Выбрать 15.01.2024' }));
    await user.click(screen.getByRole('button', { name: 'Отменить' }));

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.queryByTestId('mock-datepicker')).not.toBeInTheDocument();
  });

  it('не открывается, если disabled', async () => {
    const user = userEvent.setup();

    render(<Calendar label="Дата рождения" disabled />);

    await user.click(screen.getByRole('button', { name: 'Открыть календарь' }));

    expect(screen.queryByTestId('mock-datepicker')).not.toBeInTheDocument();
  });

  it('не открывается, если readOnly', async () => {
    const user = userEvent.setup();

    render(<Calendar label="Дата рождения" readOnly />);

    await user.click(screen.getByRole('button', { name: 'Открыть календарь' }));

    expect(screen.queryByTestId('mock-datepicker')).not.toBeInTheDocument();
  });

  it('отрисовывает текст ошибки', () => {
    render(<Calendar label="Дата рождения" error="Выберите дату" />);

    expect(screen.getByText('Выберите дату')).toBeInTheDocument();
  });

  it('открывает календарь при фокусе на input', async () => {
    const user = userEvent.setup();

    render(<Calendar label="Дата рождения" />);

    await user.tab();

    expect(screen.getByTestId('mock-datepicker')).toBeInTheDocument();
  });
});
