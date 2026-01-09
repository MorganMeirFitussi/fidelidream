import { useState } from 'react';
import { useEquityStore } from '../../store/useEquityStore';
import { PackageCard } from '../PackageCard';
import { AddPackageModal } from '../AddPackageModal';
import type { RSUPackage } from '../../types';
import * as styles from '../Section/Section.css';

export function RSUsSection() {
  const rsus = useEquityStore((state) => state.rsus);
  const deleteRSU = useEquityStore((state) => state.deleteRSU);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<RSUPackage | null>(null);

  const handleAdd = () => {
    setEditingPackage(null);
    setIsModalOpen(true);
  };

  const handleEdit = (pkg: RSUPackage) => {
    setEditingPackage(pkg);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      deleteRSU(id);
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
          <span>📈</span> RSUs
        </h2>
        <button className={styles.addButton} onClick={handleAdd}>
          <span>+</span> Add Package
        </button>
      </div>

      {rsus.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📋</div>
          <p className={styles.emptyText}>No RSU packages yet</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {rsus.map((pkg) => (
            <PackageCard
              key={pkg.id}
              package_={pkg}
              type="rsu"
              onEdit={() => handleEdit(pkg)}
              onDelete={() => handleDelete(pkg.id)}
            />
          ))}
        </div>
      )}

      {isModalOpen && (
        <AddPackageModal
          type="rsu"
          editingPackage={editingPackage}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
