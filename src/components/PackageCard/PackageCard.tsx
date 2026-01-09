import type { StockOptionPackage, RSUPackage, PackageType } from '../../types';
import { detectTaxRoute } from '../../lib/optionsCalculations';
import { formatDate, formatUSD } from '../../utils/formatters';
import * as styles from './PackageCard.css';

interface PackageCardProps {
  package_: StockOptionPackage | RSUPackage;
  type: PackageType;
  currentStockPrice?: number;
  onEdit: () => void;
  onDelete: () => void;
}

export function PackageCard({ package_, type, currentStockPrice, onEdit, onDelete }: PackageCardProps) {
  const isOption = type === 'option';
  const option = package_ as StockOptionPackage;
  const rsu = package_ as RSUPackage;

  const route = isOption ? detectTaxRoute(option.exercisePrice, option.averagePrice) : null;
  const isUnderwater = isOption && currentStockPrice !== undefined && currentStockPrice > 0 && currentStockPrice < option.exercisePrice;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h4 className={styles.name}>{package_.name}</h4>
        <div className={styles.actions}>
          <button 
            className={styles.actionButton} 
            onClick={onEdit}
            title="Edit package"
          >
            ✏️
          </button>
          <button 
            className={`${styles.actionButton} ${styles.deleteButton}`} 
            onClick={onDelete}
            title="Delete package"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className={styles.details}>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Total Qty</span>
          <span className={styles.detailValue}>{package_.totalQuantity.toLocaleString()}</span>
        </div>

        {isOption ? (
          <>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Vested / Used</span>
              <span className={styles.detailValue}>
                {(option.vestedQuantity || 0).toLocaleString()} / {option.usedQuantity.toLocaleString()}
              </span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Exercise Price</span>
              <span className={styles.detailValue}>{formatUSD(option.exercisePrice)}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Avg Price</span>
              <span className={styles.detailValue}>{formatUSD(option.averagePrice)}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Schedule</span>
              <span className={styles.detailValue}>
                {option.vestingDurationYears || 4}y / {option.vestingFrequency || 'quarterly'}
              </span>
            </div>
          </>
        ) : (
          <>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Vested Qty</span>
              <span className={styles.detailValue}>{rsu.vestedQuantity.toLocaleString()}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Avg Vesting Price</span>
              <span className={styles.detailValue}>{formatUSD(rsu.averageVestingPrice)}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Schedule</span>
              <span className={styles.detailValue}>
                {rsu.vestingDurationYears || 4}y / {rsu.vestingFrequency || 'quarterly'}
              </span>
            </div>
          </>
        )}

        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>First Vest</span>
          <span className={styles.detailValue}>{formatDate(package_.firstVestingDate)}</span>
        </div>
      </div>

      {isOption && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {route && (
            <div className={styles.tooltipContainer}>
              <div className={route === 'capital_gain' ? styles.capitalGainBadge : styles.ordinaryIncomeBadge}>
                {route === 'capital_gain' ? (
                  <>✓ Capital Gain Route (30%)</>
                ) : (
                  <>⚠ Ordinary Income Route</>
                )}
              </div>
              <div className={styles.tooltipContent}>
                {route === 'capital_gain' ? (
                  <>
                    <div className={styles.tooltipTitle}>Capital Gain Route (Article 102-A)</div>
                    <div>Exercise Price ≥ Average Price</div>
                    <div style={{ marginTop: '4px' }}>
                      ✓ All profit taxed at <strong>30%</strong><br/>
                      ✓ No Bituah Leumi<br/>
                      ✓ No Health Insurance
                    </div>
                  </>
                ) : (
                  <>
                    <div className={styles.tooltipTitle}>Ordinary Income Route (Article 102-B)</div>
                    <div>Exercise Price &lt; Average Price</div>
                    <div style={{ marginTop: '4px' }}>
                      ⚠ "Benefit" portion taxed at <strong>marginal rate</strong> (up to 50%)<br/>
                      ⚠ Bituah Leumi on benefit<br/>
                      ⚠ Health Insurance on benefit<br/>
                      ✓ Capital gain taxed at 30%
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
          
          {isUnderwater && (
            <div className={styles.tooltipContainer}>
              <div className={styles.underwaterBadge}>
                🌊 Underwater
              </div>
              <div className={styles.tooltipContent}>
                <div className={styles.tooltipTitle}>Underwater Options</div>
                <div>Current Stock Price &lt; Exercise Price</div>
                <div style={{ marginTop: '4px' }}>
                  ⚠ Options currently have <strong>no intrinsic value</strong><br/>
                  ⚠ Exercising would result in a loss<br/>
                  💡 Wait for stock price to rise above {formatUSD(option.exercisePrice)}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
