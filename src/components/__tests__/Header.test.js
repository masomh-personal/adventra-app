import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
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

  beforeEach(() => {
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

  it('renders logo and default links', async () => {
    await act(async () => render(<Header />));
    expect(screen.getByAltText(/adventra logo/i)).toBeInTheDocument();
    expect(screen.getByText(/home/i)).toBeInTheDocument();
    expect(screen.getByText(/about/i)).toBeInTheDocument();
    expect(screen.getByText(/contact/i)).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  it('renders dashboard and logout buttons when user is logged in', async () => {
    supabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'abc123' } } },
    });

    await act(async () => render(<Header />));

    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });

  it('toggles mobile menu', async () => {
    await act(async () => render(<Header />));

    const toggleButton = screen.getByRole('button', { name: /toggle navigation menu/i });
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(screen.queryByTestId('mobile-menu')).not.toBeInTheDocument();
  });

  it('calls signOut and navigates to /login on logout', async () => {
    supabase.auth.getSession.mockResolvedValue({
      data: { session: { user: { id: 'abc123' } } },
    });

    supabase.auth.signOut.mockResolvedValue({ error: null });

    await act(async () => render(<Header />));
    const logoutButton = await screen.findByText(/logout/i);

    fireEvent.click(logoutButton);

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
});
