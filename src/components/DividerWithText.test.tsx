import { render, screen } from '@testing-library/react';
import DividerWithText from './DividerWithText';

describe('DividerWithText', () => {
    describe('Rendering', () => {
        test('renders with text', () => {
            render(<DividerWithText text='Or' />);
            expect(screen.getByText('Or')).toBeInTheDocument();
        });

        test('renders divider without text', () => {
            const { container } = render(<DividerWithText />);
            const divider = container.querySelector('.border-t');
            expect(divider).toBeInTheDocument();
        });

        test('maintains spacing when no text provided', () => {
            const { container } = render(<DividerWithText />);
            const divider = container.querySelector('.border-t');
            expect(divider).toBeInTheDocument();
        });
    });
});
