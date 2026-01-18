import { render, screen } from '@testing-library/react';
import { CharacterCounter } from './CharacterCounter';

describe('CharacterCounter', () => {
    describe('Rendering', () => {
        test('renders character count', () => {
            render(<CharacterCounter value='Hello' maxLength={100} />);
            expect(screen.getByText('5/100')).toBeInTheDocument();
        });

        test('handles empty value', () => {
            render(<CharacterCounter value='' maxLength={100} />);
            expect(screen.getByText('0/100')).toBeInTheDocument();
        });

        test('handles undefined value', () => {
            render(<CharacterCounter maxLength={100} />);
            expect(screen.getByText('0/100')).toBeInTheDocument();
        });
    });

    describe('Color States', () => {
        test('shows green when under 80% threshold', () => {
            const value = 'a'.repeat(79);
            render(<CharacterCounter value={value} maxLength={100} />);
            const counter = screen.getByTestId('char-counter');
            expect(counter).toHaveClass('text-green-600');
        });

        test('shows amber when over 80% threshold', () => {
            const value = 'a'.repeat(81);
            render(<CharacterCounter value={value} maxLength={100} />);
            const counter = screen.getByTestId('char-counter');
            expect(counter).toHaveClass('text-amber-500');
        });

        test('shows red when at max length', () => {
            const value = 'a'.repeat(100);
            render(<CharacterCounter value={value} maxLength={100} />);
            const counter = screen.getByTestId('char-counter');
            expect(counter).toHaveClass('text-red-500');
        });

        test('shows green at exactly 80% threshold', () => {
            const value = 'a'.repeat(80);
            render(<CharacterCounter value={value} maxLength={100} />);
            const counter = screen.getByTestId('char-counter');
            expect(counter).toHaveClass('text-green-600');
        });
    });

    describe('Props', () => {
        test('accepts custom className', () => {
            render(<CharacterCounter value='test' maxLength={100} className='custom-class' />);
            const counter = screen.getByTestId('char-counter');
            expect(counter).toHaveClass('custom-class');
        });

        test('has correct role attribute', () => {
            render(<CharacterCounter value='test' maxLength={100} />);
            expect(screen.getByRole('character-counter')).toBeInTheDocument();
        });
    });
});
