import { clearUser, setUser } from '@entities/user';
import { useDispatch } from '@shared/store';
import { Button } from '@shared/ui';
import { ProfileForm } from '@widgets/profile/ui';
import { RegisterForm } from '@widgets/register/ui';

export const TempHome = () => {
  const dispatch = useDispatch();

  const handleTestLogin = () => {
    dispatch(
      setUser({
        id: '1',
        name: 'Иван',
        avatar: 'https://api.dicebear.com/9.x/thumbs/svg?seed=ivan-losodkfkvclvxpdofdokk',
        email: 'ivan@example.com',
        description: 'Тестовый пользователь',
        gender: 'male',
        birthday: new Date('2000-01-02').toISOString(),
        cityId: '1',
        subcategoriesIds: ['1', '2', '3'],
      })
    );
  };

  const handleTestLogout = () => {
    dispatch(clearUser());
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Главная страница (неавторизованный)</h1>
      <p>Этот макет использует LayoutNauth</p>
      <p>Хедер должен показывать кнопки Войти и Зарегистрироваться</p>

      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <Button variant="primary" onClick={handleTestLogin}>
          Тестовый логин (Иван)
        </Button>
        <Button variant="secondary" onClick={handleTestLogout}>
          Тестовый логаут
        </Button>
      </div>
    </div>
  );
};

export const TempDashboard = () => {
  const dispatch = useDispatch();

  const handleTestLogin = () => {
    dispatch(
      setUser({
        id: '1',
        name: 'Иван',
        avatar: 'https://api.dicebear.com/9.x/thumbs/svg?seed=ivan-losodkfkvclvxpdofdokk',
        email: 'ivan@example.com',
        description: 'Тестовый пользователь',
        gender: 'male',
        birthday: new Date('2000-01-02').toISOString(),
        cityId: '1',
        subcategoriesIds: ['1', '2', '3'],
      })
    );
  };

  const handleTestLogout = () => {
    dispatch(clearUser());
  };

  return (
    <>
      <div style={{ padding: '20px' }}>
        <h1>Дашборд (авторизованный)</h1>
        <p>Этот макет использует LayoutAuth</p>
        <p>Хедер должен показывать имя пользователя и аватар</p>

        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <Button variant="primary" onClick={handleTestLogin}>
            Тестовый логин (Иван)
          </Button>
          <Button variant="secondary" onClick={handleTestLogout}>
            Тестовый логаут
          </Button>
        </div>
      </div>
      <ProfileForm></ProfileForm>
    </>
  );
};

export const TempLogin = () => (
  <div style={{ padding: '20px', background: 'white', borderRadius: '8px' }}>
    <h1>Вход в систему</h1>
    <p>Макет использует LayoutPure</p>
    <p>Хедер должен быть только с логотипом и кнопкой "Закрыть"</p>
    <p>Футера быть не должно</p>
  </div>
);

export const TempRegister = () => <RegisterForm />;

export const TempAbout = () => (
  <div
    className="container"
    style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}
  >
    <h1>SkillSwap</h1>
    <p> Платформа обмена навыками «Я научу / Хочу научиться»</p>
    <p> Приложение создано в рамках курсовой работы! </p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2>Авторы</h2>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '20px' }}>
        <h3>
          Githubs:{' '}
          <a target="_blank" href="https://github.com/distinkt-dd">
            @distinkt-dd
          </a>
          ;{' '}
          <a target="_blank" href="https://github.com/barawek55">
            @barawek
          </a>
        </h3>
      </div>
    </div>
  </div>
);

export const TempNotFound = () => (
  <div style={{ padding: '20px' }}>
    <h1>404 - Страница не найдена</h1>
    <p>Макет использует LayoutNauth</p>
  </div>
);
