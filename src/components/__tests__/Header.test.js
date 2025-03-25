import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '@/components/Header';

// Mock the next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
  }),
}));

// Mock the next/link component
jest.mock('next/link', () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('Header Component', () => {
  it('renders the logo and brand name', () => {
    render(<Header />);

    const logo = screen.getByAltText('Adventra Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/adventra-logo.png');

    const brandName = screen.getByText('adventra');
    expect(brandName).toBeInTheDocument();
  });

  it('renders desktop navigation links', () => {
    render(<Header />);

    const homeLink = screen.getByRole('link', { name: /home/i });
    const aboutLink = screen.getByRole('link', { name: /about/i });
    const contactLink = screen.getByRole('link', { name: /contact/i });
    const loginLink = screen.getByRole('link', { name: /login/i });

    expect(homeLink).toHaveAttribute('href', '/');
    expect(aboutLink).toHaveAttribute('href', '/about');
    expect(contactLink).toHaveAttribute('href', '/contact');
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  it('shows mobile menu button only on mobile', () => {
    render(<Header />);

    const menuButton = screen.getByLabelText('Toggle navigation menu');
    expect(menuButton).toBeInTheDocument();
    expect(menuButton).toHaveClass('md:hidden');
  });

  it('toggles mobile menu when menu button is clicked', () => {
    render(<Header />);

    // Mobile menu should not be visible initially
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();

    // Click the menu button
    const menuButton = screen.getByLabelText('Toggle navigation menu');
    fireEvent.click(menuButton);

    // Mobile menu should now be visible
    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();

    // Click the menu button again
    fireEvent.click(menuButton);

    // Mobile menu should not be visible again
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
  });

  it('sets up and cleans up route change event listeners', () => {
    const mockOn = jest.fn();
    const mockOff = jest.fn();

    jest.spyOn(require('next/router'), 'useRouter').mockImplementation(() => ({
      events: {
        on: mockOn,
        off: mockOff,
      },
    }));

    const { unmount } = render(<Header />);

    // Check if event listener is set up
    expect(mockOn).toHaveBeenCalledWith('routeChangeStart', expect.any(Function));

    // Unmount component
    unmount();

    // Check if event listener is cleaned up
    expect(mockOff).toHaveBeenCalledWith('routeChangeStart', expect.any(Function));
  });

  it('closes mobile menu on route change', async () => {
    let routeChangeHandler;

    jest.spyOn(require('next/router'), 'useRouter').mockImplementation(() => ({
      events: {
        on: (event, handler) => {
          if (event === 'routeChangeStart') {
            routeChangeHandler = handler;
          }
        },
        off: jest.fn(),
      },
    }));

    render(<Header />);

    // Open mobile menu
    const menuButton = screen.getByLabelText('Toggle navigation menu');
    fireEvent.click(menuButton);

    // Verify menu is open
    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();

    // Simulate route change - wrap in act()
    act(() => {
      routeChangeHandler();
    });

    // We need to wait for the state update to complete
    await waitFor(() => {
      expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
    });
  });
});
