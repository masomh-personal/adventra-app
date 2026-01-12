import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CharacterCounter } from '@/components/CharacterCounter';

describe('CharacterCounter', () => {
    test('displays the correct character count', () => {
        render(<CharacterCounter value="Hello" maxLength={100} />);
        expect(screen.getByRole('character-counter')).toHaveTextContent('5/100');
    });

    test('handles empty value correctly', () => {
        render(<CharacterCounter value="" maxLength={100} />);
        expect(screen.getByRole('character-counter')).toHaveTextContent('0/100');
    });

    describe('Color thresholds for maxLength=100', () => {
        test('applies green styling when under 80% of max length (79 chars)', () => {
            const value = 'A'.repeat(79);
            render(<CharacterCounter value={value} maxLength={100} />);
            expect(screen.getByRole('character-counter')).toHaveClass('text-green-600');
            expect(screen.getByRole('character-counter')).not.toHaveClass('text-amber-500');
            expect(screen.getByRole('character-counter')).not.toHaveClass('text-red-500');
        });

        test('applies green styling when exactly at 80% threshold (80 chars)', () => {
            const value = 'A'.repeat(80);
            render(<CharacterCounter value={value} maxLength={100} />);
            // At exactly 80% (80 = 100 * 0.8), the condition is charCount > maxLength * 0.8
            // 80 > 80 is false, so it should be green (threshold uses >, not >=)
            expect(screen.getByRole('character-counter')).toHaveClass('text-green-600');
            expect(screen.getByRole('character-counter')).not.toHaveClass('text-amber-500');
            expect(screen.getByRole('character-counter')).not.toHaveClass('text-red-500');
        });

        test('applies amber styling when just over 80% threshold (81 chars)', () => {
            const value = 'A'.repeat(81);
            render(<CharacterCounter value={value} maxLength={100} />);
            expect(screen.getByRole('character-counter')).toHaveClass('text-amber-500');
            expect(screen.getByRole('character-counter')).not.toHaveClass('text-green-600');
            expect(screen.getByRole('character-counter')).not.toHaveClass('text-red-500');
        });

        test('applies amber styling when over 80% but under 100% (99 chars)', () => {
            const value = 'A'.repeat(99);
            render(<CharacterCounter value={value} maxLength={100} />);
            expect(screen.getByRole('character-counter')).toHaveClass('text-amber-500');
            expect(screen.getByRole('character-counter')).not.toHaveClass('text-red-500');
        });

        test('applies red styling and bold font when at max length (100 chars)', () => {
            const value = 'A'.repeat(100);
            render(<CharacterCounter value={value} maxLength={100} />);
            const counter = screen.getByRole('character-counter');
            expect(counter).toHaveClass('text-red-500');
            expect(counter).toHaveClass('font-bold');
            expect(counter).not.toHaveClass('text-amber-500');
        });
    });

    describe('Color thresholds for maxLength=2000 (contact form)', () => {
        const maxLength = 2000;

        test('applies green styling when under 80% threshold (1599 chars)', () => {
            const value = 'A'.repeat(1599);
            render(<CharacterCounter value={value} maxLength={maxLength} />);
            expect(screen.getByRole('character-counter')).toHaveClass('text-green-600');
            expect(screen.getByRole('character-counter')).toHaveTextContent('1599/2000');
        });

        test('applies green styling when exactly at 80% threshold (1600 chars)', () => {
            const value = 'A'.repeat(1600);
            render(<CharacterCounter value={value} maxLength={maxLength} />);
            // At exactly 80%, it's still green (threshold is > 80%, not >=)
            expect(screen.getByRole('character-counter')).toHaveClass('text-green-600');
            expect(screen.getByRole('character-counter')).toHaveTextContent('1600/2000');
        });

        test('applies amber styling when just over 80% threshold (1601 chars)', () => {
            const value = 'A'.repeat(1601);
            render(<CharacterCounter value={value} maxLength={maxLength} />);
            expect(screen.getByRole('character-counter')).toHaveClass('text-amber-500');
            expect(screen.getByRole('character-counter')).toHaveTextContent('1601/2000');
            expect(screen.getByRole('character-counter')).not.toHaveClass('text-red-500');
        });

        test('applies amber styling when at 99% of max length (1999 chars)', () => {
            const value = 'A'.repeat(1999);
            render(<CharacterCounter value={value} maxLength={maxLength} />);
            expect(screen.getByRole('character-counter')).toHaveClass('text-amber-500');
            expect(screen.getByRole('character-counter')).toHaveTextContent('1999/2000');
            expect(screen.getByRole('character-counter')).not.toHaveClass('text-red-500');
        });

        test('applies red styling and bold font when at max length (2000 chars)', () => {
            const value = 'A'.repeat(2000);
            render(<CharacterCounter value={value} maxLength={maxLength} />);
            const counter = screen.getByRole('character-counter');
            expect(counter).toHaveClass('text-red-500');
            expect(counter).toHaveClass('font-bold');
            expect(counter).toHaveTextContent('2000/2000');
            expect(counter).not.toHaveClass('text-amber-500');
        });
    });

    test('applies custom className', () => {
        render(<CharacterCounter value="Test" maxLength={100} className="custom-class" />);
        expect(screen.getByRole('character-counter')).toHaveClass('custom-class');
    });
});
