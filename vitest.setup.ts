// Vitest setup file - configures test environment
import '@testing-library/jest-dom/vitest';
import React from 'react';

// Make jest available as an alias to vi for compatibility
// This allows gradual migration from jest.* to vi.*
// vi is globally available with types: ["vitest/globals"] in tsconfig.json
global.jest = vi;

// Mock Appwrite environment variables for tests
process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT =
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID =
    process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'test-project-id';
process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID =
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'test-database-id';

// Mock Next.js Image component to avoid issues in tests
vi.mock('next/image', () => ({
    default: function MockImage(props: Record<string, unknown>) {
        return React.createElement('img', {
            src: props.src as string,
            alt: props.alt as string,
            ...props,
        });
    },
}));

// Mock Next.js router by default (can be overridden in individual tests)
vi.mock('next/router', () => ({
    useRouter: vi.fn(() => ({
        push: vi.fn(),
        replace: vi.fn(),
        pathname: '/',
        query: {},
        asPath: '/',
        events: {
            on: vi.fn(),
            off: vi.fn(),
            emit: vi.fn(),
        },
    })),
}));
