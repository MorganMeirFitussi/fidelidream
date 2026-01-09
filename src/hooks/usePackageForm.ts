import { useReducer, useCallback, useEffect } from 'react';
import { useEquityStore } from '../store/useEquityStore';
import { validateStockOption, validateRSU, getErrorMessages } from '../utils/validators';
import { calculateVestedQuantity } from '../utils/formatters';
import type { StockOptionPackage, RSUPackage, PackageType, VestingFrequency } from '../types';

// Form state interface
interface PackageFormState {
  name: string;
  totalQuantity: string;
  usedQuantity: string;
  exercisePrice: string;
  averagePrice: string;
  averageVestingPrice: string;
  firstVestingDate: string;
  vestingDurationYears: string;
  vestingFrequency: VestingFrequency;
  errors: Record<string, string>;
}

// Action types
type FormAction =
  | { type: 'SET_FIELD'; field: keyof Omit<PackageFormState, 'errors'>; value: string }
  | { type: 'SET_ERRORS'; errors: Record<string, string> }
  | { type: 'RESET'; state: PackageFormState };

// Initial state factory
const createInitialState = (): PackageFormState => ({
  name: '',
  totalQuantity: '',
  usedQuantity: '',
  exercisePrice: '',
  averagePrice: '',
  averageVestingPrice: '',
  firstVestingDate: '',
  vestingDurationYears: '4',
  vestingFrequency: 'quarterly',
  errors: {},
});

// Reducer
function formReducer(state: PackageFormState, action: FormAction): PackageFormState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value, errors: {} };
    case 'SET_ERRORS':
      return { ...state, errors: action.errors };
    case 'RESET':
      return action.state;
  }
}

// Hook return type
interface UsePackageFormReturn {
  state: PackageFormState;
  updateField: (field: keyof Omit<PackageFormState, 'errors'>, value: string) => void;
  vestedQuantity: number;
  availableQuantity: number;
  submit: () => boolean;
  reset: () => void;
  isEditing: boolean;
}

/**
 * Hook for managing package form state (Stock Options or RSUs)
 */
export function usePackageForm(
  type: PackageType,
  editingPackage: StockOptionPackage | RSUPackage | null,
  onSuccess: () => void
): UsePackageFormReturn {
  const [state, dispatch] = useReducer(formReducer, createInitialState());
  
  const addStockOption = useEquityStore((s) => s.addStockOption);
  const updateStockOption = useEquityStore((s) => s.updateStockOption);
  const addRSU = useEquityStore((s) => s.addRSU);
  const updateRSU = useEquityStore((s) => s.updateRSU);

  const isOption = type === 'option';
  const isEditing = !!editingPackage;

  // Populate form when editing
  useEffect(() => {
    if (editingPackage) {
      const newState = createInitialState();
      newState.name = editingPackage.name;
      newState.totalQuantity = editingPackage.totalQuantity.toString();
      newState.firstVestingDate = editingPackage.firstVestingDate;

      if (isOption) {
        const opt = editingPackage as StockOptionPackage;
        newState.usedQuantity = opt.usedQuantity.toString();
        newState.exercisePrice = opt.exercisePrice.toString();
        newState.averagePrice = opt.averagePrice.toString();
        newState.vestingDurationYears = opt.vestingDurationYears?.toString() || '4';
        newState.vestingFrequency = opt.vestingFrequency || 'quarterly';
      } else {
        const rsu = editingPackage as RSUPackage;
        newState.usedQuantity = (rsu.usedQuantity || 0).toString();
        newState.averageVestingPrice = rsu.averageVestingPrice.toString();
        newState.vestingDurationYears = rsu.vestingDurationYears?.toString() || '4';
        newState.vestingFrequency = rsu.vestingFrequency || 'quarterly';
      }

      dispatch({ type: 'RESET', state: newState });
    } else {
      dispatch({ type: 'RESET', state: createInitialState() });
    }
  }, [editingPackage, isOption]);

  // Calculated values
  const vestedQuantity = calculateVestedQuantity(
    parseInt(state.totalQuantity) || 0,
    state.firstVestingDate,
    parseInt(state.vestingDurationYears) || 4,
    state.vestingFrequency
  );

  const availableQuantity = Math.max(0, vestedQuantity - (parseInt(state.usedQuantity) || 0));

  // Update field
  const updateField = useCallback((field: keyof Omit<PackageFormState, 'errors'>, value: string) => {
    dispatch({ type: 'SET_FIELD', field, value });
  }, []);

  // Reset form
  const reset = useCallback(() => {
    dispatch({ type: 'RESET', state: createInitialState() });
  }, []);

  // Submit form
  const submit = useCallback((): boolean => {
    if (isOption) {
      const data = {
        name: state.name,
        totalQuantity: parseInt(state.totalQuantity) || 0,
        vestedQuantity,
        usedQuantity: parseInt(state.usedQuantity) || 0,
        exercisePrice: parseFloat(state.exercisePrice) || 0,
        averagePrice: parseFloat(state.averagePrice) || 0,
        firstVestingDate: state.firstVestingDate,
        vestingDurationYears: parseInt(state.vestingDurationYears) || 4,
        vestingFrequency: state.vestingFrequency,
      };

      const result = validateStockOption(data);
      if (!result.success) {
        dispatch({ type: 'SET_ERRORS', errors: getErrorMessages(result.error) });
        return false;
      }

      if (isEditing && editingPackage) {
        updateStockOption(editingPackage.id, data);
      } else {
        addStockOption(data);
      }
    } else {
      const data = {
        name: state.name,
        totalQuantity: parseInt(state.totalQuantity) || 0,
        vestedQuantity,
        usedQuantity: parseInt(state.usedQuantity) || 0,
        averageVestingPrice: parseFloat(state.averageVestingPrice) || 0,
        firstVestingDate: state.firstVestingDate,
        vestingDurationYears: parseInt(state.vestingDurationYears) || 4,
        vestingFrequency: state.vestingFrequency,
      };

      const result = validateRSU(data);
      if (!result.success) {
        dispatch({ type: 'SET_ERRORS', errors: getErrorMessages(result.error) });
        return false;
      }

      if (isEditing && editingPackage) {
        updateRSU(editingPackage.id, data);
      } else {
        addRSU(data);
      }
    }

    onSuccess();
    return true;
  }, [
    state, vestedQuantity, isOption, isEditing, editingPackage,
    addStockOption, updateStockOption, addRSU, updateRSU, onSuccess
  ]);

  return {
    state,
    updateField,
    vestedQuantity,
    availableQuantity,
    submit,
    reset,
    isEditing,
  };
}
