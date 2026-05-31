import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TextAreaUI } from './textarea';

describe('TextAreaUI', () => {
  it('отрисовывает label и placeholder', () => {
    render(<TextAreaUI label="О себе" placeholder="Введите описание" />);

    expect(screen.getByLabelText('О себе')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Введите описание')).toBeInTheDocument();
  });

  it('обновляет значение и вызывает onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<TextAreaUI label="О себе" onChange={onChange} />);

    const textarea = screen.getByLabelText('О себе');

    await user.type(textarea, 'Текст');

    expect(textarea).toHaveValue('Текст');
    expect(onChange).toHaveBeenCalled();
  });

  it('показывает error или hint', () => {
    const { rerender } = render(
      <TextAreaUI label="О себе" error="Поле обязательно" hint="До 200 символов" />
    );

    expect(screen.getByText('Поле обязательно')).toBeInTheDocument();
    expect(screen.queryByText('До 200 символов')).not.toBeInTheDocument();

    rerender(<TextAreaUI label="О себе" hint="До 200 символов" />);

    expect(screen.getByText('До 200 символов')).toBeInTheDocument();
  });

  it('обрабатывает клики по левой и правой иконке', async () => {
    const user = userEvent.setup();
    const onLeftIconClick = vi.fn();
    const onRightIconClick = vi.fn();

    render(
      <TextAreaUI
        leftIcon={<span data-testid="left-icon">L</span>}
        rightIcon={<span data-testid="right-icon">R</span>}
        showLeftIcon
        showRightIcon
        onLeftIconClick={onLeftIconClick}
        onRightIconClick={onRightIconClick}
      />
    );

    await user.click(screen.getByTestId('left-icon'));
    await user.click(screen.getByTestId('right-icon'));

    expect(onLeftIconClick).toHaveBeenCalledTimes(1);
    expect(onRightIconClick).toHaveBeenCalledTimes(1);
  });
});
