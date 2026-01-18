import { renderHook } from '@testing-library/react';
import useRunOnce from './useRunOnce';

describe('useRunOnce', () => {
    describe('Execution', () => {
        test('runs callback once on mount', () => {
            const callback = vi.fn();
            renderHook(() => useRunOnce(callback));

            expect(callback).toHaveBeenCalledTimes(1);
        });

        test('does not run callback if undefined', () => {
            renderHook(() => useRunOnce(undefined));
            // Should not throw or error
            expect(true).toBe(true);
        });

        test('does not run callback again on re-render', () => {
            const callback = vi.fn();
            const { rerender } = renderHook(() => useRunOnce(callback));

            expect(callback).toHaveBeenCalledTimes(1);

            rerender();
            expect(callback).toHaveBeenCalledTimes(1);
        });

        test('handles async callbacks', async () => {
            const asyncCallback = vi.fn(async () => {
                await Promise.resolve();
            });

            renderHook(() => useRunOnce(asyncCallback));

            expect(asyncCallback).toHaveBeenCalledTimes(1);
        });
    });
});
