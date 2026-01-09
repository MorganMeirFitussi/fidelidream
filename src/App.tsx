import { useState } from 'react';
import { useEquityStore } from './store/useEquityStore';
import { PackageSection, PersonalInfoForm, Results, Disclaimer, SimulatorModal } from './components';
import { Button } from './components/ui';
import { useTheme } from './hooks';
import { themeClass, vars } from './styles/theme.css';
import './styles/global.css';

function App() {
  const themeClassName = useTheme();
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
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
    <div className={`${themeClassName} ${themeClass}`} style={{ minHeight: '100vh' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: vars.space.lg }}>
        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: vars.space.xl }}>
          <div style={{ fontSize: '3rem', marginBottom: vars.space.sm }}>🇮🇱💼</div>
          <h1 style={{ fontSize: vars.fontSize.xxxl, fontWeight: vars.fontWeight.bold, color: vars.color.text, marginBottom: vars.space.sm }}>
            Israeli Equity Calculator
          </h1>
          <p style={{ fontSize: vars.fontSize.md, color: vars.color.textSecondary }}>
            Net gains calculator for RSUs & Stock Options with Israeli tax rules
          </p>
        </header>

        <Disclaimer />

        <div style={{ display: 'flex', flexDirection: 'column', gap: vars.space.lg }}>
          <PersonalInfoForm />

          <PackageSection type="rsu" />

          <PackageSection type="option" />

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: vars.space.md, flexWrap: 'wrap' }}>
            <Button
              size="lg"
              onClick={calculate}
              disabled={!isCalculateEnabled}
              style={{ 
                paddingLeft: vars.space.xl, 
                paddingRight: vars.space.xl,
                fontSize: vars.fontSize.lg,
              }}
            >
              🧮 Calculate Net Value
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => setIsSimulatorOpen(true)}
              disabled={stockOptions.length === 0 && rsus.length === 0}
              style={{ 
                paddingLeft: vars.space.xl, 
                paddingRight: vars.space.xl,
                fontSize: vars.fontSize.lg,
              }}
            >
              🔮 Simulator
            </Button>
          </div>

          {calculationResult && <Results result={calculationResult} />}

          {/* Simulator Modal */}
          <SimulatorModal 
            isOpen={isSimulatorOpen} 
            onClose={() => setIsSimulatorOpen(false)} 
          />
        </div>

        {/* Footer */}
        <footer style={{ textAlign: 'center', padding: vars.space.xl, marginTop: vars.space.xl, color: vars.color.textMuted, fontSize: vars.fontSize.sm }}>
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
