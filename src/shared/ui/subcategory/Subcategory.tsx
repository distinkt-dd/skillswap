import styles from './Subcategory.module.css';
import React from 'react';
import '../../../index.css';

export type TSubcategoryProps = {
  type: 'business' | 'languages' | 'creative' | 'education' | 'home' | 'health' | 'other';
  title: string;
  icon?: React.ReactNode;
};

export const Subcategory: React.FC<TSubcategoryProps> = (props: TSubcategoryProps) => {
  const { title, type, icon } = props;
  const getTagClass = (type: string) => {
    switch (type) {
      case 'business':
        return styles.tagBusiness;
      case 'creative':
        return styles.tagCreative;
      case 'languages':
        return styles.tagLanguages;
      case 'education':
        return styles.tagEducation;
      case 'home':
        return styles.tagHome;
      case 'health':
        return styles.tagHealth;
      default:
        return styles.tagOther;
    }
  };

  return (
    <>
      {icon ? (
        <div className={`${styles.subcategoryIcon} ${getTagClass(type)}`}>{icon}</div>
      ) : (
        <div className={`${styles.subcategory} ${getTagClass(type)}`}>
          <p>{title}</p>
        </div>
      )}
    </>
  );
};
