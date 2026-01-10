import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
// Import the actual Dashboard component (not the wrapped one from default export)
// Since we mock withAuth, we need to import the component directly
import DashboardPageModule from '@/pages/dashboard';
import supabase from '@/lib/supabaseClient';
import { useRouter } from 'next/router';
import type { User } from '@supabase/supabase-js';

// Mock the withAuth HOC - returns component that accepts user prop
jest.mock('@/lib/withAuth', () => {
  return <P extends { user: unknown }>(Component: React.ComponentType<P>) => {
    const MockWithAuth = (props: P) => <Component {...props} />;
    MockWithAuth.displayName = `WithAuth(${(Component.displayName || Component.name || 'Component') as string})`;
    return MockWithAuth;
  };
});

// Mock router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock supabase
jest.mock('@/lib/supabaseClient', () => ({
  __esModule: true,
  default: {
    auth: {
      signOut: jest.fn(),
    },
  },
}));

const mockedUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockedSupabase = supabase as jest.Mocked<typeof supabase>;

// Optional: mock modal context if used
jest.mock('@/contexts/ModalContext', () => ({
  useModal: () => ({
    showErrorModal: jest.fn(),
    showSuccessModal: jest.fn(),
    openModal: jest.fn(),
    closeModal: jest.fn(),
    showInfoModal: jest.fn(),
    showConfirmationModal: jest.fn().mockResolvedValue(false),
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

  let mockPush: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPush = jest.fn();
    mockedUseRouter.mockReturnValue({ push: mockPush } as unknown as ReturnType<typeof useRouter>);
  });

  // Dashboard is wrapped with withAuth, so we need to cast it to accept user prop
  const DashboardPage = DashboardPageModule as React.ComponentType<{ user: User | null }>;

  it('renders the dashboard header and welcome message', () => {
    render(<DashboardPage user={mockUser} />);
    expect(screen.getByText(/Welcome,/i)).toBeInTheDocument();
    expect(screen.getByText(/Test/i)).toBeInTheDocument();
  });

  it('renders the Edit Profile and Log Out buttons', () => {
    render(<DashboardPage user={mockUser} />);
    expect(screen.getByTestId('edit-profile-button')).toBeInTheDocument();
    expect(screen.getByTestId('log-out-button')).toBeInTheDocument();
  });

  it('renders the InfoCards', () => {
    render(<DashboardPage user={mockUser} />);
    expect(screen.getByTestId('adventurers-infocard')).toBeInTheDocument();
    expect(screen.getByTestId('messages-infocard')).toBeInTheDocument();
  });

  it('calls signOut and redirects to login when Log Out is clicked', async () => {
    const user = setup();
    (mockedSupabase.auth.signOut as jest.Mock).mockResolvedValueOnce({ error: null });

    render(<DashboardPage user={mockUser} />);
    await user.click(screen.getByTestId('log-out-button'));

    await waitFor(() => {
      expect(mockedSupabase.auth.signOut).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  it('logs an error if signOut fails', async () => {
    const user = setup();
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (mockedSupabase.auth.signOut as jest.Mock).mockResolvedValueOnce({
      error: new Error('Sign out failed'),
    });

    render(<DashboardPage user={mockUser} />);
    await user.click(screen.getByTestId('log-out-button'));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error logging out:', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });

  it('calls router.push when Edit Profile is clicked', async () => {
    const user = setup();

    render(<DashboardPage user={mockUser} />);
    const editProfileButton = screen.getByTestId('edit-profile-button');

    await user.click(editProfileButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/edit-profile');
    });
  });
});
