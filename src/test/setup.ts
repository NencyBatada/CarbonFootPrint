import '@testing-library/jest-dom';
import { vi } from 'vitest';

// jsdom does not implement scrollIntoView
window.HTMLElement.prototype.scrollIntoView = function () {};

// Mock localStorage globally
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });
