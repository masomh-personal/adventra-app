import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';
import '@testing-library/jest-dom';
import { FaCheck, FaArrowRight } from 'react-icons/fa';

describe('Button', () => {
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
    const button = screen.getByText(/Disabled/i);
    expect(button).toBeDisabled();
  });

  it('applies the correct variant class for primary', () => {
    render(<Button label="Primary" onClick={() => {}} variant="primary" />);
    const button = screen.getByText(/Primary/i);
    expect(button).toHaveClass('bg-primary');
  });

  it('applies the correct variant class for outline', () => {
    render(<Button label="Outline" onClick={() => {}} variant="outline" />);
    const button = screen.getByText(/Outline/i);
    expect(button).toHaveClass('border-primary');
  });

  it('displays loading spinner and label when isLoading is true', () => {
    render(<Button label="Submit" loadingLabel="Loading..." isLoading onClick={() => {}} />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button').querySelector('svg')).toBeInTheDocument(); // spinner icon
  });

  it('renders leftIcon and rightIcon correctly', () => {
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

  it('applies the correct size class for small', () => {
    render(<Button label="Small" onClick={() => {}} size="sm" />);
    const button = screen.getByText(/Small/i);
    expect(button.className).toMatch(/text-xs/);
  });

  it('includes custom className if provided', () => {
    render(<Button label="Custom" onClick={() => {}} className="custom-class" />);
    const button = screen.getByText(/Custom/i);
    expect(button).toHaveClass('custom-class');
  });

  it('has focus ring classes for keyboard accessibility', () => {
    render(<Button label="Focus Test" onClick={() => {}} />);
    const button = screen.getByText(/Focus Test/i);
    expect(button.className).toMatch(/focus:ring-2/);
    expect(button.className).toMatch(/focus:ring-primary/);
  });

  it('uses custom testId prop', () => {
    render(<Button label="Test ID" onClick={() => {}} testId="custom-button-id" />);
    expect(screen.getByTestId('custom-button-id')).toBeInTheDocument();
  });

  it('applies secondary variant class', () => {
    render(<Button label="Secondary" onClick={() => {}} variant="secondary" />);
    const button = screen.getByText(/Secondary/i);
    expect(button).toHaveClass('bg-secondary');
    expect(button).toHaveClass('hover:bg-primary');
  });

  it('applies danger variant class', () => {
    render(<Button label="Danger" onClick={() => {}} variant="danger" />);
    const button = screen.getByText(/Danger/i);
    expect(button).toHaveClass('bg-red-600');
    expect(button).toHaveClass('hover:bg-red-700');
  });

  it('applies base size class', () => {
    render(<Button label="Base Size" onClick={() => {}} size="base" />);
    const button = screen.getByText(/Base Size/i);
    expect(button.className).toMatch(/text-sm/);
    expect(button.className).toMatch(/px-4 py-2/);
  });

  it('uses default type button', () => {
    render(<Button label="Default Type" onClick={() => {}} />);
    const button = screen.getByText(/Default Type/i);
    expect(button).toHaveAttribute('type', 'button');
  });

  it('sets submit type correctly', () => {
    render(<Button label="Submit Button" onClick={() => {}} type="submit" />);
    const button = screen.getByText(/Submit Button/i);
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('applies ghost variant class', () => {
    render(<Button label="Ghost" onClick={() => {}} variant="ghost" />);
    const button = screen.getByText(/Ghost/i);
    expect(button).toHaveClass('bg-gray-100');
    expect(button).toHaveClass('text-primary');
    expect(button).toHaveClass('hover:bg-gray-200');
  });

  it('uses default testId when not specified', () => {
    render(<Button label="Default TestId" onClick={() => {}} />);
    expect(screen.getByTestId('button')).toBeInTheDocument();
  });

  it('uses default role of button', () => {
    render(<Button label="Role Test" onClick={() => {}} />);
    const button = screen.getByText(/Role Test/i);
    expect(button).toHaveAttribute('role', 'button');
  });

  it('allows custom role to be specified', () => {
    render(<Button label="Custom Role" onClick={() => {}} role="link" />);
    const button = screen.getByText(/Custom Role/i);
    expect(button).toHaveAttribute('role', 'link');
  });
});
