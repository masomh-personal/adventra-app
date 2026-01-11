import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
// Import the actual Dashboard component (not the wrapped one from default export)
// Since we mock withAuth, we need to import the component directly
import DashboardPageModule from '@/pages/dashboard';
import { useRouter } from 'next/router';
import type { User } from '@supabase/supabase-js';

// Hoist mocks
const { mockSignOut, mockUseRouter } = vi.hoisted(() => {
  const mockSignOut = vi.fn();
  const mockUseRouter = vi.fn();
  return { mockSignOut, mockUseRouter };
});

// Mock the withAuth HOC - returns component that accepts user prop
vi.mock('@/lib/withAuth', () => ({
  default: <P extends { user: unknown }>(Component: React.ComponentType<P>) => {
    const MockWithAuth = (props: P) => <Component {...props} />;
    MockWithAuth.displayName = `WithAuth(${(Component.displayName || Component.name || 'Component') as string})`;
    return MockWithAuth;
  },
}));

// Mock router
vi.mock('next/router', () => ({
  useRouter: mockUseRouter,
}));

// Mock supabase
vi.mock('@/lib/supabaseClient', () => ({
  __esModule: true,
  default: {
    auth: {
      signOut: mockSignOut,
    },
  },
}));

const mockedUseRouter = vi.mocked(useRouter);

// Optional: mock modal context if used
vi.mock('@/contexts/ModalContext', () => ({
  useModal: () => ({
    showErrorModal: vi.fn(),
    showSuccessModal: vi.fn(),
    openModal: vi.fn(),
    closeModal: vi.fn(),
    showInfoModal: vi.fn(),
    showConfirmationModal: vi.fn().mockResolvedValue(false),
  }),
}));

describe('Dashboard', () => {
  const setup = () => userEvent.setup();
  const mockUser: User = {
    id: 'test-user',
    user_metadata: { full_name: 'Test User' },
    app_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
  } as User;

  let mockPush: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockPush = vi.fn();
    mockedUseRouter.mockReturnValue({ push: mockPush } as unknown as ReturnType<typeof useRouter>);
  });

  // Dashboard is wrapped with withAuth, so we need to cast it to accept user prop
  const DashboardPage = DashboardPageModule as React.ComponentType<{ user: User | null }>;

  test('renders the dashboard header and welcome message', () => {
    render(<DashboardPage user={mockUser} />);
    expect(screen.getByText(/Welcome,/i)).toBeInTheDocument();
    expect(screen.getByText(/Test/i)).toBeInTheDocument();
  });

  test('renders the Edit Profile and Log Out buttons', () => {
    render(<DashboardPage user={mockUser} />);
    expect(screen.getByTestId('edit-profile-button')).toBeInTheDocument();
    expect(screen.getByTestId('log-out-button')).toBeInTheDocument();
  });

  test('renders the InfoCards', () => {
    render(<DashboardPage user={mockUser} />);
    expect(screen.getByTestId('adventurers-infocard')).toBeInTheDocument();
    expect(screen.getByTestId('messages-infocard')).toBeInTheDocument();
  });

  test('calls signOut and redirects to login when Log Out is clicked', async () => {
    const user = setup();
    mockSignOut.mockResolvedValueOnce({ error: null });

    render(<DashboardPage user={mockUser} />);
    await user.click(screen.getByTestId('log-out-button'));

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  test('logs an error if signOut fails', async () => {
    const user = setup();
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockSignOut.mockResolvedValueOnce({
      error: new Error('Sign out failed'),
    });

    render(<DashboardPage user={mockUser} />);
    await user.click(screen.getByTestId('log-out-button'));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error logging out:', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });

  test('calls router.push when Edit Profile is clicked', async () => {
    const user = setup();

    render(<DashboardPage user={mockUser} />);
    const editProfileButton = screen.getByTestId('edit-profile-button');

    await user.click(editProfileButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/edit-profile');
    });
  });
});
