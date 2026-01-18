import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button', () => {
    describe('Rendering', () => {
        test('renders with label', () => {
            render(<Button label='Click me' onClick={() => {}} />);
            expect(screen.getByText('Click me')).toBeInTheDocument();
        });

        test('renders as anchor when as="a"', () => {
            render(<Button label='Link' as='a' href='/test' />);
            const link = screen.getByTestId('button');
            expect(link.tagName).toBe('A');
            expect(link).toHaveAttribute('href', '/test');
        });

        test('renders left and right icons', () => {
            const LeftIcon = () => <span data-testid='left'>L</span>;
            const RightIcon = () => <span data-testid='right'>R</span>;
            render(
                <Button
                    label='With icons'
                    onClick={() => {}}
                    leftIcon={<LeftIcon />}
                    rightIcon={<RightIcon />}
                />,
            );

            expect(screen.getByTestId('left')).toBeInTheDocument();
            expect(screen.getByTestId('right')).toBeInTheDocument();
        });
    });

    describe('Interactions', () => {
        test('calls onClick when clicked', async () => {
            const handleClick = vi.fn();
            const user = userEvent.setup();
            render(<Button label='Click me' onClick={handleClick} />);

            await user.click(screen.getByText('Click me'));
            expect(handleClick).toHaveBeenCalledTimes(1);
        });
    });

    describe('States', () => {
        test('is disabled when disabled prop is true', () => {
            render(<Button label='Disabled' onClick={() => {}} disabled />);
            expect(screen.getByRole('button')).toBeDisabled();
        });

        test('is disabled when isValid is false', () => {
            render(<Button label='Invalid' onClick={() => {}} isValid={false} />);
            expect(screen.getByRole('button')).toBeDisabled();
        });

        test('shows loading spinner when isLoading is true', () => {
            render(<Button label='Submit' onClick={() => {}} isLoading />);
            expect(screen.getByTestId('spinner')).toBeInTheDocument();
            expect(screen.getByText('Processing...')).toBeInTheDocument();
        });
    });
});
