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
});
