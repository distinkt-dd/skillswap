import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Input } from './input';

describe('Input', () => {
  it('отрисовывает метку и связывает её с полем ввода', () => {
    render(<Input id="email" label="Email" value="" onChange={() => undefined} />);

    const input = screen.getByLabelText('Email');

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'email');
  });

  it('показывает подсказку, если нет ошибки', () => {
    render(<Input value="" onChange={() => undefined} hint="Используйте действующий email" />);

    expect(screen.getByText('Используйте действующий email')).toBeInTheDocument();
  });

  it('показывает ошибку и скрывает подсказку', () => {
    render(
      <Input
        value=""
        onChange={() => undefined}
        hint="Используйте действующий email"
        error="Введите email"
      />
    );

    expect(screen.getByText('Введите email')).toBeInTheDocument();
    expect(screen.queryByText('Используйте действующий email')).not.toBeInTheDocument();
  });

  it('использует type="text" для варианта search', () => {
    render(<Input variant="search" type="password" value="" onChange={() => undefined} />);

    const input = screen.getByRole('textbox');

    expect(input).toHaveAttribute('type', 'text');
  });

  it('вызывает обработчики клика по левой и правой иконке', async () => {
    const user = userEvent.setup();
    const onLeftIconClick = vi.fn();
    const onRightIconClick = vi.fn();

    render(
      <Input
        value=""
        onChange={() => undefined}
        leftIcon={<span data-testid="left-icon">L</span>}
        rightIcon={<span data-testid="right-icon">R</span>}
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
