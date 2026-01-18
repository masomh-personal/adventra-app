import { render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
    describe('Rendering', () => {
        test('renders with default label', () => {
            render(<LoadingSpinner />);
            expect(screen.getByText('Loading...')).toBeInTheDocument();
            expect(screen.getByTestId('loading-icon')).toBeInTheDocument();
        });

        test('renders with custom label', () => {
            render(<LoadingSpinner label='Please wait...' />);
            expect(screen.getByText('Please wait...')).toBeInTheDocument();
        });
    });
});
