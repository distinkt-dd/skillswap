import { LoginForm } from '@widgets/login/ui';
import clsx from 'clsx';
import styles from './LoginPage.module.css';

export const LoginPage = () => {
  return (
    <section className={clsx(styles.section)}>
      <div className={clsx('container', styles.container)}>
        <h2>Вход</h2>
        <div className={clsx(styles.content)}>
          <LoginForm classNames={styles.formLogin} />
          <div className={clsx(styles.illustration)}>
            <img src="/light-bulb.svg" alt="Light bulb" className={clsx(styles.imgIlustration)} />
            <div className={styles.textBlock}>
              <h2>С возвращением в SkillSwap!</h2>
              <p>Обменивайтесь знаниями и навыками с другими людьми</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
