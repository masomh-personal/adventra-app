import { render, screen } from '@testing-library/react';
import Header from '../Header';

describe('Header', () => {
  it('renders the Adventra logo text', () => {
    render(<Header />);
    const logoText = screen.getByText(/adventra/i);
    expect(logoText).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Header />);
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/About/i)).toBeInTheDocument();
    expect(screen.getByText(/Contact/i)).toBeInTheDocument();
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  it('renders the Adventra logo image', () => {
    render(<Header />);
    const logoImage = screen.getByAltText(/adventra logo/i);
    expect(logoImage).toBeInTheDocument();
  });
});
