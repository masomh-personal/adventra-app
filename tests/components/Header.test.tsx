import { render, screen, waitFor, act, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Header from '@/components/Header';
import { useRouter } from 'next/router';
import supabase from '@/lib/supabaseClient';


// Hoist mocks
const { mockGetSession, mockOnAuthStateChange, mockSignOut, mockUseRouter } = vi.hoisted(() => {
  const mockGetSession = vi.fn();
  const mockOnAuthStateChange = vi.fn();
  const mockSignOut = vi.fn();
  const mockUseRouter = vi.fn();
  return { mockGetSession, mockOnAuthStateChange, mockSignOut, mockUseRouter };
});

// Mock Next.js router
vi.mock('next/router', () => ({
  useRouter: mockUseRouter,
}));

// Mock Supabase client
vi.mock('@/lib/supabaseClient', () => ({
  __esModule: true,
  default: {
    auth: {
      getSession: mockGetSession,
      onAuthStateChange: mockOnAuthStateChange,
      signOut: mockSignOut,
    },
  },
}));

const mockedUseRouter = vi.mocked(useRouter);
const mockedSupabase = supabase as {
  auth: {
    getSession: typeof mockGetSession;
    onAuthStateChange: typeof mockOnAuthStateChange;
    signOut: typeof mockSignOut;
  };
};

describe('Header Component', () => {
  let mockPush: ReturnType<typeof vi.fn>;
  let mockRouterEvents: {
    on: ReturnType<typeof vi.fn>;
    off: ReturnType<typeof vi.fn>;
  };
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    mockPush = vi.fn();
    mockRouterEvents = {
      on: vi.fn(),
      off: vi.fn(),
    };

    mockedUseRouter.mockReturnValue({
      push: mockPush,
      events: mockRouterEvents,
    } as unknown as ReturnType<typeof useRouter>);

    // Default mock setup: no user
    mockGetSession.mockResolvedValue({ data: { session: null }, error: null });
    mockOnAuthStateChange.mockReturnValue({
      data: {
        subscription: { unsubscribe: vi.fn() },
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

test('renders logo and default links when logged out', async () => {
    await act(async () => {
      render(<Header />);
    });
    expect(screen.getByTestId('logo-link')).toBeInTheDocument();
    expect(screen.getByTestId('logo-link').querySelector('img')).toHaveAttribute('src');
    expect(screen.getByTestId('home-link')).toBeInTheDocument();
    expect(screen.getByTestId('home-link')).toHaveAttribute('href', '/');
    expect(screen.getByTestId('about-link')).toBeInTheDocument();
    expect(screen.getByTestId('about-link')).toHaveAttribute('href', '/about');
    expect(screen.getByTestId('contact-link')).toBeInTheDocument();
    expect(screen.getByTestId('contact-link')).toHaveAttribute('href', '/contact');
    expect(screen.getByTestId('login-link')).toBeInTheDocument();
    expect(screen.getByTestId('login-link')).toHaveAttribute('href', '/login');
    expect(screen.queryByTestId('dashboard-link')).not.toBeInTheDocument();
    expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument();
  });

test('renders dashboard and logout buttons when user is logged in', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: 'abc123' } } },
      error: null,
    });

    await act(async () => {
      render(<Header />);
    });

    expect(screen.getByTestId('dashboard-link')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-link')).toHaveAttribute('href', '/dashboard');
    expect(screen.getByTestId('logout-button')).toBeInTheDocument();
    expect(screen.queryByTestId('home-link')).not.toBeInTheDocument();
    expect(screen.getByTestId('about-link')).toBeInTheDocument();
    expect(screen.getByTestId('about-link')).toHaveAttribute('href', '/about');
    expect(screen.getByTestId('contact-link')).toBeInTheDocument();
    expect(screen.getByTestId('contact-link')).toHaveAttribute('href', '/contact');
    expect(screen.queryByTestId('login-link')).not.toBeInTheDocument();
  });

test('toggles mobile menu', async () => {
    await act(async () => {
      render(<Header />);
    });

    const toggleButton = screen.getByTestId('mobile-menu-button');
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
    expect(screen.getByTestId('mobile-menu-bars')).toBeInTheDocument();
    expect(screen.queryByTestId('mobile-menu-times')).not.toBeInTheDocument();

    await user.click(toggleButton);
    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-menu-times')).toBeInTheDocument();
    expect(screen.queryByTestId('mobile-menu-bars')).not.toBeInTheDocument();

    await user.click(toggleButton);
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
    expect(screen.getByTestId('mobile-menu-bars')).toBeInTheDocument();
    expect(screen.queryByTestId('mobile-menu-times')).not.toBeInTheDocument();
  });

test('calls signOut and navigates to /login on logout', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: 'abc123' } } },
      error: null,
    });

    mockSignOut.mockResolvedValue({ error: null });

    await act(async () => {
      render(<Header />);
    });
    const logoutButton = screen.getByTestId('logout-button');

    await user.click(logoutButton);

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

test('cleans up event listeners on unmount', async () => {
    const unsubscribeMock = vi.fn();
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: unsubscribeMock } },
    });

    const { unmount } = await act(async () => {
      return render(<Header />);
    });
    unmount();

    expect(mockRouterEvents.off).toHaveBeenCalledWith('routeChangeStart', expect.any(Function));
    expect(unsubscribeMock).toHaveBeenCalled();
  });

test('logs an error if signOut fails', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: 'abc123' } } },
      error: null,
    });
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockSignOut.mockResolvedValueOnce({ error: new Error('Sign out failed') });

    await act(async () => {
      render(<Header />);
    });
    const logoutButton = screen.getByTestId('logout-button');
    await user.click(logoutButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error logging out:', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });

test('logs an error if getSession fails', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockGetSession.mockRejectedValueOnce(new Error('Get session failed'));

    await act(async () => {
      render(<Header />);
    });

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching session:', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });

test('renders correct links in mobile menu when logged out', async () => {
    await act(async () => {
      render(<Header />);
    });
    const toggleButton = screen.getByTestId('mobile-menu-button');
    await user.click(toggleButton);
    const mobileMenu = screen.getByTestId('mobile-menu');
    expect(mobileMenu).toBeInTheDocument();
    const mobileNav = screen.getByTestId('mobile-nav');
    expect(mobileNav).toBeInTheDocument();

    expect(within(mobileMenu).getByTestId('home-link')).toBeInTheDocument();
    expect(within(mobileMenu).getByTestId('home-link')).toHaveAttribute('href', '/');
    expect(within(mobileMenu).getByTestId('about-link')).toBeInTheDocument();
    expect(within(mobileMenu).getByTestId('about-link')).toHaveAttribute('href', '/about');
    expect(within(mobileMenu).getByTestId('contact-link')).toBeInTheDocument();
    expect(within(mobileMenu).getByTestId('contact-link')).toHaveAttribute('href', '/contact');
    expect(within(mobileMenu).getByTestId('login-link')).toBeInTheDocument();
    expect(within(mobileMenu).getByTestId('login-link')).toHaveAttribute('href', '/login');
    expect(within(mobileMenu).queryByTestId('dashboard-link')).not.toBeInTheDocument();
    expect(within(mobileMenu).queryByTestId('logout-button')).not.toBeInTheDocument();
  });

test('renders correct links in mobile menu when logged in', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: 'abc123' } } },
      error: null,
    });
    await act(async () => {
      render(<Header />);
    });
    const toggleButton = screen.getByTestId('mobile-menu-button');
    await user.click(toggleButton);
    const mobileMenu = screen.getByTestId('mobile-menu');
    expect(mobileMenu).toBeInTheDocument();
    const mobileNav = screen.getByTestId('mobile-nav');
    expect(mobileNav).toBeInTheDocument();

    expect(within(mobileMenu).getByTestId('dashboard-link')).toBeInTheDocument();
    expect(within(mobileMenu).getByTestId('dashboard-link')).toHaveAttribute('href', '/dashboard');
    expect(within(mobileMenu).getByTestId('about-link')).toBeInTheDocument();
    expect(within(mobileMenu).getByTestId('about-link')).toHaveAttribute('href', '/about');
    expect(within(mobileMenu).getByTestId('contact-link')).toBeInTheDocument();
    expect(within(mobileMenu).getByTestId('contact-link')).toHaveAttribute('href', '/contact');
    expect(within(mobileMenu).getByTestId('logout-button')).toBeInTheDocument();
    expect(within(mobileMenu).queryByTestId('home-link')).not.toBeInTheDocument();
    expect(within(mobileMenu).queryByTestId('login-link')).not.toBeInTheDocument();
  });

test('renders correct links in desktop nav when logged out', async () => {
    await act(async () => {
      render(<Header />);
    });
    expect(screen.getByTestId('desktop-nav')).toBeInTheDocument();
    expect(screen.getByTestId('home-link')).toBeInTheDocument();
    expect(screen.getByTestId('home-link')).toHaveAttribute('href', '/');
    expect(screen.getByTestId('about-link')).toBeInTheDocument();
    expect(screen.getByTestId('about-link')).toHaveAttribute('href', '/about');
    expect(screen.getByTestId('contact-link')).toBeInTheDocument();
    expect(screen.getByTestId('contact-link')).toHaveAttribute('href', '/contact');
    expect(screen.getByTestId('login-link')).toBeInTheDocument();
    expect(screen.getByTestId('login-link')).toHaveAttribute('href', '/login');
    expect(screen.queryByTestId('dashboard-link')).not.toBeInTheDocument();
    expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument();
  });

test('renders correct links in desktop nav when logged in', async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: 'abc123' } } },
      error: null,
    });
    await act(async () => {
      render(<Header />);
    });
    expect(screen.getByTestId('desktop-nav')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-link')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-link')).toHaveAttribute('href', '/dashboard');
    expect(screen.getByTestId('about-link')).toBeInTheDocument();
    expect(screen.getByTestId('about-link')).toHaveAttribute('href', '/about');
    expect(screen.getByTestId('contact-link')).toBeInTheDocument();
    expect(screen.getByTestId('contact-link')).toHaveAttribute('href', '/contact');
    expect(screen.getByTestId('logout-button')).toBeInTheDocument();
    expect(screen.queryByTestId('home-link')).not.toBeInTheDocument();
    expect(screen.queryByTestId('login-link')).not.toBeInTheDocument();
  });
});
