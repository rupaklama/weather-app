import styles from "./App.module.css";

import Weather from "./pages/weather/Weather";

const App = () => {
  return (
    <div className={styles.container}>
      <header className={styles.heading}>Weather Buddy</header>
      <main className={styles.main}>
        <Weather />
      </main>
      <footer className={styles.footer}>&#169; Developed by Rupak Lama</footer>
    </div>
  );
};

export default App;
