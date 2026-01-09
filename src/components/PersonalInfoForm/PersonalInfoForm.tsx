import { useState } from 'react';
import { useEquityStore } from '../../store/useEquityStore';
import { fetchExchangeRate } from '../../utils/exchangeRate';
import * as styles from './PersonalInfoForm.css';

export function PersonalInfoForm() {
  const personalInfo = useEquityStore((state) => state.personalInfo);
  const updatePersonalInfo = useEquityStore((state) => state.updatePersonalInfo);
  
  const [isLoadingRate, setIsLoadingRate] = useState(false);
  const [rateDate, setRateDate] = useState<string | null>(null);
  const [rateError, setRateError] = useState<string | null>(null);

  const handleBlur = (field: keyof typeof personalInfo) => (
    e: React.FocusEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      updatePersonalInfo({ [field]: value });
    }
  };

  const handleChange = (field: keyof typeof personalInfo) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      updatePersonalInfo({ [field]: value });
    } else if (e.target.value === '') {
      updatePersonalInfo({ [field]: 0 });
    }
  };

  const handleFetchRate = async () => {
    setIsLoadingRate(true);
    setRateError(null);
    
    try {
      const { rate, date } = await fetchExchangeRate();
      updatePersonalInfo({ exchangeRate: rate });
      setRateDate(date);
    } catch (err) {
      setRateError('Failed to fetch rate');
      console.error('Exchange rate fetch error:', err);
    } finally {
      setIsLoadingRate(false);
    }
  };

  const formatRateDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        <span>💼</span> Personal Information
      </h2>
      
      <div className={styles.grid}>
        <div className={styles.field}>
          <label className={styles.label}>Current Stock Price</label>
          <div className={styles.inputWrapper}>
            <span className={styles.inputPrefix}>$</span>
            <input
              type="number"
              className={styles.input}
              defaultValue={personalInfo.stockPrice || ''}
              onBlur={handleBlur('stockPrice')}
              onChange={handleChange('stockPrice')}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Monthly Salary</label>
          <div className={styles.inputWrapper}>
            <span className={styles.inputPrefix}>₪</span>
            <input
              type="number"
              className={styles.input}
              defaultValue={personalInfo.monthlySalary || ''}
              onBlur={handleBlur('monthlySalary')}
              onChange={handleChange('monthlySalary')}
              placeholder="0"
              step="100"
              min="0"
            />
          </div>
          <span className={styles.helpText}>Will be multiplied by 12 for annual calculation</span>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Nekudot Zikuy (נקודות זיכוי)</label>
          <div className={styles.inputWrapper}>
            <input
              type="number"
              className={`${styles.input} ${styles.inputNoPadding}`}
              defaultValue={personalInfo.creditPoints || ''}
              onBlur={handleBlur('creditPoints')}
              onChange={handleChange('creditPoints')}
              placeholder="2.25"
              step="0.25"
              min="0"
              max="20"
            />
          </div>
          <span className={styles.helpText}>Default: 2.25 points</span>
        </div>

        <div className={styles.field}>
          <div className={styles.labelWithButton}>
            <label className={styles.label}>USD/NIS Exchange Rate</label>
            <button 
              className={styles.refreshButton}
              onClick={handleFetchRate}
              disabled={isLoadingRate}
              title="Fetch current rate"
            >
              <span className={`${styles.refreshIcon} ${isLoadingRate ? styles.refreshIconSpinning : ''}`}>
                🔄
              </span>
              {isLoadingRate ? 'Loading...' : 'Fetch'}
            </button>
          </div>
          <div className={styles.inputWrapper}>
            <input
              type="number"
              className={`${styles.input} ${styles.inputNoPadding}`}
              value={personalInfo.exchangeRate || ''}
              onChange={handleChange('exchangeRate')}
              placeholder="3.20"
              step="0.01"
              min="1"
              max="10"
            />
          </div>
          <span className={styles.helpText}>
            {rateError ? (
              <span style={{ color: 'var(--color-error)' }}>{rateError}</span>
            ) : rateDate ? (
              <>Updated: {formatRateDate(rateDate)}</>
            ) : (
              <>Click Fetch to get current rate</>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
