import styles from './DevelopmentPage.module.css';

export const DevelopmentPage = () => {
  return (
    <div className={styles.developmentContent}>
      <img src="/light-bulb.svg" alt="Light bulb" />
      <h1>В разработке</h1>
      <p>Когда-нибудь тут обязательно будет что-то интересное!</p>
    </div>
  );
};
