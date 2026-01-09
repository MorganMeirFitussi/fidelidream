import { useState } from 'react';
import { useEquityStore } from '../../store/useEquityStore';
import { PackageCard } from '../PackageCard';
import { AddPackageModal } from '../AddPackageModal';
import type { StockOptionPackage } from '../../types';
import * as styles from '../Section/Section.css';

export function StockOptionsSection() {
  const stockOptions = useEquityStore((state) => state.stockOptions);
  const stockPrice = useEquityStore((state) => state.personalInfo.stockPrice);
  const deleteStockOption = useEquityStore((state) => state.deleteStockOption);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<StockOptionPackage | null>(null);

  const handleAdd = () => {
    setEditingPackage(null);
    setIsModalOpen(true);
  };

  const handleEdit = (pkg: StockOptionPackage) => {
    setEditingPackage(pkg);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      deleteStockOption(id);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingPackage(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <span>📊</span> Stock Options
        </h2>
        <button className={styles.addButton} onClick={handleAdd}>
          <span>+</span> Add Package
        </button>
      </div>

      {stockOptions.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📋</div>
          <p className={styles.emptyText}>No stock option packages yet</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {stockOptions.map((pkg) => (
            <PackageCard
              key={pkg.id}
              package_={pkg}
              type="option"
              currentStockPrice={stockPrice}
              onEdit={() => handleEdit(pkg)}
              onDelete={() => handleDelete(pkg.id)}
            />
          ))}
        </div>
      )}

      {isModalOpen && (
        <AddPackageModal
          type="option"
          editingPackage={editingPackage}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
