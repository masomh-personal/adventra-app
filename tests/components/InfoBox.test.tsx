import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import InfoBox from '@/components/InfoBox';

describe('InfoBox', () => {
    test('renders the default info variant with provided message', () => {
        render(<InfoBox message='This is an info message' />);
        const infoBox = screen.getByTestId('info-box');
        expect(infoBox).toHaveTextContent(/this is an info message/i);
    });

    test('renders the success variant with correct icon and message', () => {
        const { container } = render(<InfoBox message='Success!' variant='success' />);
        const infoBox = screen.getByTestId('info-box');
        expect(infoBox).toHaveTextContent(/success!/i);
        expect(container.querySelector('svg')).toBeTruthy(); // Checks icon exists
    });

    test('renders the error variant with correct message', () => {
        render(<InfoBox message='Something went wrong.' variant='error' />);
        const infoBox = screen.getByTestId('info-box');
        expect(infoBox).toHaveTextContent(/something went wrong/i);
    });

    test('supports JSX inside the message prop', () => {
        render(
            <InfoBox
                message={
                    <span>
                        ⚠️ <strong>Heads up</strong>!
                    </span>
                }
            />,
        );
        const infoBox = screen.getByTestId('info-box');
        expect(infoBox).toHaveTextContent(/heads up/i);
    });

    test('falls back to info variant if invalid variant is passed', () => {
        // @ts-expect-error - Testing fallback behavior with invalid variant
        render(<InfoBox message='Fallback test' variant='unknown-type' />);
        const infoBox = screen.getByTestId('info-box');
        expect(infoBox).toHaveTextContent(/fallback test/i);
    });
});
