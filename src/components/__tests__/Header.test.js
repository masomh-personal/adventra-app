import { render, screen, waitFor, act, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from '@/components/Header';
import { useRouter } from 'next/router';
import supabase from '@/lib/supabaseClient';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock Supabase client
jest.mock('@/lib/supabaseClient', () => ({
  auth: {
    getSession: jest.fn(),
    onAuthStateChange: jest.fn(),
    signOut: jest.fn(),
  },
}));

describe('Header Component', () => {
  let mockPush, mockRouterEvents;
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    mockPush = jest.fn();
    mockRouterEvents = {
      on: jest.fn(),
      off: jest.fn(),
    };

    useRouter.mockReturnValue({
      push: mockPush,
      events: mockRouterEvents,
    });

    // Default mock setup: no user
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
    supabase.auth.onAuthStateChange.mockReturnValue({
      data: {
        subscription: { unsubscribe: jest.fn() },
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders logo and default links when logged out', async () => {
    await act(async () => render(<Header />));
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

  it('renders dashboard and logout buttons when user is logged in', async () => {
    supabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'abc123' } } },
    });

    await act(async () => render(<Header />));

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

  it('toggles mobile menu', async () => {
    await act(async () => render(<Header />));

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

  it('calls signOut and navigates to /login on logout', async () => {
    supabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'abc123' } } },
    });

    supabase.auth.signOut.mockResolvedValue({ error: null });

    await act(async () => render(<Header />));
    const logoutButton = screen.getByTestId('logout-button');

    await user.click(logoutButton);

    await waitFor(() => {
      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  it('cleans up event listeners on unmount', async () => {
    const unsubscribeMock = jest.fn();
    supabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: unsubscribeMock } },
    });

    const { unmount } = await act(async () => render(<Header />));
    unmount();

    expect(mockRouterEvents.off).toHaveBeenCalledWith('routeChangeStart', expect.any(Function));
    expect(unsubscribeMock).toHaveBeenCalled();
  });

  it('logs an error if signOut fails', async () => {
    supabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'abc123' } } },
    });
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    supabase.auth.signOut.mockResolvedValueOnce({ error: new Error('Sign out failed') });

    await act(async () => render(<Header />));
    const logoutButton = screen.getByTestId('logout-button');
    await user.click(logoutButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error logging out:',
        new Error('Sign out failed')
      );
    });

    consoleErrorSpy.mockRestore();
  });

  it('logs an error if getSession fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    supabase.auth.getSession.mockRejectedValueOnce(new Error('Get session failed'));

    await act(async () => render(<Header />));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error fetching session:',
        new Error('Get session failed')
      );
    });

    consoleErrorSpy.mockRestore();
  });

  it('renders correct links in mobile menu when logged out', async () => {
    await act(async () => render(<Header />));
    const toggleButton = screen.getByTestId('mobile-menu-button');
    await user.click(toggleButton);
    const mobileMenu = screen.getByTestId('mobile-menu'); // Get the mobile menu
    expect(mobileMenu).toBeInTheDocument();
    const mobileNav = screen.getByTestId('mobile-nav');
    expect(mobileNav).toBeInTheDocument();

    // Scope queries to the mobile menu
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

  it('renders correct links in mobile menu when logged in', async () => {
    supabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'abc123' } } },
    });
    await act(async () => render(<Header />));
    const toggleButton = screen.getByTestId('mobile-menu-button');
    await user.click(toggleButton);
    const mobileMenu = screen.getByTestId('mobile-menu'); // Get the mobile menu
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

  it('renders correct links in desktop nav when logged out', async () => {
    await act(async () => render(<Header />));
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

  it('renders correct links in desktop nav when logged in', async () => {
    supabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'abc123' } } },
    });
    await act(async () => render(<Header />));
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
