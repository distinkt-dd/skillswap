import { NavAside } from '@widgets/navAside';
import { LayoutAuth } from '../layout-auth';
import type { FC, ReactNode } from 'react';
import styles from './LayoutProfile.module.css';
import clsx from 'clsx';

interface ILayoutProfileProps {
  children: ReactNode;
}

export const LayoutProfile: FC<ILayoutProfileProps> = ({ children }: ILayoutProfileProps) => {
  return (
    <LayoutAuth>
      <section className={clsx(styles.profileSection)}>
        <div className={clsx('container', styles.layoutProfile)}>
          <NavAside />
          <div className={clsx(styles.content)}>{children}</div>
        </div>
      </section>
    </LayoutAuth>
  );
};
