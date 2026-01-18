import { render, screen } from '@testing-library/react';
import InfoBox from './InfoBox';

describe('InfoBox', () => {
    describe('Variants', () => {
        test('renders info variant by default', () => {
            render(<InfoBox message='Information message' />);
            expect(screen.getByText('Information message')).toBeInTheDocument();
            expect(screen.getByTestId('info-box')).toBeInTheDocument();
        });

        test('renders success variant', () => {
            render(<InfoBox message='Success message' variant='success' />);
            expect(screen.getByText('Success message')).toBeInTheDocument();
        });

        test('renders error variant', () => {
            render(<InfoBox message='Error message' variant='error' />);
            expect(screen.getByText('Error message')).toBeInTheDocument();
        });

        test('renders warning variant', () => {
            render(<InfoBox message='Warning message' variant='warning' />);
            expect(screen.getByText('Warning message')).toBeInTheDocument();
        });
    });

    describe('Props', () => {
        test('accepts custom testId', () => {
            render(<InfoBox message='Test' testId='custom-test-id' />);
            expect(screen.getByTestId('custom-test-id')).toBeInTheDocument();
        });

        test('accepts JSX as message', () => {
            render(
                <InfoBox
                    message={
                        <span>
                            Message with <strong>bold</strong>
                        </span>
                    }
                />,
            );
            expect(screen.getByText('bold')).toBeInTheDocument();
        });
    });
});
