import { render, screen } from '@testing-library/react';
import LoadingSpinner from '@/components/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders the spinner and default label', () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByTestId('loading-icon');
    expect(spinner).toBeInTheDocument();

    const label = screen.getByText(/loading.../i);

    expect(spinner).toBeInTheDocument();
    expect(label).toBeInTheDocument();
  });

  it('renders a custom label when provided', () => {
    render(<LoadingSpinner label="Fetching profile..." />);

    const label = screen.getByText(/fetching profile/i);
    expect(label).toBeInTheDocument();
  });
});
