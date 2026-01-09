import * as styles from '../styles/components.css';

export function Disclaimer() {
  return (
    <div className={styles.disclaimer}>
      <div className={styles.disclaimerTitle}>
        <span>🔒</span> Privacy
      </div>
      <p className={styles.disclaimerText}>
        This application does not collect or store your data on any server. 
        All data is stored locally in your browser.
      </p>
    </div>
  );
}
