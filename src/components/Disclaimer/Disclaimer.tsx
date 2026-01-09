import * as styles from './Disclaimer.css';

export function Disclaimer() {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <span>⚠️</span> Important Disclaimer
      </div>
      <p className={styles.text}>
        This tool is provided for <span className={styles.highlight}>INFORMATIONAL purposes only</span>. 
        Calculations are <span className={styles.highlight}>ESTIMATES</span> based on 2025 Israeli tax laws. 
        This calculator <span className={styles.highlight}>DOES NOT REPLACE</span> professional tax advice 
        from a licensed Israeli accountant (רואה חשבון).
        <br /><br />
        Tax laws may change. Your personal situation may have specific considerations not covered here. 
        For important financial decisions, consult a professional.
        <br /><br />
        This application does not collect or store your data on any server. 
        All data is stored locally in your browser.
      </p>
    </div>
  );
}
