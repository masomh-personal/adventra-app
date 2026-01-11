// Global type declarations for Vitest
// This allows using jest.* APIs as aliases for vi.* for easier migration
import { vi } from 'vitest';

declare global {
  var jest: typeof vi;
}

export {};
