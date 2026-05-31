import { useRef } from 'react';
import { Input, Dropdown, IconUI } from '@shared/ui';
import { useSelector } from '@shared/store';
import { selectedSubcategories } from '@entities/subcategories';
import { selectedCategories } from '@entities/categories/model';
import * as yup from 'yup';
import { step3Schema } from '../model/schemas';
import type { RegisterFormData } from '../model/types';
import styles from './register.module.css';

type Props = {
  data: RegisterFormData;
  onChange: (patch: Partial<RegisterFormData>) => void;
  errors: Record<string, string>;
  onErrorChange?: (patch: Record<string, string>) => void;
};

const MAX_IMAGES = 5;
const MAX_FILE_BYTES = 5 * 1024 * 1024;

const fileToDataUrl = (file: File): Promise<string> => {
  if (file.size > MAX_FILE_BYTES) {
    return Promise.reject(
      new Error(`Файл «${file.name}» превышает 1 МБ. Выберите файл меньшего размера.`)
    );
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error(`Не удалось прочитать файл «${file.name}».`));
    reader.readAsDataURL(file);
  });
};

export const RegisterStep3 = ({ data, onChange, errors, onErrorChange }: Props) => {
  const categories = useSelector(selectedCategories);
  const subcategories = useSelector(selectedSubcategories);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categoryOptions = categories.map((c) => ({ id: c.id, name: c.name }));

  const filteredSubcategoryOptions = subcategories
    .filter((s) => !data.offerCategoryId || String(s.categoryId) === String(data.offerCategoryId))
    .map((s) => ({ id: s.id, name: s.name }));

  const selectedCategory =
    categoryOptions.find((c) => String(c.id) === String(data.offerCategoryId)) ?? null;

  const selectedSubcategory =
    filteredSubcategoryOptions.find((s) => String(s.id) === String(data.offerSubcategoryId)) ??
    null;

  const validateField = async (field: string, value: unknown) => {
    if (!onErrorChange) return;
    try {
      await step3Schema.validateAt(field, { ...data, [field]: value });
      onErrorChange({ [field]: '' });
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        onErrorChange({ [field]: err.message });
      }
    }
  };

  const handleOfferNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange({ offerName: value });
    void validateField('offerName', value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    onChange({ offerDescription: value });
    void validateField('offerDescription', value);
  };

  const handleCategoryChange = (opt: { id: string | number; name: string } | null) => {
    const value = String(opt?.id ?? '');
    onChange({
      offerCategoryId: value,
      offerSubcategoryId: '',
    });
    void validateField('offerCategoryId', value);
    onErrorChange?.({ offerSubcategoryId: '' });
  };

  const handleSubcategoryChange = (opt: { id: string | number; name: string } | null) => {
    const value = String(opt?.id ?? '');
    onChange({ offerSubcategoryId: value });
    void validateField('offerSubcategoryId', value);
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const remaining = MAX_IMAGES - data.offerImages.length;
    if (remaining <= 0) return;

    const toProcess = Array.from(files).slice(0, remaining);
    const results = await Promise.allSettled(toProcess.map(fileToDataUrl));

    const dataUrls: string[] = [];
    const fileErrors: string[] = [];

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        dataUrls.push(result.value);
      } else {
        fileErrors.push((result.reason as Error).message);
      }
    });

    if (dataUrls.length > 0) {
      onChange({ offerImages: [...data.offerImages, ...dataUrls] });
    }

    if (fileErrors.length > 0) {
      alert(fileErrors[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    void handleFiles(e.dataTransfer.files);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    void handleFiles(e.target.files);
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    onChange({ offerImages: data.offerImages.filter((_, i) => i !== index) });
  };

  return (
    <>
      <Input
        label="Название навыка"
        value={data.offerName}
        onChange={handleOfferNameChange}
        error={errors.offerName}
        placeholder="Введите название вашего навыка"
        fullWidth
      />

      <div className={`${styles.fieldGroup} ${styles.zField40}`}>
        <Dropdown
          label="Категория навыка"
          placeholder="Выберите категорию навыка"
          options={categoryOptions}
          value={selectedCategory}
          onChange={handleCategoryChange}
          variant="clearable"
        />
        {errors.offerCategoryId && (
          <span className={styles.fieldError}>{errors.offerCategoryId}</span>
        )}
      </div>

      <div className={`${styles.fieldGroup} ${styles.zField30}`}>
        <Dropdown
          label="Подкатегория навыка"
          placeholder="Выберите подкатегорию навыка"
          options={filteredSubcategoryOptions}
          value={selectedSubcategory}
          onChange={handleSubcategoryChange}
          variant="clearable"
        />
        {errors.offerSubcategoryId && (
          <span className={styles.fieldError}>{errors.offerSubcategoryId}</span>
        )}
      </div>

      <div className={styles.fieldGroup}>
        <label className={styles.textareaLabel}>Описание</label>
        <textarea
          className={`${styles.textarea} ${errors.offerDescription ? styles.textareaError : ''}`}
          value={data.offerDescription}
          onChange={handleDescriptionChange}
          placeholder="Коротко опишите, чему можете научить"
          rows={4}
        />
        {errors.offerDescription && (
          <span className={styles.fieldError}>{errors.offerDescription}</span>
        )}
      </div>

      <div className={styles.fieldGroup}>
        {data.offerImages.length < MAX_IMAGES && (
          <div
            className={styles.imageDropzone}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
          >
            <span>Перетащите или выберите изображения навыка</span>
            <button
              type="button"
              className={styles.imageSelectBtn}
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              <IconUI name="galleryAdd" size={16} />
              Выбрать изображения
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className={styles.fileInputHidden}
          onChange={handleInputChange}
        />

        {data.offerImages.length > 0 && (
          <div className={styles.imagePreviewList}>
            {data.offerImages.map((src, i) => (
              <div key={src} className={styles.imagePreviewItem}>
                <img src={src} alt={`preview-${i + 1}`} className={styles.imagePreview} />
                <button
                  type="button"
                  className={styles.imageRemoveBtn}
                  onClick={() => removeImage(i)}
                  aria-label={`Удалить изображение ${i + 1}`}
                >
                  <IconUI name="cross" size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {data.offerImages.length >= MAX_IMAGES && (
          <span className={styles.fieldHint}>Достигнут лимит изображений ({MAX_IMAGES})</span>
        )}
      </div>
    </>
  );
};
