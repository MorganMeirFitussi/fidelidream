import type { CalculationResult } from '../types';
import { formatUSD, formatNIS, formatPercentage } from '../utils/formatters';
import { Badge } from './ui';
import { vars } from '../styles/theme.css';
import * as styles from '../styles/components.css';

interface ResultsProps {
  result: CalculationResult;
}

export function Results({ result }: ResultsProps) {
  const { totals, packages } = result;

  return (
    <div className={styles.resultsCard}>
      {/* Header */}
      <div className={styles.resultsHeader}>
        <h3 className={styles.resultsTitle}>
          💰 Net Value (After Tax)
        </h3>
        <div className={styles.resultsValue}>{formatUSD(totals.netValueUSD)}</div>
        <div className={styles.resultsSubValue}>{formatNIS(totals.netValueNIS)}</div>
        <div style={{ marginTop: vars.space.md }}>
          <Badge variant="info">
            📊 Effective Tax Rate: {formatPercentage(totals.effectiveTaxRate)}
          </Badge>
        </div>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: vars.space.md, marginBottom: vars.space.lg }}>
        <div style={{ textAlign: 'center', padding: vars.space.md, backgroundColor: vars.color.surfaceHover, borderRadius: vars.borderRadius.md }}>
          <div style={{ fontSize: vars.fontSize.sm, color: vars.color.textMuted }}>Gross Value</div>
          <div style={{ fontSize: vars.fontSize.xl, fontWeight: vars.fontWeight.semibold }}>{formatUSD(totals.grossValueUSD)}</div>
          <div style={{ fontSize: vars.fontSize.sm, color: vars.color.textSecondary }}>{formatNIS(totals.grossValueNIS)}</div>
        </div>
        <div style={{ textAlign: 'center', padding: vars.space.md, backgroundColor: vars.color.errorLight, borderRadius: vars.borderRadius.md }}>
          <div style={{ fontSize: vars.fontSize.sm, color: vars.color.textMuted }}>Total Tax</div>
          <div style={{ fontSize: vars.fontSize.xl, fontWeight: vars.fontWeight.semibold, color: vars.color.error }}>
            -{formatNIS(totals.taxBreakdown.totalTax)}
          </div>
          <div style={{ fontSize: vars.fontSize.sm, color: vars.color.textSecondary }}>
            -{formatUSD(totals.taxBreakdown.totalTax / result.personalInfo.exchangeRate)}
          </div>
        </div>
      </div>

      {/* Tax Breakdown */}
      <div className={styles.breakdownSection}>
        <div className={styles.breakdownTitle}>📋 Tax Breakdown</div>
        
        <div className={styles.breakdownItem}>
          <span className={styles.breakdownLabel}>Income Tax (Marginal Rate)</span>
          <span className={styles.breakdownValue}>{formatNIS(totals.taxBreakdown.incomeTax)}</span>
        </div>

        <div className={styles.breakdownItem}>
          <span className={styles.breakdownLabel} style={{ cursor: 'help' }} title="25% base rate + 5% Smotrich Surtax (2025)">
            Capital Gains Tax (30%) ⓘ
          </span>
          <span className={styles.breakdownValue}>{formatNIS(totals.taxBreakdown.capitalGainsTax)}</span>
        </div>

        <div className={styles.breakdownItem}>
          <span className={styles.breakdownLabel}>Bituah Leumi (Social Security)</span>
          <span className={styles.breakdownValue}>{formatNIS(totals.taxBreakdown.bituahLeumi)}</span>
        </div>

        <div className={styles.breakdownItem}>
          <span className={styles.breakdownLabel}>Health Insurance</span>
          <span className={styles.breakdownValue}>{formatNIS(totals.taxBreakdown.healthInsurance)}</span>
        </div>

        <div className={styles.breakdownItem}>
          <span className={styles.breakdownLabel} style={{ color: vars.color.success }}>
            Credit Points Reduction (נקודות זיכוי)
          </span>
          <span className={styles.breakdownValue} style={{ color: vars.color.success }}>
            -{formatNIS(totals.taxBreakdown.creditPointsReduction)}
          </span>
        </div>

        <div className={styles.breakdownItem} style={{ fontWeight: vars.fontWeight.semibold, borderTop: `2px solid ${vars.color.border}`, marginTop: vars.space.sm, paddingTop: vars.space.md }}>
          <span>Total Tax</span>
          <span>{formatNIS(totals.taxBreakdown.totalTax)}</span>
        </div>
      </div>

      {/* Per-Package Breakdown */}
      {packages.length > 0 && (
        <div className={styles.breakdownSection} style={{ marginTop: vars.space.lg }}>
          <div className={styles.breakdownTitle}>📦 Per-Package Breakdown</div>
          
          {packages.map((pkg) => (
            <div 
              key={pkg.id} 
              style={{ 
                padding: vars.space.md, 
                backgroundColor: vars.color.surfaceHover, 
                borderRadius: vars.borderRadius.md,
                marginBottom: vars.space.sm,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: vars.space.sm }}>
                <span style={{ fontWeight: vars.fontWeight.medium }}>{pkg.name}</span>
                <div style={{ display: 'flex', gap: vars.space.xs }}>
                  <Badge variant="info">
                    {pkg.type === 'option' ? 'Stock Option' : 'RSU'}
                  </Badge>
                  {pkg.route && (
                    <Badge variant={pkg.route === 'capital_gain' ? 'success' : 'warning'}>
                      {pkg.route === 'capital_gain' ? 'CG Route' : 'OI Route'}
                    </Badge>
                  )}
                  {pkg.isUnderwater && (
                    <Badge variant="error">🌊 Underwater</Badge>
                  )}
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: vars.space.sm, fontSize: vars.fontSize.sm }}>
                <div>
                  <div style={{ color: vars.color.textMuted }}>Gross</div>
                  <div style={{ fontWeight: vars.fontWeight.medium, color: pkg.isUnderwater ? vars.color.textMuted : vars.color.text }}>
                    {pkg.isUnderwater ? '$0.00' : formatUSD(pkg.grossValueUSD)}
                  </div>
                </div>
                <div>
                  <div style={{ color: vars.color.textMuted }}>Tax</div>
                  <div style={{ fontWeight: vars.fontWeight.medium, color: pkg.isUnderwater ? vars.color.textMuted : vars.color.error }}>
                    {pkg.isUnderwater ? '₪0' : `-${formatNIS(pkg.taxBreakdown.totalTax)}`}
                  </div>
                </div>
                <div>
                  <div style={{ color: vars.color.textMuted }}>Net</div>
                  <div style={{ fontWeight: vars.fontWeight.medium, color: pkg.isUnderwater ? vars.color.textMuted : vars.color.success }}>
                    {pkg.isUnderwater ? '$0.00' : formatUSD(pkg.netValueUSD)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
