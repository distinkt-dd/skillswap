import type { FC, ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

import styles from './sidebar-item.module.css';

export type TSidebarItemUIProps = {
  to: string;
  icon: ReactNode;
  label: string;
};

export const SidebarItem: FC<TSidebarItemUIProps> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ''}`}
    >
      <span className={styles.icon}>{icon}</span>
      <span className={styles.label}>{label}</span>
    </NavLink>
  );
};
