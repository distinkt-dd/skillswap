import type React from 'react';
import styles from './Avatar.module.css';
import clsx from 'clsx';
import { Button } from '../button';
import { IconUI } from '../icons';

interface AvatarProps {
  src?: string;
  size: 'small' | 'medium' | 'large';
  onClick?: () => void;
  avatarChangeBtnClick?: () => void;
  className?: string;
  editable?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  size,
  onClick,
  avatarChangeBtnClick,
  className,
  editable,
}) => {
  const getSizeClass = (size: string) => {
    switch (size) {
      case 'small':
        return styles.smallSize;
      case 'medium':
        return styles.mediumSize;
      case 'large':
        return styles.largeSize;
      default:
        return styles.mediumSize;
    }
  };
  if (editable)
    return (
      <div className={styles.avatarContainer}>
        <img
          src={src}
          alt="Avatar"
          className={clsx(getSizeClass(size), styles.avatar, className)}
          onClick={onClick}
          style={{ borderRadius: '50%' }}
        />
        <Button className={styles.avatarButton} onClick={avatarChangeBtnClick}>
          {<IconUI name="refresh" />}
        </Button>
      </div>
    );

  return (
    <img
      src={src}
      alt="Avatar"
      className={clsx(getSizeClass(size), styles.avatar, className)}
      onClick={onClick}
      style={{ borderRadius: '50%' }}
    />
  );
};
