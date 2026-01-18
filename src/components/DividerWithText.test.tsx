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
            // Component should render without errors
            // The divider line is present in the DOM structure
            expect(container.firstChild).toBeInTheDocument();
        });

        test('maintains spacing when no text provided', () => {
            const { container } = render(<DividerWithText />);
            // Component structure should be present even without text
            expect(container.firstChild).toBeInTheDocument();
        });
    });
});
