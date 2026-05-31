import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { SidebarItem } from './sidebar-item';

describe('SidebarItem', () => {
  it('отрисовывает ссылку, иконку и label', () => {
    render(
      <MemoryRouter>
        <SidebarItem
          to="/profile"
          icon={
            <span data-testid="icon" aria-hidden="true">
              I
            </span>
          }
          label="Профиль"
        />
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: 'Профиль' });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/profile');
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('помечает ссылку как активную на текущем маршруте', () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <SidebarItem to="/profile" icon={<span aria-hidden="true">I</span>} label="Профиль" />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Профиль' })).toHaveAttribute('aria-current', 'page');
  });

  it('не помечает ссылку как активную на другом маршруте', () => {
    render(
      <MemoryRouter initialEntries={['/settings']}>
        <SidebarItem to="/profile" icon={<span aria-hidden="true">I</span>} label="Профиль" />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Профиль' })).not.toHaveAttribute(
      'aria-current',
      'page'
    );
  });
});
