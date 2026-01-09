import { usePackageForm } from '../hooks';
import { Modal, Button, Input, Select, FormField, FormRow } from './ui';
import type { StockOptionPackage, RSUPackage, PackageType, VestingFrequency } from '../types';

const VESTING_DURATION_OPTIONS = [
  { value: '1', label: '1 year' },
  { value: '2', label: '2 years' },
  { value: '3', label: '3 years' },
  { value: '4', label: '4 years' },
  { value: '5', label: '5 years' },
];

const VESTING_FREQUENCY_OPTIONS = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annually', label: 'Annually' },
];

interface PackageFormProps {
  type: PackageType;
  editingPackage: StockOptionPackage | RSUPackage | null;
  onClose: () => void;
}

export function PackageForm({ type, editingPackage, onClose }: PackageFormProps) {
  const {
    state,
    updateField,
    vestedQuantity,
    availableQuantity,
    submit,
    isEditing,
  } = usePackageForm(type, editingPackage, onClose);

  const isOption = type === 'option';
  const title = `${isEditing ? 'Edit' : 'Add'} ${isOption ? 'Stock Option' : 'RSU'} Package`;

  const handleSubmit = () => {
    submit();
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {isEditing ? 'Save Changes' : 'Add Package'}
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <FormField label="Package Name" error={state.errors.name}>
          <Input
            type="text"
            value={state.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="e.g., Initial Grant 2023"
            maxLength={50}
            error={!!state.errors.name}
          />
        </FormField>

        <FormRow>
          <FormField label="Total Quantity" error={state.errors.totalQuantity}>
            <Input
              type="number"
              value={state.totalQuantity}
              onChange={(e) => updateField('totalQuantity', e.target.value)}
              placeholder="0"
              min="0"
              error={!!state.errors.totalQuantity}
            />
          </FormField>

          <FormField label="First Vesting Date" error={state.errors.firstVestingDate}>
            <Input
              type="date"
              value={state.firstVestingDate}
              onChange={(e) => updateField('firstVestingDate', e.target.value)}
              error={!!state.errors.firstVestingDate}
            />
          </FormField>
        </FormRow>

        <FormRow>
          <FormField label="Vesting Duration">
            <Select
              value={state.vestingDurationYears}
              onChange={(e) => updateField('vestingDurationYears', e.target.value)}
              options={VESTING_DURATION_OPTIONS}
            />
          </FormField>

          <FormField label="Vesting Frequency">
            <Select
              value={state.vestingFrequency}
              onChange={(e) => updateField('vestingFrequency', e.target.value as VestingFrequency)}
              options={VESTING_FREQUENCY_OPTIONS}
            />
          </FormField>
        </FormRow>

        <FormField
          label="Vested Quantity"
          badge="Auto-calculated"
          helpText={!state.firstVestingDate ? 'Enter First Vesting Date to calculate' : undefined}
        >
          <Input
            type="number"
            value={vestedQuantity}
            readOnly
            disabled
            style={{ backgroundColor: '#f5f5f5' }}
          />
        </FormField>

        <FormRow>
          <FormField
            label={isOption ? 'Used (Exercised) Quantity' : 'Used (Sold) Quantity'}
            error={state.errors.usedQuantity}
          >
            <Input
              type="number"
              value={state.usedQuantity}
              onChange={(e) => updateField('usedQuantity', e.target.value)}
              placeholder="0"
              min="0"
              max={vestedQuantity.toString()}
              error={!!state.errors.usedQuantity}
            />
          </FormField>

          <FormField
            label={isOption ? 'Available to Exercise' : 'Available to Sell'}
            badge="Auto"
            helpText="Vested - Used"
          >
            <Input
              type="number"
              value={availableQuantity}
              readOnly
              disabled
              style={{ backgroundColor: '#f5f5f5' }}
            />
          </FormField>
        </FormRow>

        {isOption ? (
          <FormRow>
            <FormField label="Exercise Price (USD)" error={state.errors.exercisePrice}>
              <Input
                type="number"
                prefix="$"
                value={state.exercisePrice}
                onChange={(e) => updateField('exercisePrice', e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                error={!!state.errors.exercisePrice}
              />
            </FormField>

            <FormField label="Average Price (USD)" error={state.errors.averagePrice}>
              <Input
                type="number"
                prefix="$"
                value={state.averagePrice}
                onChange={(e) => updateField('averagePrice', e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                error={!!state.errors.averagePrice}
              />
            </FormField>
          </FormRow>
        ) : (
          <FormField label="Average Vesting Price (USD)" error={state.errors.averageVestingPrice}>
            <Input
              type="number"
              prefix="$"
              value={state.averageVestingPrice}
              onChange={(e) => updateField('averageVestingPrice', e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              error={!!state.errors.averageVestingPrice}
            />
          </FormField>
        )}
      </div>
    </Modal>
  );
}
