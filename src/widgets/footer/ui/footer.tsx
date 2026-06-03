import { Logo } from '@shared/index';
import clsx from 'clsx';
import React from 'react';
import styles from './footer.module.css';
// import { NavLink } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={clsx(styles.container, 'container')}>
        <div className={styles.leftColumn}>
          <Logo />
          <span className={styles.copiright}>SkillSwap - 2026</span>
        </div>
        <div className={styles.content}>
          <ul className={styles.linksList}>
            {/*<li className={styles.link}>
            <NavLink to="/about">О проекте</NavLink>
          </li>*/}
            <li className={styles.link}>
              <a href="#null">О проекте</a>
            </li>
            <li className={styles.link}>
              <a href="#null">Контакты</a>
            </li>
            <li className={styles.link}>
              <a href="#null">Политика конфиденциальности</a>
            </li>
            {/*li className={styles.link}>
            <NavLink to="/skills/all">Все навыки</NavLink>
          </li> */}
            <li className={styles.link}>
              <a href="#null">Все навыки</a>
            </li>
            <li className={styles.link}>
              <a href="#null">Блог</a>
            </li>
            <li className={styles.link}>
              <a href="#null">Пользовательское соглашение</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};
