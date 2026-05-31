import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Form } from './ Form';

describe('Form', () => {
  it('отрисовывает children', () => {
    render(
      <Form onSubmit={vi.fn()}>
        <button type="submit">Отправить</button>
      </Form>
    );

    expect(screen.getByRole('button', { name: 'Отправить' })).toBeInTheDocument();
  });

  it('вызывает onSubmit при отправке формы', () => {
    const onSubmit = vi.fn();

    render(
      <Form onSubmit={onSubmit}>
        <button type="submit">Отправить</button>
      </Form>
    );

    screen.getByRole('button', { name: 'Отправить' }).click();

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('показывает текст ошибки, если передан error', () => {
    render(
      <Form onSubmit={vi.fn()} error="Ошибка отправки">
        <button type="submit">Отправить</button>
      </Form>
    );

    expect(screen.getByText('Ошибка отправки')).toBeInTheDocument();
  });

  it('не показывает ошибку, если error не передан', () => {
    render(
      <Form onSubmit={vi.fn()}>
        <button type="submit">Отправить</button>
      </Form>
    );

    expect(screen.queryByText('Ошибка отправки')).not.toBeInTheDocument();
  });
});
