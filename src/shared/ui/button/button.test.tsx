import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './button';

describe('Button', () => {
  it('отрисовывает кнопку и обрабатывает клик', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button onClick={onClick} type="submit">
        Сохранить
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Сохранить' });

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'submit');

    await user.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('отключается при disabled или loading', () => {
    const { rerender } = render(<Button disabled>Отключена</Button>);

    expect(screen.getByRole('button', { name: 'Отключена' })).toBeDisabled();

    rerender(<Button loading>Загружается</Button>);

    expect(screen.getByRole('button', { name: 'Загружается' })).toBeDisabled();
  });

  it('отрисовывает ссылку, если передан href', () => {
    render(<Button href="/profile">Профиль</Button>);

    const link = screen.getByRole('link', { name: 'Профиль' });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/profile');
  });

  it('отрисовывает левую и правую иконку', () => {
    const { rerender } = render(
      <Button icon={<span data-testid="left-icon">L</span>} iconPosition="left">
        Текст
      </Button>
    );

    expect(screen.getByTestId('left-icon')).toBeInTheDocument();

    rerender(
      <Button icon={<span data-testid="right-icon">R</span>} iconPosition="right">
        Текст
      </Button>
    );

    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });
});
