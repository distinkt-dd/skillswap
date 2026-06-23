import { clearUser } from '@entities/user';
import { useDispatch } from '@shared/store';
import { IconUI } from '@shared/ui';
import type { FC, RefObject } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './user-menu.module.css';

export type TUserMenu = {
  refMenu: RefObject<HTMLDivElement | null>;
};

export const UserMenu: FC<TUserMenu> = ({ refMenu }) => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(clearUser());
  };

  return (
    <div ref={refMenu} className={styles.accountMenu}>
      <ul className={styles.accountMenu__list}>
        <li>
          <NavLink to={'/profile'} className={styles.accountMenu__item}>
            <IconUI name="userCircle" className={styles.accountMenu__icon} />
            <span>Личный кабинет</span>
          </NavLink>
        </li>
        <li>
          <button className={styles.accountMenu__item} onClick={handleLogout}>
            <IconUI name="logout" className={styles.accountMenu__icon} />
            <span>Выйти из аккаунта</span>
          </button>
        </li>
      </ul>
    </div>
  );
};
