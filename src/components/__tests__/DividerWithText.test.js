import { render, screen } from '@testing-library/react';
import DividerWithText from '@/components/DividerWithText';

describe('DividerWithText', () => {
  it('renders with default text when provided', () => {
    render(<DividerWithText text="Or continue with" />);
    const textEl = screen.getByText(/or continue with/i);
    expect(textEl).toBeInTheDocument();
  });

  it('renders without text when none is provided', () => {
    render(<DividerWithText />);
    const possibleText = screen.queryByText(/or continue with/i);
    expect(possibleText).not.toBeInTheDocument();
  });

  it('still renders the divider line even without text', () => {
    const { container } = render(<DividerWithText />);
    const line = container.querySelector('div.border-t.border-gray-300');
    expect(line).toBeTruthy();
  });
});
