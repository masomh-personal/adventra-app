import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from '@/pages/dashboard';
import supabase from '@/lib/supabaseClient';
import { useRouter } from 'next/router';

// Mock the withAuth HOC
jest.mock('@/lib/withAuth', () => (Component) => {
  const MockWithAuth = (props) => <Component {...props} />;
  MockWithAuth.displayName = `WithAuth(${Component.displayName || Component.name || 'Component'})`;
  return MockWithAuth;
});

// Mock router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock supabase
jest.mock('@/lib/supabaseClient', () => ({
  auth: {
    signOut: jest.fn(),
  },
}));

// Optional: mock modal context if used
jest.mock('@/contexts/ModalContext', () => ({
  useModal: () => ({
    showErrorModal: jest.fn(),
    showSuccessModal: jest.fn(),
  }),
}));

describe('Dashboard', () => {
  const setup = () => userEvent.setup();
  const mockUser = {
    user_metadata: { full_name: 'Test User' },
  };

  let mockPush;

  beforeEach(() => {
    jest.clearAllMocks();
    mockPush = jest.fn();
    useRouter.mockReturnValue({ push: mockPush });
  });

  it('renders the dashboard header and welcome message', () => {
    render(<Dashboard user={mockUser} />);
    expect(screen.getByText(/Welcome,/i)).toBeInTheDocument();
    expect(screen.getByText(/Test/i)).toBeInTheDocument();
  });

  it('renders the Edit Profile and Log Out buttons', () => {
    render(<Dashboard user={mockUser} />);
    expect(screen.getByTestId('edit-profile-button')).toBeInTheDocument();
    expect(screen.getByTestId('log-out-button')).toBeInTheDocument();
  });

  it('renders the InfoCards', () => {
    render(<Dashboard user={mockUser} />);
    expect(screen.getByTestId('adventurers-infocard')).toBeInTheDocument();
    expect(screen.getByTestId('messages-infocard')).toBeInTheDocument();
  });

  it('calls signOut and redirects to login when Log Out is clicked', async () => {
    const user = setup();
    supabase.auth.signOut.mockResolvedValueOnce({ error: null });

    render(<Dashboard user={mockUser} />);
    await user.click(screen.getByTestId('log-out-button'));

    await waitFor(() => {
      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  it('logs an error if signOut fails', async () => {
    const user = setup();
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    supabase.auth.signOut.mockResolvedValueOnce({ error: new Error('Sign out failed') });

    render(<Dashboard user={mockUser} />);
    await user.click(screen.getByTestId('log-out-button'));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error logging out:',
        new Error('Sign out failed')
      );
    });

    consoleErrorSpy.mockRestore();
  });

  it('calls router.push when Edit Profile is clicked', async () => {
    const user = setup();

    render(<Dashboard user={mockUser} />);
    const editProfileButton = screen.getByTestId('edit-profile-button');

    await user.click(editProfileButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/edit-profile');
    });
  });

  it('calls onClick when the Adventurers button is clicked', async () => {
    const user = setup();
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    render(<Dashboard user={mockUser} />);
    await user.click(screen.getByTestId('infocard-button-adventurers'));

    await waitFor(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith('Browse Adventures clicked');
    });

    consoleLogSpy.mockRestore();
  });

  it('calls onClick when the Messages button is clicked', async () => {
    const user = setup();
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    render(<Dashboard user={mockUser} />);
    await user.click(screen.getByTestId('infocard-button-messages'));

    await waitFor(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith('View Messages clicked');
    });

    consoleLogSpy.mockRestore();
  });
});
