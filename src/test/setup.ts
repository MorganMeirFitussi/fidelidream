import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock crypto.randomUUID with incrementing values for uniqueness
let uuidCounter = 0;
Object.defineProperty(crypto, 'randomUUID', {
  value: vi.fn(() => `test-uuid-${++uuidCounter}`),
});
