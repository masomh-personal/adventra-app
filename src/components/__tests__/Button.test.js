import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';
import '@testing-library/jest-dom';

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
});
