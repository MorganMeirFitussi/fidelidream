import * as styles from './Disclaimer.css';

export function Disclaimer() {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <span>🔒</span> Privacy
      </div>
      <p className={styles.text}>
        This application does not collect or store your data on any server. 
        All data is stored locally in your browser.
      </p>
    </div>
  );
}
