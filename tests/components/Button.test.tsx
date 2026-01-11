import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from '@/components/Button';
import { FaCheck, FaArrowRight } from 'react-icons/fa';

describe('Button Component', () => {
  it('renders with the correct label', () => {
    render(<Button label="Click Me" onClick={() => {}} />);
    expect(screen.getByText(/Click Me/i)).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button label="Click Me" onClick={handleClick} />);
    fireEvent.click(screen.getByText(/Click Me/i));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button label="Disabled" onClick={() => {}} disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled when isValid is false', () => {
    render(<Button label="Invalid" onClick={() => {}} isValid={false} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('sets aria-disabled when invalid or disabled', () => {
    render(<Button label="Aria" onClick={() => {}} isValid={false} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
  });

  it('displays loading spinner and label when isLoading is true', () => {
    render(<Button label="Submit" loadingLabel="Loading..." isLoading onClick={() => {}} />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('renders left and right icons', () => {
    render(
      <Button
        label="Go"
        onClick={() => {}}
        leftIcon={<FaCheck data-testid="left-icon" />}
        rightIcon={<FaArrowRight data-testid="right-icon" />}
      />
    );
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });

  it('applies the correct variant classes', () => {
    render(<Button label="Primary" onClick={() => {}} variant="primary" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-primary');
  });

  it('applies the correct size classes for size="sm"', () => {
    render(<Button label="Small" onClick={() => {}} size="sm" />);
    const button = screen.getByRole('button');
    expect(button.className).toMatch(/text-\[10px]/);
  });

  it('applies custom className when provided', () => {
    render(<Button label="Custom" onClick={() => {}} className="custom-class" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('uses custom testId when provided', () => {
    render(<Button label="Custom TestId" onClick={() => {}} testId="custom-id" />);
    expect(screen.getByTestId('custom-id')).toBeInTheDocument();
  });

  it('uses default testId when not specified', () => {
    render(<Button label="Default TestId" onClick={() => {}} />);
    expect(screen.getByTestId('button')).toBeInTheDocument();
  });

  it('uses default button type when not specified', () => {
    render(<Button label="Default Type" onClick={() => {}} />);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('applies custom type when specified', () => {
    render(<Button label="Submit" onClick={() => {}} type="submit" />);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('uses default role and allows custom role override', () => {
    // Native button elements have implicit role="button", so getByRole works
    render(<Button label="Default Role" onClick={() => {}} />);
    expect(screen.getByRole('button')).toBeInTheDocument();

    // Test role attribute on anchor elements (when as="a")
    render(<Button label="Custom Role" as="a" href="/test" role="link" />);
    const customLink = screen.getByText(/Custom Role/i);
    expect(customLink).toHaveAttribute('role', 'link');
    expect(customLink.tagName).toBe('A');
  });
});
