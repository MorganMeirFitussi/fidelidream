import { useState } from 'react';
import { useEquityStore } from '../store/useEquityStore';
import { calculateEquity } from '../lib/calculator';
import { formatUSD, formatNIS, formatPercentage, formatDate } from '../utils/formatters';
import { Modal, Input, Button, Badge, FormField } from './ui';
import type { CalculationResult, SimulatorParams } from '../types';
import { vars } from '../styles/theme.css';
import * as styles from '../styles/components.css';

interface SimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Get default date (1 year from now)
function getDefaultTargetDate(): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().split('T')[0];
}

export function SimulatorModal({ isOpen, onClose }: SimulatorModalProps) {
  const personalInfo = useEquityStore((state) => state.personalInfo);
  const stockOptions = useEquityStore((state) => state.stockOptions);
  const rsus = useEquityStore((state) => state.rsus);

  const [targetDate, setTargetDate] = useState(getDefaultTargetDate());
  const [stockPrice, setStockPrice] = useState('');
  const [exchangeRate, setExchangeRate] = useState('');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState('');

  const handleSimulate = () => {
    const price = parseFloat(stockPrice);
    if (isNaN(price) || price <= 0) {
      setError('Please enter a valid stock price');
      return;
    }

    if (!targetDate) {
      setError('Please select a target date');
      return;
    }

    const simulation: SimulatorParams = {
      targetDate,
      stockPrice: price,
      exchangeRate: exchangeRate ? parseFloat(exchangeRate) : undefined,
    };

    const calcResult = calculateEquity(personalInfo, stockOptions, rsus, simulation);
    setResult(calcResult);
    setError('');
  };

  const handleClose = () => {
    setResult(null);
    setError('');
    setStockPrice('');
    setExchangeRate('');
    setTargetDate(getDefaultTargetDate());
    onClose();
  };

  const hasPackages = stockOptions.length > 0 || rsus.length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="🔮 Equity Simulator"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {!result && (
            <Button onClick={handleSimulate} disabled={!hasPackages}>
              🔮 Simulate
            </Button>
          )}
          {result && (
            <Button onClick={() => setResult(null)}>
              ← Back to Form
            </Button>
          )}
        </>
      }
    >
      {!result ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: vars.space.lg }}>
          {!hasPackages && (
            <div style={{ 
              padding: vars.space.md, 
              backgroundColor: vars.color.warningLight, 
              borderRadius: vars.borderRadius.md,
              color: vars.color.warning,
              fontSize: vars.fontSize.sm,
            }}>
              ⚠️ Add some packages first to simulate future values.
            </div>
          )}

          <FormField label="Target Date" helpText="Select a future date to project your equity value">
            <Input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </FormField>

          <FormField 
            label="Stock Price (USD)" 
            helpText={`Current: ${formatUSD(personalInfo.stockPrice)}`}
            error={error && stockPrice === '' ? error : undefined}
          >
            <Input
              type="number"
              value={stockPrice}
              onChange={(e) => setStockPrice(e.target.value)}
              placeholder="Enter projected stock price"
              prefix="$"
              step="0.01"
              min="0"
            />
          </FormField>

          <FormField 
            label="Exchange Rate (optional)" 
            helpText={`Current: ${personalInfo.exchangeRate.toFixed(4)} USD/NIS`}
          >
            <Input
              type="number"
              value={exchangeRate}
              onChange={(e) => setExchangeRate(e.target.value)}
              placeholder={personalInfo.exchangeRate.toFixed(4)}
              step="0.0001"
              min="0"
            />
          </FormField>

          {error && (
            <div style={{ color: vars.color.error, fontSize: vars.fontSize.sm }}>
              {error}
            </div>
          )}

          <div style={{ 
            padding: vars.space.md, 
            backgroundColor: vars.color.primaryLight, 
            borderRadius: vars.borderRadius.md,
            fontSize: vars.fontSize.sm,
            color: vars.color.textSecondary,
          }}>
            💡 The simulator will recalculate vested quantities based on the target date and apply the projected stock price.
          </div>
        </div>
      ) : (
        <div>
          {/* Simulation Header */}
          <div style={{ 
            padding: vars.space.md, 
            backgroundColor: vars.color.primaryLight, 
            borderRadius: vars.borderRadius.md,
            marginBottom: vars.space.lg,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: vars.fontSize.sm, color: vars.color.primary }}>
              📅 Projected Value as of
            </div>
            <div style={{ fontSize: vars.fontSize.lg, fontWeight: vars.fontWeight.semibold, color: vars.color.primary }}>
              {formatDate(targetDate)}
            </div>
            <div style={{ fontSize: vars.fontSize.xs, color: vars.color.textMuted, marginTop: vars.space.xs }}>
              Stock: {formatUSD(result.personalInfo.stockPrice)} • Rate: {result.personalInfo.exchangeRate.toFixed(4)}
            </div>
          </div>

          {/* Results Summary */}
          <div className={styles.resultsHeader} style={{ border: `2px solid ${vars.color.primary}`, borderRadius: vars.borderRadius.lg, padding: vars.space.lg }}>
            <h3 className={styles.resultsTitle}>
              💰 Projected Net Value
            </h3>
            <div className={styles.resultsValue}>{formatUSD(result.totals.netValueUSD)}</div>
            <div className={styles.resultsSubValue}>{formatNIS(result.totals.netValueNIS)}</div>
            <div style={{ marginTop: vars.space.md }}>
              <Badge variant="info">
                📊 Effective Tax Rate: {formatPercentage(result.totals.effectiveTaxRate)}
              </Badge>
            </div>
          </div>

          {/* Summary Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: vars.space.md, marginTop: vars.space.lg }}>
            <div style={{ textAlign: 'center', padding: vars.space.md, backgroundColor: vars.color.surfaceHover, borderRadius: vars.borderRadius.md }}>
              <div style={{ fontSize: vars.fontSize.sm, color: vars.color.textMuted }}>Gross Value</div>
              <div style={{ fontSize: vars.fontSize.lg, fontWeight: vars.fontWeight.semibold }}>{formatUSD(result.totals.grossValueUSD)}</div>
              <div style={{ fontSize: vars.fontSize.sm, color: vars.color.textSecondary }}>{formatNIS(result.totals.grossValueNIS)}</div>
            </div>
            <div style={{ textAlign: 'center', padding: vars.space.md, backgroundColor: vars.color.errorLight, borderRadius: vars.borderRadius.md }}>
              <div style={{ fontSize: vars.fontSize.sm, color: vars.color.textMuted }}>Total Tax</div>
              <div style={{ fontSize: vars.fontSize.lg, fontWeight: vars.fontWeight.semibold, color: vars.color.error }}>
                -{formatNIS(result.totals.taxBreakdown.totalTax)}
              </div>
            </div>
          </div>

          {/* Per-Package Preview */}
          {result.packages.length > 0 && (
            <div style={{ marginTop: vars.space.lg }}>
              <div className={styles.breakdownTitle}>📦 Package Breakdown</div>
              {result.packages.map((pkg) => (
                <div 
                  key={pkg.id} 
                  style={{ 
                    padding: vars.space.sm, 
                    backgroundColor: vars.color.surfaceHover, 
                    borderRadius: vars.borderRadius.md,
                    marginBottom: vars.space.xs,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontWeight: vars.fontWeight.medium, fontSize: vars.fontSize.sm }}>{pkg.name}</span>
                  <span style={{ 
                    fontWeight: vars.fontWeight.semibold, 
                    color: pkg.isUnderwater ? vars.color.textMuted : vars.color.success,
                    fontSize: vars.fontSize.sm,
                  }}>
                    {pkg.isUnderwater ? 'Underwater' : formatUSD(pkg.netValueUSD)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
