import { SidebarItem } from '@shared/ui/sidebar-item';
import { useAsideConfig } from '../lib/navAside.config';
import clsx from 'clsx';
import styles from './NavAside.module.css';

export const NavAside = () => {
  const { items } = useAsideConfig();
  return (
    <aside className={clsx(styles.aside)}>
      <ul className={clsx(styles.list)}>
        {items.map((item, index) => {
          return (
            <li key={index}>
              <SidebarItem to={item.to} label={item.label} icon={item.icon} />
            </li>
          );
        })}
      </ul>
    </aside>
  );
};
