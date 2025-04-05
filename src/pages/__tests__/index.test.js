import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '@/pages/index';
import { useRouter } from 'next/router';

// Mock the router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock the next/link component
jest.mock('next/link', () => {
  const Link = ({ children, href }) => <a href={href}>{children}</a>;
  Link.displayName = 'MockLink';
  return Link;
});

// Mock withAuth to just return the component without Supabase check
jest.mock('@/lib/withAuth', () => (Component) => {
  const Wrapped = (props) => <Component {...props} />;
  Wrapped.displayName = 'MockWithAuth';
  return Wrapped;
});

describe('HomePage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockImplementation(() => ({
      push: mockPush,
    }));
  });

  describe('Content', () => {
    it('should render the welcome heading with emoji', () => {
      act(() => {
        render(<HomePage />);
      });
      expect(screen.getByText('🏕️ Welcome to Adventra')).toBeInTheDocument();
    });

    it('should render the descriptive tagline', () => {
      act(() => {
        render(<HomePage />);
      });
      expect(
        screen.getByText('A social network for outdoor adventurers. Connect, share, and explore!')
      ).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should navigate to login page when login button is clicked', () => {
      act(() => {
        render(<HomePage />);
      });
      const loginButton = screen.getByText('Login');
      fireEvent.click(loginButton);
      expect(mockPush).toHaveBeenCalledWith('/login');
    });

    it('should render signup link with correct href', () => {
      act(() => {
        render(<HomePage />);
      });
      const signupLink = screen.getByText("Don't have an account? Sign up today!");
      expect(signupLink).toHaveAttribute('href', '/signup');
    });
  });

  describe('Background', () => {
    it('should show video by default', () => {
      const { container } = render(<HomePage />);
      const video = container.querySelector('video');
      expect(video).not.toBeNull();
      expect(video.tagName.toLowerCase()).toBe('video');
    });

    it('should display gradient fallback when video errors', () => {
      const { container } = render(<HomePage />);
      const video = container.querySelector('video');
      fireEvent.error(video);

      const fallback = screen.getByTestId('gradient-fallback');
      expect(fallback).toBeInTheDocument();
    });

    it('should render dark overlay for better text readability', () => {
      render(<HomePage />);
      const overlay = screen.getByTestId('dark-overlay');
      expect(overlay).toBeInTheDocument();
      expect(overlay).toHaveClass('opacity-40');
    });
  });
});
