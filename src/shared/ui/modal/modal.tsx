import type { FC, ReactNode } from 'react';
import { memo, useEffect } from 'react';
import { createPortal } from 'react-dom';

import styles from './modal.module.css';

export type TModalUIProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  modalClassName?: string;
  overlayClassName?: string;
};

export const Modal: FC<TModalUIProps> = memo(
  ({ isOpen, onClose, children, modalClassName, overlayClassName }) => {
    useEffect(() => {
      if (!isOpen) return;

      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };

      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleEsc);
        document.body.style.overflow = 'visible';
      };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const modalClass = modalClassName
      ? `${styles.modal} ${modalClassName}`
      : `${styles.modal} ${styles.modalDefault}`;

    const overlayClass = overlayClassName
      ? `${styles.overlay} ${overlayClassName}`
      : styles.overlay;

    return createPortal(
      <div className={overlayClass} onClick={onClose}>
        <div className={modalClass} onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>,
      document.body
    );
  }
);
