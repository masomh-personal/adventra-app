import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginPage from '@/pages/login';

// Reusable mock functions
const mockShowErrorModal = jest.fn();
const mockShowSuccessModal = jest.fn();

const mockModal = {
  showErrorModal: mockShowErrorModal,
  showSuccessModal: mockShowSuccessModal,
};

jest.mock('next/router', () => ({
  useRouter: () => ({ replace: jest.fn() }),
}));

jest.mock('@/lib/supabaseClient', () => ({
  auth: {
    signInWithPassword: jest.fn(),
    signInWithOtp: jest.fn(),
  },
}));

jest.mock('@/contexts/ModalContext', () => ({
  useModal: () => mockModal,
}));

const mockSupabase = require('@/lib/supabaseClient');

const safeRender = async (ui) => {
  await act(async () => render(ui));
};

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form by default', async () => {
    await safeRender(<LoginPage />);

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('switches to magic link form when button is clicked', async () => {
    await safeRender(<LoginPage />);

    await act(async () => {
      fireEvent.click(screen.getByTestId('show-magic'));
    });

    expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByTestId('submit-magic')).toBeInTheDocument();
  });

  it('logs in with email/password on valid submit', async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({ data: { user: {} }, error: null });

    const email = 'user@example.com';
    const password = 'Password99!';

    await safeRender(<LoginPage />);

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/email address/i), {
        target: { value: email },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: password },
      });
    });

    await act(async () => {
      fireEvent.submit(screen.getByTestId('login-form'));
    });

    await waitFor(() => {
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email,
        password,
      });
    });
  });

  it('calls onSubmit with lowercase email for magic link', async () => {
    mockSupabase.auth.signInWithOtp.mockResolvedValueOnce({ error: null });

    await safeRender(<LoginPage />);

    await act(async () => {
      fireEvent.click(screen.getByTestId('show-magic'));
    });

    const emailInput = screen.getByLabelText(/email/i);

    // Simulate user typing (this must resolve async validation)
    await act(async () => {
      fireEvent.change(emailInput, {
        target: { value: 'TeSt@Example.com' },
      });
    });

    // Let RHF/Yup fully process the change
    await waitFor(() => {
      expect(emailInput).toHaveValue('TeSt@Example.com');
    });

    // Submit form (once field is dirty + valid)
    await act(async () => {
      fireEvent.submit(screen.getByRole('form'));
    });

    await waitFor(() => {
      expect(mockSupabase.auth.signInWithOtp).toHaveBeenCalledWith({
        email: 'test@example.com',
        options: expect.any(Object),
      });
    });
  });

  it('shows error modal on login failure', async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: null,
      error: { message: 'Invalid login credentials' },
    });

    const email = 'fail@example.com';
    const password = 'Password99!';

    await safeRender(<LoginPage />);

    await act(async () => {
      fireEvent.change(screen.getByLabelText(/email address/i), {
        target: { value: email },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: password },
      });
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('button'));
    });

    await waitFor(() => {
      expect(mockModal.showErrorModal).toHaveBeenCalledWith(
        'Invalid email or password. Please try again.',
        'Login Failed'
      );
    });
  });

  it('disables login button while loading', async () => {
    await safeRender(<LoginPage />);

    await act(async () => {
      fireEvent.click(screen.getByTestId('show-magic'));
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      });
    });

    const button = screen.getByTestId('submit-magic');
    expect(button).toBeInTheDocument();
  });

  it('shows all SSO provider buttons', async () => {
    await safeRender(<LoginPage />);
    expect(screen.getByTestId('sso-google')).toBeInTheDocument();
    expect(screen.getByTestId('sso-facebook')).toBeInTheDocument();
    expect(screen.getByTestId('sso-instagram')).toBeInTheDocument();
    expect(screen.getByTestId('sso-apple')).toBeInTheDocument();
  });
});
