import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import LoginPage from '@/pages/login';
import supabase from '@/lib/supabaseClient';

// Hoist mocks using vi.hoisted
const {
  mockShowErrorModal,
  mockShowSuccessModal,
  mockReplace,
  mockSignInWithPassword,
  mockSignInWithOtp,
} = vi.hoisted(() => {
  const mockShowErrorModal = vi.fn();
  const mockShowSuccessModal = vi.fn();
  const mockReplace = vi.fn();
  const mockSignInWithPassword = vi.fn();
  const mockSignInWithOtp = vi.fn();
  return {
    mockShowErrorModal,
    mockShowSuccessModal,
    mockReplace,
    mockSignInWithPassword,
    mockSignInWithOtp,
  };
});

vi.mock('next/router', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

vi.mock('@/contexts/ModalContext', () => ({
  useModal: () => ({
    showErrorModal: mockShowErrorModal,
    showSuccessModal: mockShowSuccessModal,
  }),
}));

vi.mock('@/lib/supabaseClient', () => ({
  __esModule: true,
  default: {
    auth: {
      signInWithPassword: mockSignInWithPassword,
      signInWithOtp: mockSignInWithOtp,
    },
  },
}));

const mockedSupabase = supabase as {
  auth: {
    signInWithPassword: typeof mockSignInWithPassword;
    signInWithOtp: typeof mockSignInWithOtp;
  };
};

// Helpers
const renderPage = () => render(<LoginPage />);
const setupUser = () => userEvent.setup();
const fillLoginForm = async (
  user: ReturnType<typeof userEvent.setup>,
  email: string,
  password: string,
): Promise<void> => {
  await user.type(screen.getByLabelText(/email address/i), email);
  await user.type(screen.getByLabelText(/password/i), password);
};

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders the login form initially', () => {
    renderPage();
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  test('shows signup and forgot password links', () => {
    renderPage();
    expect(screen.getByTestId('signup-button')).toBeInTheDocument();
    expect(screen.getByText(/forgot your password/i)).toBeInTheDocument();
  });

  test('shows all SSO login buttons', () => {
    renderPage();
    ['google', 'facebook', 'instagram', 'apple'].forEach(provider => {
      expect(screen.getByTestId(`sso-${provider}`)).toBeInTheDocument();
    });
  });

  test('switches to magic link form when clicked', async () => {
    renderPage();
    const user = setupUser();
    await user.click(screen.getByTestId('show-magic'));

    expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
    expect(screen.getByTestId('submit-magic')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  test('submits magic link request and shows success modal', async () => {
    mockSignInWithOtp.mockResolvedValueOnce({ error: null });

    renderPage();
    const user = setupUser();

    await user.click(screen.getByTestId('show-magic'));
    await user.type(screen.getByLabelText(/email/i), 'magic@example.com');
    await user.click(screen.getByTestId('submit-magic'));

    await waitFor(() => {
      expect(mockSignInWithOtp).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'magic@example.com' }),
      );
      expect(mockShowSuccessModal).toHaveBeenCalledWith(
        'Check your email inbox for a secure login link!',
        'Magic Link Sent',
      );
    });
  });

  test('handles successful email/password login', async () => {
    mockSignInWithPassword.mockResolvedValueOnce({
      data: { user: {} },
      error: null,
    });

    renderPage();
    const user = setupUser();
    await fillLoginForm(user, 'user@example.com', 'Password99!');
    await user.click(screen.getByTestId('button'));

    await waitFor(() => {
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'Password99!',
      });
      expect(mockReplace).toHaveBeenCalledWith('/dashboard');
    });
  });

  test('shows error modal when login fails', async () => {
    mockSignInWithPassword.mockResolvedValueOnce({
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
        'Login Failed',
      );
    });
  });

  test('handles magic link request error and shows error modal', async () => {
    mockSignInWithOtp.mockResolvedValueOnce({
      error: { message: 'Some magic link error' },
    });

    renderPage();
    const user = setupUser();

    await user.click(screen.getByTestId('show-magic'));
    await user.type(screen.getByLabelText(/email/i), 'magic@example.com');
    await user.click(screen.getByTestId('submit-magic'));

    await waitFor(() => {
      expect(mockSignInWithOtp).toHaveBeenCalled();
      expect(mockShowErrorModal).toHaveBeenCalledWith(
        'Unable to send magic link. Please try again.',
        'Magic Link Error',
      );
    });
  });

  test('shows SSO under development modal when SSO button is clicked', async () => {
    renderPage();
    const user = setupUser();
    await user.click(screen.getByTestId('sso-google'));

    await waitFor(() => {
      expect(mockShowErrorModal).toHaveBeenCalledWith(
        'We are so sorry, SSO login with Google is currently under development.',
        'SSO Under Development',
      );
    });
  });
});
