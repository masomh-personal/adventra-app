// Vitest setup file - equivalent to jest.setup.ts
import '@testing-library/jest-dom/vitest';

// Make jest available as an alias to vi for compatibility
// This allows gradual migration from jest.* to vi.*
// vi is globally available with types: ["vitest/globals"] in tsconfig.json
global.jest = vi;

// Mock Supabase environment variables for tests
process.env.NEXT_PUBLIC_SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'test-anon-key';
