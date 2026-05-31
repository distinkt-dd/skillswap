import type { FC } from 'react';
import React, { useMemo, useRef, useState } from 'react';
import styles from './profile-form.module.css';
import { useDispatch } from '@shared/store';
import {
  Calendar,
  Dropdown,
  Input,
  IconUI,
  TextAreaUI,
  Button,
  Avatar,
  type DropdownOption,
} from '@shared/ui';
import {
  selectedUser,
  updateDateUser,
  updatePassword,
  userDataUpdateSchema,
  userPassUpdateSchema,
  type TUpdateUser,
  type TUpdateUserPass,
} from '@entities/user';
import { useSelector } from '@shared/store';
import Form from '@shared/ui/form';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { useFormValidation } from '@shared/api';
import { selectCities } from '@entities/cities';
import { generateRandomAvatar } from '@shared/utils/avatarGenerator';
import ModalInfo from '@widgets/models/models.notifications';

export const ProfileForm: FC = () => {
  const dispatch = useDispatch();

  const optionsSex = [
    {
      id: 'male',
      name: 'Мужской',
    },
    {
      id: 'female',
      name: 'Женский',
    },
  ];

  const optionsCities = useSelector(selectCities) || [];

  const [isOpenChangePass, setIsOpenChangePass] = useState(false);
  const changePassButtonRef = useRef<HTMLButtonElement | null>(null);
  const changePassInputRef = useRef<HTMLDivElement>(null);

  const user = useSelector(selectedUser);
  const [localUserState, setLocalUserState] = useState(user);
  const [userPassword, setUserPassword] = useState('');

  const userHook = useFormValidation(userDataUpdateSchema);
  const passHook = useFormValidation(userPassUpdateSchema);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const inputOnChangeHandler = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    userHook.validateField(name as keyof TUpdateUser, value);
    setLocalUserState((prev) => {
      if (!prev) {
        return null;
      }
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const [showModal, setShowModal] = useState<boolean>(false);

  const handleModalBtnClick = () => {
    setShowModal(!showModal);
  };

  const passwordOnChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    passHook.validateField(name as keyof TUpdateUserPass, value);
    setUserPassword(value);
  };

  const handleGenderChange = (option: DropdownOption | null) => {
    setLocalUserState((prev) => {
      console.log(option);
      if (!prev) return null;
      const genderValue = option?.id ? String(option.id) : '';
      return {
        ...prev,
        gender: genderValue,
      };
    });
  };

  const handleCityChange = (option: DropdownOption | null) => {
    setLocalUserState((prev) => {
      if (!prev) return null;
      const cityValue = option?.id ? String(option.id) : '';
      return {
        ...prev,
        cityId: cityValue,
      };
    });
  };

  const handleBirthdayChange = (date: Date | null) => {
    userHook.validateField('birthday' as keyof TUpdateUser, date ? date.toISOString() : '');
    setLocalUserState((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        birthday: date ? date.toISOString() : '',
      };
    });
  };

  const handleAvatarChange = () => {
    const newAvatar = generateRandomAvatar();
    userHook.validateField('avatar' as keyof TUpdateUser, newAvatar);
    setLocalUserState((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        avatar: newAvatar,
      };
    });
  };

  const handleChangePassword = () => {
    if (!localUserState) return;
    try {
      dispatch(
        updatePassword({
          id: localUserState?.id,
          password: userPassword,
        })
      );

      setIsOpenChangePass(false);
      setUserPassword('');
      setShowModal(!showModal);
      passHook.clearErrors();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Ошибка сохранения');
      setTimeout(() => {
        setFormError(null);
      }, 3000);
    }
  };

  const handleSubmitForm = async () => {
    if (!localUserState) return;
    userHook.clearErrors();
    setIsSubmitting(true);
    try {
      const validForm = await userHook.validateForm(localUserState);
      if (validForm) {
        dispatch(updateDateUser(localUserState));
      }
      localStorage.setItem('user', JSON.stringify(localUserState));
      setShowModal(!showModal);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Ошибка сохранения');
      setTimeout(() => {
        setFormError(null);
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormChanged = useMemo(() => {
    if (!localUserState || !user) return false;

    return (
      localUserState?.name !== user?.name ||
      localUserState?.email !== user?.email ||
      localUserState?.description !== user?.description ||
      localUserState?.gender !== user?.gender ||
      localUserState?.cityId !== user?.cityId ||
      localUserState?.birthday !== user?.birthday ||
      localUserState?.avatar !== user?.avatar ||
      JSON.stringify(localUserState?.subcategoriesIds) !== JSON.stringify(user?.subcategoriesIds)
    );
  }, [localUserState, user]);

  return (
    <Form onSubmit={handleSubmitForm} error={formError}>
      <div className={styles.form_double}>
        <div className={styles.formTextSection}>
          <Input
            name="email"
            type="email"
            label="Почта"
            placeholder="Введите email"
            value={localUserState?.email}
            rightIcon={<IconUI name="edit" />}
            onChange={inputOnChangeHandler}
            error={userHook.errors?.email}
          />
          <SwitchTransition>
            <CSSTransition
              key={isOpenChangePass ? 'Отменить' : 'Изменить пароль'}
              nodeRef={changePassButtonRef}
              timeout={300}
              classNames={{
                enter: styles.fadeEnter,
                enterActive: styles.fadeEnterActive,
                exit: styles.fadeExit,
                exitActive: styles.fadeExitActive,
              }}
            >
              <button
                type="button"
                ref={changePassButtonRef}
                className={styles.showChangePass}
                onClick={() =>
                  setIsOpenChangePass((prev) => {
                    passHook.clearErrors();
                    setUserPassword('');
                    return !prev;
                  })
                }
              >
                {isOpenChangePass ? 'Отменить' : 'Изменить пароль'}
              </button>
            </CSSTransition>
          </SwitchTransition>
          <CSSTransition
            in={isOpenChangePass}
            nodeRef={changePassInputRef}
            timeout={300}
            classNames={{
              enter: styles.slideEnter,
              enterActive: styles.slideEnterActive,
              exit: styles.slideExit,
              exitActive: styles.slideExitActive,
            }}
            unmountOnExit
          >
            <div className={styles.changePass__container} ref={changePassInputRef}>
              <Input
                name="password"
                type="password"
                label="Пароль"
                value={userPassword}
                onChange={passwordOnChangeHandler}
                error={passHook.errors?.password}
                placeholder="Введите пароль"
              />
              <Button
                type="button"
                disabled={!!passHook.getCounterErrors(passHook.errors) || userPassword === ''}
                className={styles.changePass__button}
                onClick={handleChangePassword}
              >
                Изменить
              </Button>
            </div>
          </CSSTransition>

          <Input
            name="name"
            type="text"
            label="Имя"
            value={localUserState?.name}
            placeholder="Введите ваше имя"
            rightIcon={<IconUI name="edit" />}
            onChange={inputOnChangeHandler}
            error={userHook.errors?.name}
          />
          <div className={styles.groupBox_double}>
            <Calendar
              name="birthday"
              label="Дата рождения"
              value={localUserState?.birthday ? new Date(localUserState.birthday) : null}
              onChange={handleBirthdayChange}
              error={userHook.errors?.birthday}
            />
            <Dropdown
              name="gender"
              options={optionsSex}
              mode="single"
              placeholder="Не указан"
              label="Пол"
              value={optionsSex.find((item) => item.id === localUserState?.gender)}
              onChange={handleGenderChange}
              error={userHook.errors?.gender}
            />
          </div>
          <Dropdown
            name="cityId"
            options={optionsCities}
            mode="single"
            searchable
            placeholder="Не указан"
            label="Город"
            value={optionsCities?.find((item) => item.id === localUserState?.cityId)}
            onChange={handleCityChange}
            error={userHook.errors?.cityId}
          />

          <TextAreaUI
            name="description"
            label="О себе"
            placeholder="Расскажите о себе"
            rightIcon={<IconUI name="edit" />}
            showRightIcon={true}
            maxLength={200}
            value={localUserState?.description}
            onChange={inputOnChangeHandler}
            error={userHook.errors?.description}
          />
          <Button
            className={styles.submitButton}
            disabled={userHook.getCounterErrors(userHook.errors) > 0 || !isFormChanged}
            type="submit"
            width={'100%'}
          >
            {isSubmitting ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
        <Avatar
          editable
          size={'large'}
          src={localUserState?.avatar}
          avatarChangeBtnClick={handleAvatarChange}
        />
      </div>
      <ModalInfo type="dataChange" isOpen={showModal} onButtonClick={handleModalBtnClick} />
    </Form>
  );
};
