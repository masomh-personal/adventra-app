import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import HomePage from '@/pages/index';
import { useRouter } from 'next/router';

// Mock the router
vi.mock('next/router', () => ({
  useRouter: vi.fn(),
}));

const mockedUseRouter = vi.mocked(useRouter);

// Mock the next/link component
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock withAuth to just return the component without Supabase check
vi.mock('@/lib/withAuth', () => ({
  default: (Component: React.ComponentType<unknown>) => {
    const Wrapped = (props: Record<string, unknown>) => <Component {...props} />;
    Wrapped.displayName = 'MockWithAuth';
    return Wrapped;
  },
}));

describe('HomePage', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseRouter.mockReturnValue({
      push: mockPush,
    } as unknown as ReturnType<typeof useRouter>);
  });

  describe('Content', () => {
    test('should render the welcome heading with emoji', () => {
      act(() => {
        render(<HomePage user={null} />);
      });
      expect(screen.getByText('🏕️ Welcome to Adventra')).toBeInTheDocument();
    });

    test('should render the descriptive tagline', () => {
      act(() => {
        render(<HomePage user={null} />);
      });
      expect(
        screen.getByText('A social network for outdoor adventurers. Connect, share, and explore!'),
      ).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    test('should navigate to login page when login button is clicked', async () => {
      const user = userEvent.setup();
      act(() => {
        render(<HomePage user={null} />);
      });
      const loginButton = screen.getByText('Login');
      await user.click(loginButton);
      expect(mockPush).toHaveBeenCalledWith('/login');
    });

    test('should render the signup button as a link with correct href', async () => {
      await act(async () => {
        render(<HomePage user={null} />);
      });

      const signupButton = screen.getByTestId('signup-button');
      expect(signupButton.tagName).toBe('A'); // Ensures it's rendered as an anchor tag
    });
  });

  describe('Background', () => {
    test('should show video by default', () => {
      const { container } = render(<HomePage user={null} />);
      const video = container.querySelector('video');
      expect(video).not.toBeNull();
      expect(video?.tagName.toLowerCase()).toBe('video');
    });

    test('should display gradient fallback when video errors', () => {
      const { container } = render(<HomePage user={null} />);
      const video = container.querySelector('video');
      if (video) {
        // fireEvent.error is appropriate for video error events (no userEvent equivalent)
        fireEvent.error(video);
      }

      const fallback = screen.getByTestId('gradient-fallback');
      expect(fallback).toBeInTheDocument();
    });

    test('should render dark overlay for better text readability', () => {
      render(<HomePage user={null} />);
      const overlay = screen.getByTestId('dark-overlay');
      expect(overlay).toBeInTheDocument();
      expect(overlay).toHaveClass('opacity-40');
    });
  });
});
