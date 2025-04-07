import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ForgotPasswordPage from '../forgot-password';

// Mock Supabase client before importing component
jest.mock('@/lib/supabaseClient', () => ({
  __esModule: true,
  default: {
    auth: {
      resetPasswordForEmail: jest.fn(),
    },
  },
}));

const mockedSupabase = require('@/lib/supabaseClient').default;

describe('ForgotPasswordPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders page heading and form elements', () => {
    render(<ForgotPasswordPage />);

    expect(screen.getByText(/Reset Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send Reset Link/i })).toBeInTheDocument();
  });

  it('shows validation error when email is empty', async () => {
    render(<ForgotPasswordPage />);

    // Trigger validation by blurring the empty input
    const emailInput = screen.getByLabelText(/Email Address/i);
    await userEvent.click(emailInput);
    await userEvent.tab(); // move focus away to simulate blur

    expect(await screen.findByTestId('email-error')).toHaveTextContent('Email is required');
    expect(emailInput).toHaveAttribute('aria-invalid', 'true');
  });

  it('shows validation error when email is invalid format', async () => {
    render(<ForgotPasswordPage />);

    await userEvent.type(screen.getByLabelText(/Email Address/i), 'invalid-email');
    await userEvent.click(screen.getByRole('button', { name: /Send Reset Link/i }));

    expect(await screen.findByTestId('email-error')).toHaveTextContent(
      'Please enter a valid email address'
    );
  });

  it('shows validation error when email is missing a valid domain', async () => {
    render(<ForgotPasswordPage />);

    await userEvent.type(screen.getByLabelText(/Email Address/i), 'test@invalid');
    await userEvent.click(screen.getByRole('button', { name: /Send Reset Link/i }));

    expect(await screen.findByTestId('email-error')).toHaveTextContent(
      'Email must include a valid domain like ".com" or ".net"'
    );
  });

  it('displays success message on successful request', async () => {
    mockedSupabase.auth.resetPasswordForEmail.mockResolvedValueOnce({ error: null });

    render(<ForgotPasswordPage />);

    await userEvent.type(screen.getByLabelText(/Email Address/i), 'user@example.com');
    await userEvent.click(screen.getByRole('button', { name: /Send Reset Link/i }));

    expect(await screen.findByTestId('forgot-password-success')).toHaveTextContent(
      'If an account with user@example.com exists, you will receive password reset instructions shortly.'
    );

    // Uses findAllByText due to multiple instances of similar text
    const links = await screen.findAllByText(/Return to Login/i);
    expect(links.length).toBeGreaterThanOrEqual(1);
  });

  it('displays error message when reset request fails', async () => {
    mockedSupabase.auth.resetPasswordForEmail.mockResolvedValueOnce({
      error: { message: 'Something broke.' },
    });

    render(<ForgotPasswordPage />);

    await userEvent.type(screen.getByLabelText(/Email Address/i), 'fail@example.com');
    await userEvent.click(screen.getByRole('button', { name: /Send Reset Link/i }));

    expect(await screen.findByTestId('forgot-password-error')).toHaveTextContent(
      'Something broke.'
    );
  });
});
