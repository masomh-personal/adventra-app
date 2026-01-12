import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Button from '@/components/Button';
import { FaCheck, FaArrowRight } from 'react-icons/fa';

describe('Button Component', () => {
    test('renders with the correct label', () => {
        render(<Button label="Click Me" onClick={() => {}} />);
        expect(screen.getByText(/Click Me/i)).toBeInTheDocument();
    });

    test('calls onClick when clicked', async () => {
        const user = userEvent.setup();
        const handleClick = vi.fn();
        render(<Button label="Click Me" onClick={handleClick} />);
        await user.click(screen.getByText(/Click Me/i));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('is disabled when disabled prop is true', () => {
        render(<Button label="Disabled" onClick={() => {}} disabled />);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    test('is disabled when isValid is false', () => {
        render(<Button label="Invalid" onClick={() => {}} isValid={false} />);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    test('sets aria-disabled when invalid or disabled', () => {
        render(<Button label="Aria" onClick={() => {}} isValid={false} />);
        expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
    });

    test('displays loading spinner and label when isLoading is true', () => {
        render(<Button label="Submit" loadingLabel="Loading..." isLoading onClick={() => {}} />);
        expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeDisabled();
        expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    test('renders left and right icons', () => {
        render(
            <Button
                label="Go"
                onClick={() => {}}
                leftIcon={<FaCheck data-testid="left-icon" />}
                rightIcon={<FaArrowRight data-testid="right-icon" />}
            />,
        );
        expect(screen.getByTestId('left-icon')).toBeInTheDocument();
        expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });

    test('applies the correct variant classes', () => {
        render(<Button label="Primary" onClick={() => {}} variant="primary" />);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-primary');
    });

    test('applies the correct size classes for size="sm"', () => {
        render(<Button label="Small" onClick={() => {}} size="sm" />);
        const button = screen.getByRole('button');
        expect(button.className).toMatch(/text-\[10px]/);
    });

    test('applies custom className when provided', () => {
        render(<Button label="Custom" onClick={() => {}} className="custom-class" />);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('custom-class');
    });

    test('uses custom testId when provided', () => {
        render(<Button label="Custom TestId" onClick={() => {}} testId="custom-id" />);
        expect(screen.getByTestId('custom-id')).toBeInTheDocument();
    });

    test('uses default testId when not specified', () => {
        render(<Button label="Default TestId" onClick={() => {}} />);
        expect(screen.getByTestId('button')).toBeInTheDocument();
    });

    test('uses default button type when not specified', () => {
        render(<Button label="Default Type" onClick={() => {}} />);
        expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    test('applies custom type when specified', () => {
        render(<Button label="Submit" onClick={() => {}} type="submit" />);
        expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    test('uses default role and allows custom role override', () => {
        // Native button elements have implicit role="button", so getByRole works
        render(<Button label="Default Role" onClick={() => {}} />);
        expect(screen.getByRole('button')).toBeInTheDocument();

        // When as="a", onClick is not allowed (ButtonAsAnchorProps)
        render(<Button label="Custom Role" role="link" as="a" href="/test" />);
        expect(screen.getByText(/Custom Role/i)).toHaveAttribute('role', 'link');
    });
});
