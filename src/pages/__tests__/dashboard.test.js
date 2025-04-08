import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from '@/pages/dashboard';
import supabase from '@/lib/supabaseClient';
import { useRouter } from 'next/router'; // Import useRouter here

// Mock the withAuth higher-order component
jest.mock('@/lib/withAuth', () => (Component) => (props) => <Component {...props} />);

// Mock useRouter
jest.mock('next/router', () => ({
  useRouter: jest.fn(), // Mock the useRouter function itself
}));

// Mock useModal
jest.mock('@/contexts/ModalContext', () => ({
  useModal: () => ({
    showErrorModal: jest.fn(),
    showSuccessModal: jest.fn(),
  }),
}));

// Mock supabase
jest.mock('@/lib/supabaseClient', () => ({
  auth: {
    signOut: jest.fn(),
  },
}));

describe('Dashboard', () => {
  const setup = () => userEvent.setup();
  const mockUser = {
    user_metadata: { full_name: 'Test User' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the dashboard header and welcome message', () => {
    render(<Dashboard user={mockUser} />);
    expect(screen.getByText(/Welcome,/i)).toBeInTheDocument();
    expect(screen.getByText(/someone new/i)).toBeInTheDocument();
  });

  it('renders the Edit Profile and Log Out buttons', () => {
    render(<Dashboard user={mockUser} />);
    expect(screen.getByTestId('edit-profile-button')).toBeInTheDocument();
    expect(screen.getByTestId('log-out-button')).toBeInTheDocument();
  });

  it('renders the InfoCards', () => {
    render(<Dashboard user={mockUser} />);
    expect(screen.getByTestId('matches-infocard')).toBeInTheDocument();
    expect(screen.getByTestId('adventurers-infocard')).toBeInTheDocument();
    expect(screen.getByTestId('messages-infocard')).toBeInTheDocument();
  });

  it('calls signOut and redirects to login when Log Out is clicked', async () => {
    const user = setup();
    const push = jest.fn(); // Create a mock push function
    useRouter.mockReturnValue({ push }); // Mock the useRouter hook to return our mock push function
    supabase.auth.signOut.mockResolvedValueOnce({ error: null });

    render(<Dashboard user={mockUser} />);
    await user.click(screen.getByTestId('log-out-button'));

    await waitFor(() => {
      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(push).toHaveBeenCalledWith('/login'); // Use the mock push function
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

  it('calls handleEditProfile when Edit Profile is clicked', async () => {
    const user = setup();
    render(<Dashboard user={mockUser} />);
    const editProfileButton = screen.getByTestId('edit-profile-button');
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await user.click(editProfileButton);

    await waitFor(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith('Edit Profile clicked');
    });

    consoleLogSpy.mockRestore();
  });

  it('calls onClick when the Matches button is clicked', async () => {
    const user = setup();
    render(<Dashboard user={mockUser} />);
    const matchesButton = screen.getByTestId('infocard-button-matches');
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await user.click(matchesButton);

    await waitFor(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith('View Matches clicked');
    });

    consoleLogSpy.mockRestore();
  });

  it('calls onClick when the Adventurers button is clicked', async () => {
    const user = setup();
    render(<Dashboard user={mockUser} />);
    const adventurersButton = screen.getByTestId('infocard-button-adventurers');
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await user.click(adventurersButton);

    await waitFor(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith('Browse Adventures clicked');
    });

    consoleLogSpy.mockRestore();
  });

  it('calls onClick when the Messages button is clicked', async () => {
    const user = setup();
    render(<Dashboard user={mockUser} />);
    const messagesButton = screen.getByTestId('infocard-button-messages');
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await user.click(messagesButton);

    await waitFor(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith('View Messages clicked');
    });

    consoleLogSpy.mockRestore();
  });
});
