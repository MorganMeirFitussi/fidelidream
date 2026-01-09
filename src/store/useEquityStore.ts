import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { PersonalInfo, StockOptionPackage, RSUPackage, CalculationResult } from '../types';
import { DEFAULTS } from '../lib/constants';
import { calculateEquity } from '../lib/calculator';

// Initial personal info with defaults
const initialPersonalInfo: PersonalInfo = {
  monthlySalary: 0,
  creditPoints: DEFAULTS.creditPoints,
  exchangeRate: DEFAULTS.exchangeRate,
  stockPrice: 0,
};

interface EquityState {
  // Data
  personalInfo: PersonalInfo;
  stockOptions: StockOptionPackage[];
  rsus: RSUPackage[];
  
  // Calculation result
  calculationResult: CalculationResult | null;
  
  // Personal info actions
  updatePersonalInfo: (updates: Partial<PersonalInfo>) => void;
  
  // Stock options actions
  addStockOption: (option: Omit<StockOptionPackage, 'id' | 'createdAt'>) => void;
  updateStockOption: (id: string, updates: Partial<StockOptionPackage>) => void;
  deleteStockOption: (id: string) => void;
  reorderStockOptions: (fromIndex: number, toIndex: number) => void;
  
  // RSU actions
  addRSU: (rsu: Omit<RSUPackage, 'id' | 'createdAt'>) => void;
  updateRSU: (id: string, updates: Partial<RSUPackage>) => void;
  deleteRSU: (id: string) => void;
  reorderRSUs: (fromIndex: number, toIndex: number) => void;
  
  // Calculation
  calculate: () => void;
  clearResult: () => void;
  
  // Clear all data
  clearAll: () => void;
}

export const useEquityStore = create<EquityState>()(
  persist(
    (set, get) => ({
      // Initial state
      personalInfo: initialPersonalInfo,
      stockOptions: [],
      rsus: [],
      calculationResult: null,
      
      // Personal info actions
      updatePersonalInfo: (updates) => {
        set((state) => ({
          personalInfo: { ...state.personalInfo, ...updates },
          calculationResult: null, // Clear result when data changes
        }));
      },
      
      // Stock options actions
      addStockOption: (option) => {
        const newOption: StockOptionPackage = {
          ...option,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          stockOptions: [...state.stockOptions, newOption],
          calculationResult: null,
        }));
      },
      
      updateStockOption: (id, updates) => {
        set((state) => ({
          stockOptions: state.stockOptions.map((opt) =>
            opt.id === id ? { ...opt, ...updates } : opt
          ),
          calculationResult: null,
        }));
      },
      
      deleteStockOption: (id) => {
        set((state) => ({
          stockOptions: state.stockOptions.filter((opt) => opt.id !== id),
          calculationResult: null,
        }));
      },
      
      reorderStockOptions: (fromIndex, toIndex) => {
        set((state) => {
          const newOptions = [...state.stockOptions];
          const [removed] = newOptions.splice(fromIndex, 1);
          newOptions.splice(toIndex, 0, removed);
          return { stockOptions: newOptions };
        });
      },
      
      // RSU actions
      addRSU: (rsu) => {
        const newRSU: RSUPackage = {
          ...rsu,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          rsus: [...state.rsus, newRSU],
          calculationResult: null,
        }));
      },
      
      updateRSU: (id, updates) => {
        set((state) => ({
          rsus: state.rsus.map((rsu) =>
            rsu.id === id ? { ...rsu, ...updates } : rsu
          ),
          calculationResult: null,
        }));
      },
      
      deleteRSU: (id) => {
        set((state) => ({
          rsus: state.rsus.filter((rsu) => rsu.id !== id),
          calculationResult: null,
        }));
      },
      
      reorderRSUs: (fromIndex, toIndex) => {
        set((state) => {
          const newRSUs = [...state.rsus];
          const [removed] = newRSUs.splice(fromIndex, 1);
          newRSUs.splice(toIndex, 0, removed);
          return { rsus: newRSUs };
        });
      },
      
      // Calculation
      calculate: () => {
        const { personalInfo, stockOptions, rsus } = get();
        const result = calculateEquity(personalInfo, stockOptions, rsus);
        set({ calculationResult: result });
      },
      
      clearResult: () => {
        set({ calculationResult: null });
      },
      
      // Clear all data
      clearAll: () => {
        set({
          personalInfo: initialPersonalInfo,
          stockOptions: [],
          rsus: [],
          calculationResult: null,
        });
      },
    }),
    {
      name: 'israeli-equity-calculator',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        personalInfo: state.personalInfo,
        stockOptions: state.stockOptions,
        rsus: state.rsus,
        // Don't persist calculationResult - recalculate on demand
      }),
    }
  )
);
