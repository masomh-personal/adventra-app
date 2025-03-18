import { render, screen } from '@testing-library/react';
import Footer from '../Footer';
import '@testing-library/jest-dom';

describe('Footer', () => {
  it('renders footer navigation links', () => {
    render(<Footer />);

    expect(screen.getByText(/About/i)).toBeInTheDocument();
    expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
    expect(screen.getByText(/Contact/i)).toBeInTheDocument();
  });

  it('renders copyright text with current year', () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    expect(screen.getByText(`© ${year} Adventra. All rights reserved.`)).toBeInTheDocument();
  });

  it('renders the KSU link correctly', () => {
    render(<Footer />);
    const ksuLink = screen.getByRole('link', { name: /KSU/i });
    expect(ksuLink).toHaveAttribute('href', expect.stringContaining('kennesaw.edu'));
  });
});
