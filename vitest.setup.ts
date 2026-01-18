// Vitest setup file - minimal configuration for unit tests
import * as matchers from '@testing-library/jest-dom/matchers';
import React from 'react';

// Extend Vitest's expect with jest-dom matchers
// With globals: true, expect is available globally - no import needed
const matcherExtensions =
    (matchers as { extensions?: Record<string, unknown> }).extensions ?? matchers;
expect.extend(matcherExtensions);

// Mock Next.js Image component
vi.mock('next/image', () => ({
    default: function MockImage(props: Record<string, unknown>) {
        return React.createElement('img', {
            src: props.src as string,
            alt: props.alt as string,
            ...props,
        });
    },
}));

// Mock Next.js router
vi.mock('next/router', () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        pathname: '/',
        query: {},
        asPath: '/',
        events: { on: vi.fn(), off: vi.fn() },
    }),
}));
