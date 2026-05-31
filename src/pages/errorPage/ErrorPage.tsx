import { useNavigate } from 'react-router-dom';
import { Button } from '@shared/ui';
import styles from './ErrorPage.module.css';

type ErrorPageVariant = '404' | '500';

type ErrorPageProps = {
  variant: ErrorPageVariant;
};

const contentByVariant = {
  '404': {
    imageSrc: '/error-404.svg',
    imageAlt: 'Ошибка 404',
    title: 'Страница не найдена',
    description:
      'К сожалению, эта страница недоступна. Вернитесь на главную страницу или попробуйте позже.',
  },
  '500': {
    imageSrc: '/error-500.svg',
    imageAlt: 'Ошибка 500',
    title: 'На сервере произошла ошибка',
    description: 'Попробуйте позже или вернитесь на главную страницу',
  },
};

export const ErrorPage = ({ variant }: ErrorPageProps) => {
  const navigate = useNavigate();
  const content = contentByVariant[variant];

  return (
    <section className={styles.wrapper}>
      <div className={styles.content}>
        <img
          className={`${styles.image} ${variant === '500' ? styles.image500 : ''}`}
          src={content.imageSrc}
          alt={content.imageAlt}
        />

        <h1 className={styles.title}>{content.title}</h1>
        <p className={styles.description}>{content.description}</p>

        <div className={styles.actions}>
          <Button variant="secondary" width={218}>
            Сообщить об ошибке
          </Button>
          <Button variant="primary" width={218} onClick={() => navigate('/')}>
            На главную
          </Button>
        </div>
      </div>
    </section>
  );
};
