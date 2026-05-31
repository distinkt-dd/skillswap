import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Notification } from './notification';

describe('Notification', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('отрисовывает popup и закрывается по кнопке', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<Notification userName="Иван" type="offer" onClose={onClose} autoHideDuration={0} />);

    expect(screen.getByText('Иван предлагает вам обмен')).toBeInTheDocument();
    expect(screen.getByText('Примите обмен, чтобы обсудить детали')).toBeInTheDocument();

    await user.click(screen.getByRole('button'));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Иван предлагает вам обмен')).not.toBeInTheDocument();
  });

  it('отрисовывает list-вариант с timestamp и кнопкой действия', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();

    render(
      <Notification
        userName="Алексей"
        type="accept"
        variant="list"
        timestamp="сегодня"
        onAction={onAction}
      />
    );

    expect(screen.getByText('Алексей принял ваш обмен')).toBeInTheDocument();
    expect(screen.getByText('Перейдите в профиль, чтобы обсудить детали')).toBeInTheDocument();
    expect(screen.getByText('сегодня')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Перейти' }));

    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('показывает кнопку действия в popup после наведения', () => {
    const onAction = vi.fn();

    const { container } = render(
      <Notification
        userName="Олег"
        type="reject"
        onAction={onAction}
        onClose={vi.fn()}
        autoHideDuration={0}
      />
    );

    expect(screen.queryByRole('button', { name: 'Перейти' })).not.toBeInTheDocument();

    fireEvent.mouseEnter(container.firstElementChild as HTMLElement);
    fireEvent.click(screen.getByRole('button', { name: 'Перейти' }));

    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('автоматически скрывается по таймеру', () => {
    vi.useFakeTimers();

    const onClose = vi.fn();

    render(
      <Notification userName="Мария" type="message" onClose={onClose} autoHideDuration={1000} />
    );

    expect(screen.getByText('Мария предлагает вам обмен')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Мария предлагает вам обмен')).not.toBeInTheDocument();
  });

  it('скрывает кнопку действия после ухода курсора', () => {
    const { container } = render(
      <Notification
        userName="Олег"
        type="reject"
        onAction={vi.fn()}
        onClose={vi.fn()}
        autoHideDuration={0}
      />
    );

    fireEvent.mouseEnter(container.firstElementChild as HTMLElement);
    expect(screen.getByRole('button', { name: 'Перейти' })).toBeInTheDocument();

    fireEvent.mouseLeave(container.firstElementChild as HTMLElement);
    expect(screen.queryByRole('button', { name: 'Перейти' })).not.toBeInTheDocument();
  });
});
