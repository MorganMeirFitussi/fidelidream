import { useEquityStore } from '../store/useEquityStore';
import { useModal } from '../hooks';
import { PackageForm } from './PackageForm';
import { PackageCard } from './PackageCard';
import { Button } from './ui';
import type { StockOptionPackage, RSUPackage, PackageType } from '../types';
import * as styles from '../styles/components.css';

interface PackageSectionProps {
  type: PackageType;
}

export function PackageSection({ type }: PackageSectionProps) {
  const isOption = type === 'option';
  
  // Get data from store based on type
  const packages = useEquityStore((state) => 
    isOption ? state.stockOptions : state.rsus
  );
  const stockPrice = useEquityStore((state) => state.personalInfo.stockPrice);
  const deleteOption = useEquityStore((state) => state.deleteStockOption);
  const deleteRSU = useEquityStore((state) => state.deleteRSU);

  // Modal state
  const modal = useModal<StockOptionPackage | RSUPackage>();

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      isOption ? deleteOption(id) : deleteRSU(id);
    }
  };

  const title = isOption ? 'Stock Options' : 'RSUs';
  const icon = isOption ? '📊' : '📈';
  const emptyMessage = isOption ? 'No stock option packages yet' : 'No RSU packages yet';

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>
          <span>{icon}</span> {title}
        </h2>
        <Button onClick={modal.open}>
          + Add Package
        </Button>
      </div>

      {packages.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📋</div>
          <p className={styles.emptyText}>{emptyMessage}</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              package_={pkg}
              type={type}
              currentStockPrice={isOption ? stockPrice : undefined}
              onEdit={() => modal.openWith(pkg)}
              onDelete={() => handleDelete(pkg.id)}
            />
          ))}
        </div>
      )}

      {modal.isOpen && (
        <PackageForm
          type={type}
          editingPackage={modal.data}
          onClose={modal.close}
        />
      )}
    </div>
  );
}
