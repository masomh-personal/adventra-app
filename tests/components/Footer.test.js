import { render, screen } from '@testing-library/react';
import Footer from '@/components/Footer';
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

  it('renders the KSU button correctly', () => {
    render(<Footer />);
    const ksuButton = screen.getByTestId('ksu-button');
    expect(ksuButton).toBeInTheDocument();
    expect(ksuButton).toHaveAttribute('href', expect.stringContaining('kennesaw.edu'));
    expect(ksuButton).toHaveClass('px-2');
    expect(ksuButton).toHaveClass('py-1');
    expect(ksuButton).toHaveClass(`bg-[#ffcb05]`);
    expect(ksuButton).toHaveAttribute('target', '_blank');
    expect(ksuButton).toHaveAttribute('rel', 'noopener noreferrer');
    expect(ksuButton).toHaveAttribute('aria-label', "Go to KSU's Software & Game Development Dept");
    expect(ksuButton).toHaveAttribute('data-testid', 'ksu-button');
  });

  it('renders the "Made with ❤️" text and heart icon', () => {
    render(<Footer />);
    expect(screen.getByText(/Made with/i)).toBeInTheDocument();
    const heartIcon = screen.getByTestId('ksu-button').previousSibling;
    expect(heartIcon).toBeInTheDocument();
    expect(heartIcon).toHaveClass('text-red-500');
  });
});
