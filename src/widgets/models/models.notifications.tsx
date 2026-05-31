import React from 'react';
import styles from './models.module.css';
import { DoneIcon, NotificationIcon, UserCircleIcon } from '@shared/assets/index.ts';
import { Button } from '@shared/index';
import { Modal } from '@shared/ui/modal';
import { useNavigate } from 'react-router-dom';

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  type: 'success' | 'info' | 'exchange' | 'registration' | 'dataChange';
  onButtonClick?: () => void;
  setOpen?: (isOpen: boolean) => void;
}

export const ModalInfo: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  type,
  onButtonClick,
  setOpen,
}) => {
  const navigation = useNavigate();
  if (!isOpen) return null;

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    }
    onClose?.();
  };

  const handleLoginButton = () => {
    navigation('/login');
    setOpen?.(!isOpen);
  };

  const handleRegistrationButton = () => {
    navigation('/registration');
    setOpen?.(!isOpen);
  };

  const iconMap = {
    success: NotificationIcon,
    info: DoneIcon,
    exchange: UserCircleIcon,
    registration: UserCircleIcon,
    dataChange: NotificationIcon,
  };

  const title = {
    success: 'Вы предложили обмен',
    info: 'Ваше предложение создано',
    exchange: 'Ваше предложение создано',
    registration: 'Вы не вошли в в аккаунт',
    dataChange: 'Данные изменены',
  };

  const description = {
    success: 'Теперь дождитесь подтверждения. Вам придёт уведомление',
    info: 'Теперь вы можете предложить обмен',
    exchange: 'Теперь вы можете предложить обмен',
    registration: 'Войдите в аккаунт, чтобы продолжить',
    dataChange: 'Ваши данные успешно изменены',
  };

  const IconComponent = iconMap[type];

  return (
    <Modal onClose={handleButtonClick} isOpen>
      <div className={styles.content}>
        <div className={styles.icon}>
          <IconComponent />
        </div>
        <div className={styles.info}>
          <div className={styles.text}>
            <h2 className={styles.title}>{title[type]}</h2>
            <p className={styles.description}>{description[type]}</p>
          </div>
          {type === 'registration' ? (
            <div className={styles.btnWrapper}>
              <Button onClick={handleLoginButton}>Войти</Button>
              <Button onClick={handleRegistrationButton} variant="secondary">
                Зарегистрироваться
              </Button>
            </div>
          ) : (
            <Button onClick={handleButtonClick}>Готово</Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ModalInfo;
