import type { FC, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@widgets/index';
import styles from './LayoutPure.module.css';
import { STORAGE_KEY } from '@widgets/register/ui';

interface LayoutPureProps {
  children: ReactNode;
}

export const LayoutPure: FC<LayoutPureProps> = ({ children }) => {
  const navigate = useNavigate();

  const handleClose = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    navigate('/');
  };

  return (
    <div className={styles.layout}>
      <Header variant="pure" onClose={handleClose} />
      <main className={styles.content}>{children}</main>
    </div>
  );
};
