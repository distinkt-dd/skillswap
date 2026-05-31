import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { Logo } from './logo';

describe('Logo', () => {
  it('отрисовывает статический блок, если нет href', () => {
    render(<Logo />);

    expect(screen.getByText('SkillSwap')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('отрисовывает обычную ссылку при linkType="a"', () => {
    render(<Logo href="/home" linkType="a" caption="На главную" />);

    const link = screen.getByRole('link', { name: 'На главную' });

    expect(link).toHaveAttribute('href', '/home');
  });

  it('отрисовывает ссылку роутера при linkType="link"', () => {
    render(
      <MemoryRouter>
        <Logo href="/profile" linkType="link" caption="Профиль" />
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: 'Профиль' });

    expect(link).toHaveAttribute('href', '/profile');
  });

  it('отрисовывает навигационную ссылку при linkType="navlink"', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Logo href="/dashboard" linkType="navlink" caption="Панель управления" />
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: 'Панель управления' });

    expect(link).toHaveAttribute('href', '/dashboard');
  });
});
