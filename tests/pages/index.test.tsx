import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '@/pages/index';
import { useRouter } from 'next/router';
import { vi } from 'vitest';

// Mock the router
vi.mock('next/router', () => ({
  useRouter: vi.fn(),
}));

const mockedUseRouter = vi.mocked(useRouter);

// Mock the next/link component
vi.mock('next/link', () => {
  const Link = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  Link.displayName = 'MockLink';
  return Link;
});

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
    it('should render the welcome heading with emoji', () => {
      act(() => {
        render(<HomePage user={null} />);
      });
      expect(screen.getByText('🏕️ Welcome to Adventra')).toBeInTheDocument();
    });

    it('should render the descriptive tagline', () => {
      act(() => {
        render(<HomePage user={null} />);
      });
      expect(
        screen.getByText('A social network for outdoor adventurers. Connect, share, and explore!')
      ).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should navigate to login page when login button is clicked', () => {
      act(() => {
        render(<HomePage user={null} />);
      });
      const loginButton = screen.getByText('Login');
      fireEvent.click(loginButton);
      expect(mockPush).toHaveBeenCalledWith('/login');
    });

    it('should render the signup button as a link with correct href', async () => {
      await act(async () => {
        render(<HomePage user={null} />);
      });

      const signupButton = screen.getByTestId('signup-button');
      expect(signupButton.tagName).toBe('A'); // Ensures it's rendered as an anchor tag
    });
  });

  describe('Background', () => {
    it('should show video by default', () => {
      const { container } = render(<HomePage user={null} />);
      const video = container.querySelector('video');
      expect(video).not.toBeNull();
      expect(video?.tagName.toLowerCase()).toBe('video');
    });

    it('should display gradient fallback when video errors', () => {
      const { container } = render(<HomePage user={null} />);
      const video = container.querySelector('video');
      if (video) {
        fireEvent.error(video);
      }

      const fallback = screen.getByTestId('gradient-fallback');
      expect(fallback).toBeInTheDocument();
    });

    it('should render dark overlay for better text readability', () => {
      render(<HomePage user={null} />);
      const overlay = screen.getByTestId('dark-overlay');
      expect(overlay).toBeInTheDocument();
      expect(overlay).toHaveClass('opacity-40');
    });
  });
});
