import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import LoginPage from '@/pages/login';
import supabase from '@/lib/supabaseClient';

// Mocks
const mockShowErrorModal = jest.fn();
const mockShowSuccessModal = jest.fn();
const mockReplace = jest.fn();

jest.mock('next/router', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

jest.mock('@/contexts/ModalContext', () => ({
  useModal: () => ({
    showErrorModal: mockShowErrorModal,
    showSuccessModal: mockShowSuccessModal,
  }),
}));

jest.mock('@/lib/supabaseClient', () => ({
  __esModule: true,
  default: {
    auth: {
      signInWithPassword: jest.fn(),
      signInWithOtp: jest.fn(),
    },
  },
}));

const mockedSupabase = supabase as jest.Mocked<typeof supabase>;

// Helpers
const renderPage = () => render(<LoginPage />);
const setupUser = () => userEvent.setup();
const fillLoginForm = async (
  user: ReturnType<typeof userEvent.setup>,
  email: string,
  password: string
): Promise<void> => {
  await user.type(screen.getByLabelText(/email address/i), email);
  await user.type(screen.getByLabelText(/password/i), password);
};

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the login form initially', () => {
    renderPage();
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('shows signup and forgot password links', () => {
    renderPage();
    expect(screen.getByTestId('signup-button')).toBeInTheDocument();
    expect(screen.getByText(/forgot your password/i)).toBeInTheDocument();
  });

  it('shows all SSO login buttons', () => {
    renderPage();
    ['google', 'facebook', 'instagram', 'apple'].forEach((provider) => {
      expect(screen.getByTestId(`sso-${provider}`)).toBeInTheDocument();
    });
  });

  it('switches to magic link form when clicked', async () => {
    renderPage();
    const user = setupUser();
    await user.click(screen.getByTestId('show-magic'));

    expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
    expect(screen.getByTestId('submit-magic')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('submits magic link request and shows success modal', async () => {
    (mockedSupabase.auth.signInWithOtp as jest.Mock).mockResolvedValueOnce({ error: null });

    renderPage();
    const user = setupUser();

    await user.click(screen.getByTestId('show-magic'));
    await user.type(screen.getByLabelText(/email/i), 'magic@example.com');
    await user.click(screen.getByTestId('submit-magic'));

    await waitFor(() => {
      expect(mockedSupabase.auth.signInWithOtp).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'magic@example.com' })
      );
      expect(mockShowSuccessModal).toHaveBeenCalledWith(
        'Check your email inbox for a secure login link!',
        'Magic Link Sent'
      );
    });
  });

  it('handles successful email/password login', async () => {
    (mockedSupabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({
      data: { user: {} },
      error: null,
    });

    renderPage();
    const user = setupUser();
    await fillLoginForm(user, 'user@example.com', 'Password99!');
    await user.click(screen.getByTestId('button'));

    await waitFor(() => {
      expect(mockedSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'Password99!',
      });
      expect(mockReplace).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('shows error modal when login fails', async () => {
    (mockedSupabase.auth.signInWithPassword as jest.Mock).mockResolvedValueOnce({
      data: null,
      error: { message: 'Invalid login credentials' },
    });

    renderPage();
    const user = setupUser();
    await fillLoginForm(user, 'fail@example.com', 'Password99!');
    await waitFor(() => expect(screen.getByTestId('button')).toBeEnabled());
    await user.click(screen.getByTestId('button'));

    await waitFor(() => {
      expect(mockShowErrorModal).toHaveBeenCalledWith(
        'Invalid email or password. Please try again. Please contact support if this error persists',
        'Login Failed'
      );
    });
  });

  it('handles magic link request error and shows error modal', async () => {
    (mockedSupabase.auth.signInWithOtp as jest.Mock).mockResolvedValueOnce({
      error: { message: 'Some magic link error' },
    });

    renderPage();
    const user = setupUser();

    await user.click(screen.getByTestId('show-magic'));
    await user.type(screen.getByLabelText(/email/i), 'magic@example.com');
    await user.click(screen.getByTestId('submit-magic'));

    await waitFor(() => {
      expect(mockedSupabase.auth.signInWithOtp).toHaveBeenCalled();
      expect(mockShowErrorModal).toHaveBeenCalledWith(
        'Unable to send magic link. Please try again.',
        'Magic Link Error'
      );
    });
  });

  it('shows SSO under development modal when SSO button is clicked', async () => {
    renderPage();
    const user = setupUser();
    await user.click(screen.getByTestId('sso-google'));

    await waitFor(() => {
      expect(mockShowErrorModal).toHaveBeenCalledWith(
        'We are so sorry, SSO login with Google is currently under development.',
        'SSO Under Development'
      );
    });
  });
});
