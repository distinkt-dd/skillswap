import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Radio } from './radio';

describe('Radio', () => {
  it('отрисовывает radio с label', () => {
    render(<Radio label="Онлайн" name="format" value="online" />);

    expect(screen.getByLabelText('Онлайн')).toBeInTheDocument();
  });

  it('выбирается по клику', async () => {
    const user = userEvent.setup();

    render(<Radio label="Онлайн" name="format" value="online" />);

    const radio = screen.getByLabelText('Онлайн');

    expect(radio).not.toBeChecked();

    await user.click(radio);

    expect(radio).toBeChecked();
  });

  it('не реагирует на клик, если disabled', async () => {
    const user = userEvent.setup();

    render(<Radio label="Онлайн" name="format" value="online" disabled />);

    const radio = screen.getByLabelText('Онлайн');

    expect(radio).toBeDisabled();

    await user.click(radio);

    expect(radio).not.toBeChecked();
  });
});
