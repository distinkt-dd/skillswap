import { Dropdown, Input, Calendar } from '@shared/ui';
import { useSelector } from '@shared/store';
import { selectCities } from '@entities/cities';
import { selectedSubcategories } from '@entities/subcategories';
import { selectedCategories as selectCategoriesState } from '@entities/categories/model';
import { generateRandomAvatar } from '@shared/index';
import * as yup from 'yup';
import { step2Schema } from '../model/schemas';
import type { RegisterFormData } from '../model/types';
import type { DropdownOption } from '@shared/ui';
import styles from './register.module.css';

type Props = {
  data: RegisterFormData;
  onChange: (patch: Partial<RegisterFormData>) => void;
  errors: Record<string, string>;
  onErrorChange?: (patch: Record<string, string>) => void;
};

const GENDER_OPTIONS: DropdownOption[] = [
  { id: 'male', name: 'Мужской' },
  { id: 'female', name: 'Женский' },
];

export const RegisterStep2 = ({ data, onChange, errors, onErrorChange }: Props) => {
  const cities = useSelector(selectCities) ?? [];
  const categories = useSelector(selectCategoriesState);
  const subcategories = useSelector(selectedSubcategories);

  const cityOptions: DropdownOption[] = cities.map((c) => ({ id: c.id, name: c.name }));
  const categoryOptions: DropdownOption[] = categories.map((c) => ({ id: c.id, name: c.name }));

  const filteredSubcategoryOptions: DropdownOption[] = subcategories
    .filter(
      (s) =>
        data.learnCategoryIds.length === 0 || data.learnCategoryIds.includes(String(s.categoryId))
    )
    .map((s) => ({ id: s.id, name: s.name }));

  const selectedCity = cityOptions.find((c) => String(c.id) === String(data.cityId)) ?? null;
  const selectedGender = GENDER_OPTIONS.find((g) => g.id === data.gender) ?? null;

  const selectedCategoryValues = categoryOptions.filter((c) =>
    data.learnCategoryIds.includes(String(c.id))
  );

  const selectedSubcats = filteredSubcategoryOptions.filter((s) =>
    data.subcategoriesIds.includes(String(s.id))
  );

  const validateField = async (field: string, value: unknown) => {
    if (!onErrorChange) return;
    try {
      await step2Schema.validateAt(field, { ...data, [field]: value });
      onErrorChange({ [field]: '' });
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        onErrorChange({ [field]: err.message });
      }
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange({ name: value });
    void validateField('name', value);
  };

  const handleBirthdayChange = (date: Date | null) => {
    onChange({ birthday: date });
    void validateField('birthday', date);
  };

  const handleGenderChange = (opt: DropdownOption | null) => {
    const value = (opt?.id as 'male' | 'female') ?? '';
    onChange({ gender: value });
    void validateField('gender', value);
  };

  const handleCityChange = (opt: DropdownOption | null) => {
    const value = String(opt?.id ?? '');
    onChange({ cityId: value });
    void validateField('cityId', value);
  };

  const handleCategoryChange = (opts: DropdownOption[]) => {
    const newCategoryIds = opts.map((o) => String(o.id));

    const validSubcatIds = new Set(
      subcategories
        .filter((s) => newCategoryIds.length === 0 || newCategoryIds.includes(String(s.categoryId)))
        .map((s) => String(s.id))
    );

    onChange({
      learnCategoryIds: newCategoryIds,
      subcategoriesIds: data.subcategoriesIds.filter((id) => validSubcatIds.has(id)),
    });
  };

  const handleSubcatsChange = (opts: DropdownOption[]) => {
    const ids = opts.map((o) => String(o.id));
    onChange({ subcategoriesIds: ids });
    void validateField('subcategoriesIds', ids);
  };

  const handleRegenerateAvatar = () => {
    onChange({ avatar: generateRandomAvatar() });
  };

  return (
    <>
      <div className={styles.avatarSection}>
        <div
          className={styles.avatarCircle}
          onClick={handleRegenerateAvatar}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleRegenerateAvatar()}
          aria-label="Сгенерировать новый аватар"
          title="Нажмите, чтобы сгенерировать новый аватар"
        >
          <img src={data.avatar} alt="Аватар" className={styles.avatarPreview} />
          <div className={styles.avatarBadge} aria-hidden="true">
            🔀
          </div>
        </div>
        <span className={styles.avatarHint}>Нажмите, чтобы сменить аватар</span>
      </div>

      <div className={styles.zField60}>
        <Input
          label="Имя"
          value={data.name}
          onChange={handleNameChange}
          error={errors.name}
          placeholder="Введите ваше имя"
          fullWidth
        />
      </div>

      <div className={styles.row}>
        <div className={`${styles.rowItem} ${styles.zField50}`}>
          <Calendar
            label="Дата рождения"
            value={data.birthday}
            onChange={handleBirthdayChange}
            placeholder="дд.мм.гггг"
            maxDate={new Date()}
            width="100%"
          />
          {errors.birthday && <span className={styles.fieldError}>{errors.birthday}</span>}
        </div>

        <div className={`${styles.rowItem} ${styles.zField50}`}>
          <div className={styles.fieldGroup}>
            <Dropdown
              label="Пол"
              placeholder="Не указан"
              options={GENDER_OPTIONS}
              value={selectedGender}
              onChange={handleGenderChange}
              variant="clearable"
            />
            {errors.gender && <span className={styles.fieldError}>{errors.gender}</span>}
          </div>
        </div>
      </div>

      <div className={`${styles.fieldGroup} ${styles.zField40}`}>
        <Dropdown
          label="Город"
          placeholder="Не указан"
          options={cityOptions}
          value={selectedCity}
          onChange={handleCityChange}
          searchable
          variant="clearable"
        />
        {errors.cityId && <span className={styles.fieldError}>{errors.cityId}</span>}
      </div>

      <div className={`${styles.fieldGroup} ${styles.zField30}`}>
        <Dropdown
          label="Категория навыка, которому хотите научиться"
          placeholder="Выберите категорию"
          options={categoryOptions}
          values={selectedCategoryValues}
          onValuesChange={handleCategoryChange}
          mode="multi"
          variant="clearable"
        />
      </div>

      <div className={`${styles.fieldGroup} ${styles.zField20}`}>
        <Dropdown
          label="Подкатегория навыка, которому хотите научиться"
          placeholder="Выберите подкатегорию"
          options={filteredSubcategoryOptions}
          values={selectedSubcats}
          onValuesChange={handleSubcatsChange}
          mode="multi"
          variant="clearable"
        />
        {errors.subcategoriesIds && (
          <span className={styles.fieldError}>{errors.subcategoriesIds}</span>
        )}
      </div>
    </>
  );
};
