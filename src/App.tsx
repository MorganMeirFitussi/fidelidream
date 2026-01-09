import { useEquityStore } from './store/useEquityStore';
import { PersonalInfoForm } from './components/PersonalInfoForm';
import { StockOptionsSection } from './components/StockOptionsSection';
import { RSUsSection } from './components/RSUsSection';
import { Results } from './components/Results';
import { Disclaimer } from './components/Disclaimer';
import { lightTheme, themeClass } from './styles/theme.css';
import './styles/global.css';
import * as styles from './App.css';

function App() {
  const personalInfo = useEquityStore((state) => state.personalInfo);
  const stockOptions = useEquityStore((state) => state.stockOptions);
  const rsus = useEquityStore((state) => state.rsus);
  const calculationResult = useEquityStore((state) => state.calculationResult);
  const calculate = useEquityStore((state) => state.calculate);

  const canCalculate = 
    personalInfo.stockPrice > 0 && 
    personalInfo.monthlySalary > 0 &&
    personalInfo.exchangeRate > 0 &&
    (stockOptions.length > 0 || rsus.length > 0);

  const hasPackagesWithValue = 
    stockOptions.some(opt => (opt.totalQuantity - opt.usedQuantity) > 0) ||
    rsus.some(rsu => rsu.vestedQuantity > 0);

  const isCalculateEnabled = canCalculate && hasPackagesWithValue;

  return (
    <div className={`${styles.app} ${lightTheme} ${themeClass}`}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.logo}>🇮🇱💼</div>
          <h1 className={styles.title}>Israeli Equity Calculator</h1>
          <p className={styles.subtitle}>
            Calculate your net gains on RSUs and Stock Options, 
            accounting for all Israeli tax rules including Article 102, 
            Bituah Leumi, and credit points.
          </p>
        </header>

        <Disclaimer />

        <PersonalInfoForm />

        <StockOptionsSection />

        <RSUsSection />

        <div className={styles.calculateSection}>
          <button
            className={styles.calculateButton}
            onClick={calculate}
            disabled={!isCalculateEnabled}
          >
            <span>🧮</span>
            Calculate Net Value
          </button>
        </div>

        {calculationResult && <Results result={calculationResult} />}

        <footer className={styles.footer}>
          <p>
            Israeli Equity Calculator © {new Date().getFullYear()} • 
            Built for Israeli high-tech employees • 
            Data stored locally in your browser
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
