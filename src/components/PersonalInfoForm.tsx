import { useEquityStore } from '../store/useEquityStore';
import { useExchangeRate } from '../hooks';
import { Input, FormField } from './ui';
import { vars } from '../styles/theme.css';
import * as styles from '../styles/components.css';

export function PersonalInfoForm() {
  const personalInfo = useEquityStore((state) => state.personalInfo);
  const updatePersonalInfo = useEquityStore((state) => state.updatePersonalInfo);
  
  const { isLoading, date, error, fetch } = useExchangeRate();

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
    const rate = await fetch();
    if (rate !== null) {
      updatePersonalInfo({ exchangeRate: rate });
    }
  };

  const formatRateDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>
        <span>💼</span> Personal Information
      </h2>
      
      <div className={styles.formGrid}>
        <FormField label="Current Stock Price">
          <Input
            type="number"
            prefix="$"
            value={personalInfo.stockPrice || ''}
            onChange={handleChange('stockPrice')}
            placeholder="0.00"
            step="0.01"
            min="0"
          />
        </FormField>

        <FormField label="Monthly Salary" helpText="Will be multiplied by 12 for annual calculation">
          <Input
            type="number"
            prefix="₪"
            value={personalInfo.monthlySalary || ''}
            onChange={handleChange('monthlySalary')}
            placeholder="0"
            step="100"
            min="0"
          />
        </FormField>

        <FormField label="Nekudot Zikuy (נקודות זיכוי)" helpText="Default: 2.25 points">
          <Input
            type="number"
            value={personalInfo.creditPoints || ''}
            onChange={handleChange('creditPoints')}
            placeholder="2.25"
            step="0.25"
            min="0"
            max="20"
          />
        </FormField>

        <FormField 
          label="USD/NIS Exchange Rate"
          helpText={
            error 
              ? error 
              : date 
                ? `Updated: ${formatRateDate(date)}` 
                : 'Click Fetch to get current rate'
          }
        >
          <div style={{ display: 'flex', gap: vars.space.sm, alignItems: 'stretch' }}>
            <div style={{ flex: 1 }}>
              <Input
                type="number"
                value={personalInfo.exchangeRate || ''}
                onChange={handleChange('exchangeRate')}
                placeholder="3.20"
                step="0.01"
                min="1"
                max="10"
              />
            </div>
            <button
              onClick={handleFetchRate}
              disabled={isLoading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: vars.space.xs,
                padding: `0 ${vars.space.md}`,
                backgroundColor: vars.color.primary,
                color: vars.color.textInverse,
                border: 'none',
                borderRadius: vars.borderRadius.md,
                fontSize: vars.fontSize.sm,
                fontWeight: vars.fontWeight.medium,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{ 
                display: 'inline-block',
                animation: isLoading ? 'spin 1s linear infinite' : 'none',
              }}>🔄</span>
              {isLoading ? 'Loading...' : 'Fetch'}
            </button>
          </div>
        </FormField>
      </div>
    </div>
  );
}
