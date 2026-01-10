// Global type declarations for Vitest
// This allows using jest.* APIs as aliases for vi.* for easier migration
import { vi } from 'vitest';

declare global {
  // eslint-disable-next-line no-var
  var jest: typeof vi;
}

export {};
