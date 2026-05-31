import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Toggler } from './toggler';

describe('Toggler', () => {
  it('отрисовывает переключатель с меткой', () => {
    render(<Toggler label="Тёмный режим" />);

    expect(screen.getByLabelText('Тёмный режим')).toBeInTheDocument();
  });

  it('переключает состояние по клику', async () => {
    const user = userEvent.setup();

    render(<Toggler label="Тёмный режим" />);

    const toggler = screen.getByRole('checkbox');

    expect(toggler).not.toBeChecked();

    await user.click(toggler);

    expect(toggler).toBeChecked();
  });

  it('отрисовывает недоступный переключатель', () => {
    render(<Toggler label="Недоступный переключатель" disabled />);

    expect(screen.getByRole('checkbox')).toBeDisabled();
  });
});
