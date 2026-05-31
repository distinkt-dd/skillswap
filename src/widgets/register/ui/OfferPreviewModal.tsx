import { Modal } from '@shared/ui/modal';
import { Button, IconUI } from '@shared/ui';
import { useSelector } from '@shared/store';
import { selectedCategories } from '@entities/categories/model';
import { selectedSubcategories } from '@entities/subcategories';
import type { RegisterFormData } from '../model/types';
import styles from './register.module.css';
import { useState } from 'react';
import ModalInfo from '@widgets/models/models.notifications';

type Props = {
  isOpen: boolean;
  data: RegisterFormData;
  onEdit: () => void;
  onConfirm: () => void;
  isLoading: boolean;
};

export const OfferPreviewModal = ({ isOpen, data, onEdit, onConfirm, isLoading }: Props) => {
  const categories = useSelector(selectedCategories);
  const subcategories = useSelector(selectedSubcategories);

  const category = categories.find((c) => String(c.id) === String(data.offerCategoryId));
  const subcategory = subcategories.find((s) => String(s.id) === String(data.offerSubcategoryId));
  const breadcrumb = [category?.name, subcategory?.name].filter(Boolean).join(' / ');

  const [mainImage, ...restImages] = data.offerImages;
  const hasImages = data.offerImages.length > 0;
  const thumbs = restImages.slice(0, 3);
  const extraCount = restImages.length > 3 ? restImages.length - 3 : 0;
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleRegistrationReady = () => {
    setShowModal(!showModal);
  };

  const handleCloseModal = () => {
    setShowModal(!showModal);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onEdit}
      modalClassName={styles.previewModalBox}
      overlayClassName={styles.previewOverlay}
    >
      <h2 className={styles.previewTitle}>Ваше предложение</h2>
      <p className={styles.previewSubtitle}>
        Пожалуйста, проверьте и подтвердите правильность данных
      </p>

      <div className={styles.previewCard}>
        <div className={styles.previewContent}>
          <div className={styles.previewText}>
            <h3 className={styles.previewOfferName}>{data.offerName || 'Без названия'}</h3>
            {breadcrumb && <p className={styles.previewBreadcrumb}>{breadcrumb}</p>}
            <p className={styles.previewDescription}>{data.offerDescription}</p>
          </div>

          <div className={styles.previewActions}>
            <Button
              variant="secondary"
              onClick={onEdit}
              icon={<IconUI name="edit" size={16} />}
              iconPosition="right"
              disabled={isLoading}
            >
              Редактировать
            </Button>
            <Button
              variant="primary"
              onClick={handleRegistrationReady}
              disabled={isLoading}
              loading={isLoading}
            >
              Готово
            </Button>
          </div>
        </div>

        {hasImages && (
          <div className={styles.previewImages}>
            <img
              src={mainImage}
              alt="Главное изображение навыка"
              className={styles.previewMainImage}
            />
            {thumbs.length > 0 && (
              <div className={styles.previewThumbs}>
                {thumbs.map((src, i) => {
                  const isLast = i === thumbs.length - 1 && extraCount > 0;
                  return (
                    <div key={src} className={styles.previewThumbWrapper}>
                      <img
                        src={src}
                        alt={`Дополнительное изображение ${i + 2}`}
                        className={styles.previewThumb}
                      />
                      {isLast && <div className={styles.previewMore}>+{extraCount}</div>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {!hasImages && (
          <div className={styles.previewNoImages}>
            <IconUI name="galleryAdd" size={40} />
            <span>Изображения не добавлены</span>
          </div>
        )}
        <ModalInfo
          type="info"
          onButtonClick={onConfirm}
          onClose={handleCloseModal}
          isOpen={showModal}
        />
      </div>
    </Modal>
  );
};
