import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import ForgotPasswordPage from '@/pages/forgot-password';

describe('ForgotPasswordPage', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    render(<ForgotPasswordPage />);
  });

test('renders page heading and form elements', () => {
    expect(screen.getByText(/Reset Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send Reset Link/i })).toBeInTheDocument();
  });

test('shows validation error when email is empty', async () => {
    const emailInput = screen.getByLabelText(/Email Address/i);
    await user.click(emailInput);
    await user.tab(); // blur

    expect(await screen.findByTestId('email-error')).toHaveTextContent('Email is required');
    expect(emailInput).toHaveAttribute('aria-invalid', 'true');
  });

test('shows validation error when email is invalid format', async () => {
    await user.type(screen.getByLabelText(/Email Address/i), 'invalid-email');
    await user.click(screen.getByRole('button', { name: /Send Reset Link/i }));

    expect(await screen.findByTestId('email-error')).toHaveTextContent(
      'Please enter a valid email address'
    );
  });

test('shows validation error when email is missing a valid domain', async () => {
    await user.type(screen.getByLabelText(/Email Address/i), 'test@invalid');
    await user.click(screen.getByRole('button', { name: /Send Reset Link/i }));

    expect(await screen.findByTestId('email-error')).toHaveTextContent(
      'Email must include a valid domain like ".com" or ".net"'
    );
  });

test('shows placeholder message when form is submitted with valid email', async () => {
    await user.type(screen.getByLabelText(/Email Address/i), 'someone@example.com');
    await user.click(screen.getByRole('button', { name: /Send Reset Link/i }));

    // Wait for async operation to complete (handleForgotPassword has 1000ms delay)
    expect(await screen.findByTestId('forgot-password-placeholder-message', {}, { timeout: 2000 })).toBeInTheDocument();
    expect(screen.getByTestId('return-to-login-button')).toBeInTheDocument();
  });

test('return to login button is accessible from both states', async () => {
    // Before submit
    expect(screen.getByTestId('return-to-login-button')).toBeInTheDocument();

    // After submit
    await user.type(screen.getByLabelText(/Email Address/i), 'another@example.com');
    await user.click(screen.getByRole('button', { name: /Send Reset Link/i }));

    expect(await screen.findByTestId('return-to-login-button')).toBeInTheDocument();
  });
});
