import type { FC } from 'react';
import styles from './CardSkeleton.module.css';

export const CardSkeleton: FC = () => {
  return (
    <div className={styles.skeleton}>
      <div className={styles.header}>
        <div className={styles.avatar}></div>
        <div className={styles.info}>
          <div className={styles.name}></div>
          <div className={styles.meta}></div>
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionTitle}></div>
        <div className={styles.tags}>
          <div className={styles.tag}></div>
          <div className={styles.tag}></div>
          <div className={styles.tag}></div>
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionTitle}></div>
        <div className={styles.tags}>
          <div className={styles.tag}></div>
          <div className={styles.tag}></div>
          <div className={styles.tag}></div>
        </div>
      </div>
      <div className={styles.button}></div>
    </div>
  );
};
