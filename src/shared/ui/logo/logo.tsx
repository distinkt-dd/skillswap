import { IconUI } from '@shared/index';
import { Link, NavLink } from 'react-router-dom';
import styles from './logo.module.css';
import type { IconName } from '../icons/types';

export interface LogoProps {
  caption?: string;
  iconName?: IconName;
  iconSize?: number;
  href?: string;
  linkType?: 'a' | 'link' | 'navlink';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  caption = 'SkillSwap',
  href,
  className = '',
  iconName = 'logo',
  iconSize = 40,
  linkType = 'a',
  ...rest
}) => {
  const content = (
    <>
      <span className={styles.image}>
        <IconUI name={iconName} size={iconSize} />
      </span>
      {caption && <span className={styles.caption}>{caption}</span>}
    </>
  );

  if (!href) {
    return (
      <div className={`${styles.logo} ${className}`} {...rest}>
        {content}
      </div>
    );
  }

  switch (linkType) {
    case 'navlink':
      return (
        <NavLink
          to={href}
          className={({ isActive }) =>
            `${styles.logo} ${className} ${isActive ? styles.active : ''}`
          }
          {...rest}
        >
          {content}
        </NavLink>
      );

    case 'link':
      return (
        <Link to={href} className={`${styles.logo} ${className}`} {...rest}>
          {content}
        </Link>
      );

    case 'a':
    default:
      return (
        <a href={href} className={`${styles.logo} ${className}`} {...rest}>
          {content}
        </a>
      );
  }
};
