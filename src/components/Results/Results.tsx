import type { CalculationResult } from '../../types';
import { formatUSD, formatNIS, formatPercentage } from '../../utils/formatters';
import * as styles from './Results.css';

interface ResultsProps {
  result: CalculationResult;
}

export function Results({ result }: ResultsProps) {
  const { totals, packages } = result;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <span>💰</span> Calculation Results
        </h2>
        <p className={styles.subtitle}>
          Based on current stock price and your equity packages
        </p>
      </div>

      {/* Main Totals */}
      <div className={styles.totalsGrid}>
        <div className={styles.totalItem}>
          <div className={styles.totalLabel}>Total Gross Value</div>
          <div className={styles.totalValue}>{formatUSD(totals.grossValueUSD)}</div>
          <div className={styles.totalValueSmall}>{formatNIS(totals.grossValueNIS)}</div>
        </div>

        <div className={styles.totalItem}>
          <div className={styles.totalLabel}>Total Tax</div>
          <div className={styles.totalValue} style={{ color: '#dc2626' }}>
            -{formatNIS(totals.taxBreakdown.totalTax)}
          </div>
          <div className={styles.totalValueSmall}>
            -{formatUSD(totals.taxBreakdown.totalTax / result.personalInfo.exchangeRate)}
          </div>
        </div>

        <div className={styles.totalItem}>
          <div className={styles.totalLabel}>Net Value (After Tax)</div>
          <div className={styles.totalValue} style={{ color: '#059669' }}>
            {formatUSD(totals.netValueUSD)}
          </div>
          <div className={styles.totalValueSmall}>{formatNIS(totals.netValueNIS)}</div>
        </div>
      </div>

      {/* Effective Tax Rate */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div className={styles.effectiveRate}>
          <span>📊</span>
          Effective Tax Rate: {formatPercentage(totals.effectiveTaxRate)}
        </div>
      </div>

      {/* Tax Breakdown */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <span>📋</span> Tax Breakdown
        </h3>
        <table className={styles.breakdownTable}>
          <tbody>
            <tr className={styles.tableRow}>
              <td className={styles.tableCellLabel}>Income Tax (Marginal Rate)</td>
              <td className={styles.tableCellValue}>{formatNIS(totals.taxBreakdown.incomeTax)}</td>
            </tr>
            <tr className={styles.tableRow}>
              <td className={styles.tableCellLabel}>
                <span className={styles.tooltipContainer}>
                  <span className={styles.tooltipTrigger}>
                    Capital Gains Tax (30%)
                  </span>
                  <span className={styles.tooltipContent}>
                    25% base rate + 5% Smotrich Surtax (2025)
                  </span>
                </span>
              </td>
              <td className={styles.tableCellValue}>{formatNIS(totals.taxBreakdown.capitalGainsTax)}</td>
            </tr>
            <tr className={styles.tableRow}>
              <td className={styles.tableCellLabel}>Bituah Leumi (Social Security)</td>
              <td className={styles.tableCellValue}>{formatNIS(totals.taxBreakdown.bituahLeumi)}</td>
            </tr>
            <tr className={styles.tableRow}>
              <td className={styles.tableCellLabel}>Health Insurance</td>
              <td className={styles.tableCellValue}>{formatNIS(totals.taxBreakdown.healthInsurance)}</td>
            </tr>
            <tr className={styles.tableRow}>
              <td className={`${styles.tableCellLabel} ${styles.tableCellNegative}`}>
                Credit Points Reduction (נקודות זיכוי)
              </td>
              <td className={`${styles.tableCellValue} ${styles.tableCellNegative}`}>
                -{formatNIS(totals.taxBreakdown.creditPointsReduction)}
              </td>
            </tr>
            <tr className={`${styles.tableRow} ${styles.tableRowTotal}`}>
              <td className={styles.tableCell}>Total Tax</td>
              <td className={styles.tableCellValue}>{formatNIS(totals.taxBreakdown.totalTax)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Per-Package Breakdown */}
      {packages.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <span>📦</span> Per-Package Breakdown
          </h3>
          <div className={styles.packageBreakdown}>
            {packages.map((pkg) => (
              <div key={pkg.id} className={styles.packageCard}>
                <div className={styles.packageHeader}>
                  <span className={styles.packageName}>{pkg.name}</span>
                  <span className={styles.packageType}>
                    {pkg.type === 'option' ? 'Stock Option' : 'RSU'}
                    {pkg.route && ` • ${pkg.route === 'capital_gain' ? 'CG Route' : 'OI Route'}`}
                    {pkg.isUnderwater && ' • 🌊 Underwater'}
                  </span>
                </div>
                <div className={styles.packageDetails}>
                  <div className={styles.packageDetail}>
                    <span className={styles.packageDetailLabel}>Gross</span>
                    <span className={styles.packageDetailValue}>
                      {pkg.isUnderwater ? '$0.00' : formatUSD(pkg.grossValueUSD)}
                    </span>
                  </div>
                  <div className={styles.packageDetail}>
                    <span className={styles.packageDetailLabel}>Tax</span>
                    <span className={styles.packageDetailValue} style={{ color: pkg.isUnderwater ? '#6b7280' : '#dc2626' }}>
                      {pkg.isUnderwater ? '₪0' : `-${formatNIS(pkg.taxBreakdown.totalTax)}`}
                    </span>
                  </div>
                  <div className={styles.packageDetail}>
                    <span className={styles.packageDetailLabel}>Net</span>
                    <span className={styles.packageDetailValue} style={{ color: pkg.isUnderwater ? '#6b7280' : '#059669' }}>
                      {pkg.isUnderwater ? '$0.00' : formatUSD(pkg.netValueUSD)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
