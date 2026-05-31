import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Modal } from './modal';

describe('Modal', () => {
  it('не отрисовывает контент, если модальное окно закрыто', () => {
    render(
      <Modal isOpen={false} onClose={() => undefined}>
        <div>Контент модального окна</div>
      </Modal>
    );

    expect(screen.queryByText('Контент модального окна')).not.toBeInTheDocument();
  });

  it('отрисовывает контент и блокирует прокрутку страницы при открытии', () => {
    render(
      <Modal isOpen onClose={() => undefined}>
        <div>Контент модального окна</div>
      </Modal>
    );

    expect(screen.getByText('Контент модального окна')).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('вызывает onClose при нажатии клавиши Escape', () => {
    const onClose = vi.fn();

    render(
      <Modal isOpen onClose={onClose}>
        <div>Контент модального окна</div>
      </Modal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('вызывает onClose при клике вне модального окна и не закрывается при клике внутри', () => {
    const onClose = vi.fn();

    render(
      <Modal isOpen onClose={onClose}>
        <div>Контент модального окна</div>
      </Modal>
    );

    const content = screen.getByText('Контент модального окна');
    const modal = content.parentElement;
    const overlay = modal?.parentElement;

    expect(modal).not.toBeNull();
    expect(overlay).not.toBeNull();

    fireEvent.click(modal!);
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.click(overlay!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('восстанавливает прокрутку страницы при закрытии модального окна', () => {
    const { rerender } = render(
      <Modal isOpen onClose={() => undefined}>
        <div>Контент модального окна</div>
      </Modal>
    );

    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <Modal isOpen={false} onClose={() => undefined}>
        <div>Контент модального окна</div>
      </Modal>
    );

    expect(document.body.style.overflow).toBe('visible');
  });
});
