import type { StockOptionPackage, RSUPackage, PackageType } from '../types';
import { detectTaxRoute } from '../lib/optionsCalculations';
import { formatDate, formatUSD } from '../utils/formatters';
import { Badge } from './ui';
import * as styles from '../styles/components.css';

interface PackageCardProps {
  package_: StockOptionPackage | RSUPackage;
  type: PackageType;
  currentStockPrice?: number;
  onEdit: () => void;
  onDelete: () => void;
  // Drag and drop props
  isDragging?: boolean;
  isDragOver?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: () => void;
  onDrop?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
}

export function PackageCard({ 
  package_, 
  type, 
  currentStockPrice, 
  onEdit, 
  onDelete,
  isDragging,
  isDragOver,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
}: PackageCardProps) {
  const isOption = type === 'option';
  const option = package_ as StockOptionPackage;
  const rsu = package_ as RSUPackage;

  const route = isOption ? detectTaxRoute(option.exercisePrice, option.averagePrice) : null;
  const isUnderwater = isOption && currentStockPrice !== undefined && currentStockPrice > 0 && currentStockPrice < option.exercisePrice;

  const cardClassName = [
    styles.packageCard,
    isDragging && styles.packageCardDragging,
    isDragOver && styles.packageCardDragOver,
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={cardClassName}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
    >
      <div className={styles.packageCardHeader}>
        <div className={styles.packageNameContainer}>
          <span className={styles.dragHandle} title="Drag to reorder">⋮⋮</span>
          <h4 className={styles.packageName}>{package_.name}</h4>
        </div>
        <div className={styles.packageActions}>
          <button className={styles.actionButton} onClick={onEdit} title="Edit package">
            ✏️
          </button>
          <button className={styles.actionButton} onClick={onDelete} title="Delete package">
            🗑️
          </button>
        </div>
      </div>

      <div className={styles.packageStats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Total Qty</span>
          <span className={styles.statValue}>{package_.totalQuantity.toLocaleString()}</span>
        </div>

        <div className={styles.stat}>
          <span className={styles.statLabel}>Vested / Used</span>
          <span className={styles.statValue}>
            {isOption 
              ? `${(option.vestedQuantity || 0).toLocaleString()} / ${option.usedQuantity.toLocaleString()}`
              : `${rsu.vestedQuantity.toLocaleString()} / ${(rsu.usedQuantity || 0).toLocaleString()}`
            }
          </span>
        </div>

        {isOption ? (
          <>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Exercise Price</span>
              <span className={styles.statValue}>{formatUSD(option.exercisePrice)}</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Avg Price</span>
              <span className={styles.statValue}>{formatUSD(option.averagePrice)}</span>
            </div>
          </>
        ) : (
          <div className={styles.stat}>
            <span className={styles.statLabel}>Avg Vesting Price</span>
            <span className={styles.statValue}>{formatUSD(rsu.averageVestingPrice)}</span>
          </div>
        )}

        <div className={styles.stat}>
          <span className={styles.statLabel}>Schedule</span>
          <span className={styles.statValue}>
            {isOption 
              ? `${option.vestingDurationYears || 4}y / ${option.vestingFrequency || 'quarterly'}`
              : `${rsu.vestingDurationYears || 4}y / ${rsu.vestingFrequency || 'quarterly'}`
            }
          </span>
        </div>

        <div className={styles.stat}>
          <span className={styles.statLabel}>First Vest</span>
          <span className={styles.statValue}>{formatDate(package_.firstVestingDate)}</span>
        </div>
      </div>

      {isOption && (
        <div className={styles.badgeContainer}>
          {route && (
            <Badge
              variant={route === 'capital_gain' ? 'success' : 'warning'}
              tooltip={
                route === 'capital_gain' ? (
                  <>
                    <strong>Capital Gain Route (Article 102-A)</strong><br/>
                    Exercise Price ≥ Average Price<br/>
                    ✓ All profit taxed at 30%<br/>
                    ✓ No Bituah Leumi<br/>
                    ✓ No Health Insurance
                  </>
                ) : (
                  <>
                    <strong>Ordinary Income Route (Article 102-B)</strong><br/>
                    Exercise Price &lt; Average Price<br/>
                    ⚠ "Benefit" portion taxed at marginal rate (up to 50%)<br/>
                    ⚠ Bituah Leumi on benefit<br/>
                    ⚠ Health Insurance on benefit<br/>
                    ✓ Capital gain taxed at 30%
                  </>
                )
              }
            >
              {route === 'capital_gain' ? '✓ Capital Gain Route (30%)' : '⚠ Ordinary Income Route'}
            </Badge>
          )}
          
          {isUnderwater && (
            <Badge
              variant="error"
              tooltip={
                <>
                  <strong>Underwater Options</strong><br/>
                  Current Stock Price &lt; Exercise Price<br/>
                  ⚠ Options currently have no intrinsic value<br/>
                  ⚠ Exercising would result in a loss<br/>
                  💡 Wait for stock price to rise above {formatUSD(option.exercisePrice)}
                </>
              }
            >
              🌊 Underwater
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
