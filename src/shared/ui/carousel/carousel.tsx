import { useState, type FC, useMemo } from 'react';
import styles from './carousel.module.css';
import clsx from 'clsx';
import { IconUI } from '../icons';

export type TCarousel = {
  className?: string;
  images: (string | undefined)[];
};

export const CarouselUI: FC<TCarousel> = ({ className, images }) => {
  const validImages = useMemo(() => images.filter((img): img is string => !!img), [images]);
  const [stateImg, setStateImg] = useState(validImages);

  if (!validImages.length) {
    return null;
  }

  const handleForw = () => {
    setStateImg((prev) => {
      if (prev.length <= 1) return prev;
      return [...prev.slice(1), prev[0]];
    });
  };

  const handleBack = () => {
    setStateImg((prev) => {
      if (prev.length <= 1) return prev;
      const last = prev[prev.length - 1];
      const rest = prev.slice(0, -1);
      return [last, ...rest];
    });
  };

  const renderThumbnails = () => {
    const items = [];
    const total = stateImg.length;

    for (let i = 1; i <= 2 && i < total; i++) {
      const item = stateImg[i];
      if (!item) continue;

      items.push(
        <li key={`thumb-${i}`} className={styles.carouselItem}>
          <img src={item} alt={`Thumbnail ${i}`} />
        </li>
      );
    }

    if (total > 4) {
      const extraCount = total - 4;
      const lastItem = stateImg[3];
      if (lastItem) {
        items.push(
          <li key="extra" className={styles.carouselItem}>
            <span data-num={`+${extraCount}`} className={styles.fade}></span>
            <img src={lastItem} alt="More images" />
          </li>
        );
      }
    } else if (total === 4) {
      const fourthItem = stateImg[3];
      if (fourthItem) {
        items.push(
          <li key="fourth" className={styles.carouselItem}>
            <img src={fourthItem} alt="Thumbnail 4" />
          </li>
        );
      }
    }

    return items;
  };

  return (
    <div className={clsx(styles.carouselContainer, className)}>
      <div className={styles.carouselGeneral}>
        <button className={clsx(styles.btn, styles.left)} onClick={handleBack}>
          <IconUI name="chevronRight" />
        </button>
        <button className={clsx(styles.btn, styles.right)} onClick={handleForw}>
          <IconUI name="chevronRight" />
        </button>
        <img src={stateImg[0]} alt="Main carousel" />
      </div>
      <ul className={styles.carouselList}>{renderThumbnails()}</ul>
    </div>
  );
};
