import { useState, useEffect } from 'react';
import { useEquityStore } from '../../store/useEquityStore';
import { validateStockOption, validateRSU, getErrorMessages } from '../../utils/validators';
import { calculateVestedQuantity } from '../../utils/formatters';
import type { StockOptionPackage, RSUPackage, PackageType, VestingFrequency } from '../../types';
import * as styles from './AddPackageModal.css';

interface AddPackageModalProps {
  type: PackageType;
  editingPackage: StockOptionPackage | RSUPackage | null;
  onClose: () => void;
}

export function AddPackageModal({ type, editingPackage, onClose }: AddPackageModalProps) {
  const addStockOption = useEquityStore((state) => state.addStockOption);
  const updateStockOption = useEquityStore((state) => state.updateStockOption);
  const addRSU = useEquityStore((state) => state.addRSU);
  const updateRSU = useEquityStore((state) => state.updateRSU);

  const isEditing = !!editingPackage;
  const isOption = type === 'option';

  // Form state
  const [name, setName] = useState('');
  const [totalQuantity, setTotalQuantity] = useState('');
  const [usedQuantity, setUsedQuantity] = useState('');
  const [exercisePrice, setExercisePrice] = useState('');
  const [averagePrice, setAveragePrice] = useState('');
  const [averageVestingPrice, setAverageVestingPrice] = useState('');
  const [firstVestingDate, setFirstVestingDate] = useState('');
  const [vestingDurationYears, setVestingDurationYears] = useState('4');
  const [vestingFrequency, setVestingFrequency] = useState<VestingFrequency>('quarterly');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate vested quantity automatically for both options and RSUs
  // Using direct calculation (no useMemo) to ensure it always recalculates
  const calculatedVestedQuantity = calculateVestedQuantity(
    parseInt(totalQuantity) || 0,
    firstVestingDate,
    parseInt(vestingDurationYears) || 4,
    vestingFrequency
  );
  
  // Always use calculated value (no override)
  const effectiveVestedQuantity = calculatedVestedQuantity;
  
  // For options: available = vested - used
  const availableQuantity = isOption 
    ? Math.max(0, effectiveVestedQuantity - (parseInt(usedQuantity) || 0))
    : effectiveVestedQuantity;

  // Populate form when editing
  useEffect(() => {
    if (editingPackage) {
      setName(editingPackage.name);
      setTotalQuantity(editingPackage.totalQuantity.toString());
      setFirstVestingDate(editingPackage.firstVestingDate);

      if (isOption) {
        const opt = editingPackage as StockOptionPackage;
        setUsedQuantity(opt.usedQuantity.toString());
        setExercisePrice(opt.exercisePrice.toString());
        setAveragePrice(opt.averagePrice.toString());
        setVestingDurationYears(opt.vestingDurationYears?.toString() || '4');
        setVestingFrequency(opt.vestingFrequency || 'quarterly');
      } else {
        const rsu = editingPackage as RSUPackage;
        setAverageVestingPrice(rsu.averageVestingPrice.toString());
        setVestingDurationYears(rsu.vestingDurationYears?.toString() || '4');
        setVestingFrequency(rsu.vestingFrequency || 'quarterly');
      }
    }
  }, [editingPackage, isOption]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isOption) {
      const data = {
        name,
        totalQuantity: parseInt(totalQuantity) || 0,
        vestedQuantity: effectiveVestedQuantity,
        usedQuantity: parseInt(usedQuantity) || 0,
        exercisePrice: parseFloat(exercisePrice) || 0,
        averagePrice: parseFloat(averagePrice) || 0,
        firstVestingDate,
        vestingDurationYears: parseInt(vestingDurationYears) || 4,
        vestingFrequency,
      };

      const result = validateStockOption(data);
      if (!result.success) {
        setErrors(getErrorMessages(result.error));
        return;
      }

      if (isEditing) {
        updateStockOption(editingPackage!.id, data);
      } else {
        addStockOption(data);
      }
    } else {
      const data = {
        name,
        totalQuantity: parseInt(totalQuantity) || 0,
        vestedQuantity: effectiveVestedQuantity,
        averageVestingPrice: parseFloat(averageVestingPrice) || 0,
        firstVestingDate,
        vestingDurationYears: parseInt(vestingDurationYears) || 4,
        vestingFrequency,
      };

      const result = validateRSU(data);
      if (!result.success) {
        setErrors(getErrorMessages(result.error));
        return;
      }

      if (isEditing) {
        updateRSU(editingPackage!.id, data);
      } else {
        addRSU(data);
      }
    }

    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3 className={styles.title}>
            {isEditing ? 'Edit' : 'Add'} {isOption ? 'Stock Option' : 'RSU'} Package
          </h3>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Package Name</label>
            <input
              type="text"
              className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Initial Grant 2023"
              maxLength={50}
            />
            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Total Quantity</label>
              <input
                type="number"
                className={`${styles.input} ${errors.totalQuantity ? styles.inputError : ''}`}
                value={totalQuantity}
                onChange={(e) => setTotalQuantity(e.target.value)}
                placeholder="0"
                min="0"
              />
              {errors.totalQuantity && <span className={styles.errorText}>{errors.totalQuantity}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>First Vesting Date</label>
              <input
                type="date"
                className={`${styles.input} ${errors.firstVestingDate ? styles.inputError : ''}`}
                value={firstVestingDate}
                onChange={(e) => setFirstVestingDate(e.target.value)}
              />
              {errors.firstVestingDate && <span className={styles.errorText}>{errors.firstVestingDate}</span>}
            </div>
          </div>

          {/* Vesting Schedule - for both options and RSUs */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Vesting Duration</label>
              <select
                className={styles.select}
                value={vestingDurationYears}
                onChange={(e) => setVestingDurationYears(e.target.value)}
              >
                <option value="1">1 year</option>
                <option value="2">2 years</option>
                <option value="3">3 years</option>
                <option value="4">4 years</option>
                <option value="5">5 years</option>
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Vesting Frequency</label>
              <select
                className={styles.select}
                value={vestingFrequency}
                onChange={(e) => setVestingFrequency(e.target.value as VestingFrequency)}
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>
                Vested Quantity
                <span className={styles.calculatedBadge}>Auto-calculated</span>
              </label>
              <input
                type="number"
                className={styles.inputCalculated}
                value={effectiveVestedQuantity}
                readOnly
                disabled
              />
              {!firstVestingDate && (
                <span className={styles.helpText}>
                  Enter First Vesting Date to calculate
                </span>
              )}
            </div>
          </div>

          {/* Used Quantity - only for options */}
          {isOption && (
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Used (Exercised) Quantity</label>
                <input
                  type="number"
                  className={`${styles.input} ${errors.usedQuantity ? styles.inputError : ''}`}
                  value={usedQuantity}
                  onChange={(e) => setUsedQuantity(e.target.value)}
                  placeholder="0"
                  min="0"
                  max={effectiveVestedQuantity.toString()}
                />
                {errors.usedQuantity && <span className={styles.errorText}>{errors.usedQuantity}</span>}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Available to Exercise
                  <span className={styles.calculatedBadge}>Auto</span>
                </label>
                <input
                  type="number"
                  className={styles.inputCalculated}
                  value={availableQuantity}
                  readOnly
                  disabled
                />
                <span className={styles.helpText}>
                  Vested - Used
                </span>
              </div>
            </div>
          )}

          {isOption ? (
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Exercise Price (USD)</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputPrefix}>$</span>
                  <input
                    type="number"
                    className={`${styles.input} ${styles.inputWithPrefix} ${errors.exercisePrice ? styles.inputError : ''}`}
                    value={exercisePrice}
                    onChange={(e) => setExercisePrice(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
                {errors.exercisePrice && <span className={styles.errorText}>{errors.exercisePrice}</span>}
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Average Price (USD)</label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputPrefix}>$</span>
                  <input
                    type="number"
                    className={`${styles.input} ${styles.inputWithPrefix} ${errors.averagePrice ? styles.inputError : ''}`}
                    value={averagePrice}
                    onChange={(e) => setAveragePrice(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>
                {errors.averagePrice && <span className={styles.errorText}>{errors.averagePrice}</span>}
              </div>
            </div>
          ) : (
            <div className={styles.field}>
              <label className={styles.label}>Average Vesting Price (USD)</label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputPrefix}>$</span>
                <input
                  type="number"
                  className={`${styles.input} ${styles.inputWithPrefix} ${errors.averageVestingPrice ? styles.inputError : ''}`}
                  value={averageVestingPrice}
                  onChange={(e) => setAverageVestingPrice(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
              {errors.averageVestingPrice && <span className={styles.errorText}>{errors.averageVestingPrice}</span>}
            </div>
          )}

        </form>

        <div className={styles.footer}>
          <button type="button" className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={styles.submitButton} onClick={handleSubmit}>
            {isEditing ? 'Save Changes' : 'Add Package'}
          </button>
        </div>
      </div>
    </div>
  );
}
