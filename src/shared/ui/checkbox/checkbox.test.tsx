import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  it('отрисовывает чекбокс с меткой', () => {
    render(<Checkbox label="Принять условия" />);

    expect(screen.getByLabelText('Принять условия')).toBeInTheDocument();
  });

  it('переключает состояние по клику', async () => {
    const user = userEvent.setup();

    render(<Checkbox label="Принять условия" />);

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  it('отрисовывает недоступный чекбокс', () => {
    render(<Checkbox label="Недоступный чекбокс" disabled />);

    expect(screen.getByRole('checkbox')).toBeDisabled();
  });
});
