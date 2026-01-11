// Vitest setup file - equivalent to jest.setup.ts
import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Make jest available as an alias to vi for compatibility
// This allows gradual migration from jest.* to vi.*
global.jest = vi;

// Mock Supabase environment variables for tests
process.env.NEXT_PUBLIC_SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'test-anon-key';
