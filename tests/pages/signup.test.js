import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SignupPage from '@/pages/signup';
import * as supabaseModule from '@/lib/supabaseClient';
import { useModal } from '@/contexts/ModalContext';
import { useRouter } from 'next/router';
import { dbCreateUser } from '@/hooks/dbCreateUser';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/contexts/ModalContext', () => ({
  useModal: jest.fn(),
}));

jest.mock('@/lib/supabaseClient', () => ({
  auth: {
    signUp: jest.fn(),
  },
}));

jest.mock('@/hooks/dbCreateUser', () => ({
  dbCreateUser: jest.fn(),
}));

jest.spyOn(console, 'error').mockImplementation(() => {}); // Silence test logs

describe('SignupPage', () => {
  const mockPush = jest.fn();
  const mockSignUp = supabaseModule.auth.signUp;
  const mockShowSuccess = jest.fn();
  const mockShowError = jest.fn();

  const setup = () => {
    render(<SignupPage />);
  };

  const fillForm = async () => {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/Full Name/i), 'Test User');
    await user.type(screen.getByLabelText(/Email Address/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^Password$/i), 'Password123!');
    await user.type(screen.getByLabelText(/Confirm Password/i), 'Password123!');
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useRouter.mockReturnValue({
      push: mockPush,
      prefetch: jest.fn(),
      pathname: '/signup',
    });

    useModal.mockReturnValue({
      showErrorModal: mockShowError,
      showSuccessModal: mockShowSuccess,
    });
  });

  it('renders all form fields', () => {
    setup();

    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('updates password strength meter on input', async () => {
    setup();
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/^Password$/i), 'Pass');

    expect(screen.getByText(/Password Strength/i)).toBeInTheDocument();
  });

  it('shows validation errors on touched fields', async () => {
    setup();
    const user = userEvent.setup();

    // Touch each field to trigger validation without entering any data
    await user.click(screen.getByLabelText(/Full Name/i));
    await user.tab();
    await user.click(screen.getByLabelText(/Email Address/i));
    await user.tab();
    await user.click(screen.getByLabelText(/^Password$/i));
    await user.tab();
    await user.click(screen.getByLabelText(/Confirm Password/i));
    await user.tab();

    // Assert the specific error messages appear
    await waitFor(() => {
      expect(screen.getByTestId('name-error')).toHaveTextContent(/required/i);
      expect(screen.getByTestId('email-error')).toHaveTextContent(/required/i);
      expect(screen.getByTestId('password-error')).toHaveTextContent(/required/i);
      expect(screen.getByTestId('confirmPassword-error')).toHaveTextContent(/confirm/i);
    });
  });

  it('shows error when passwords do not match', async () => {
    setup();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/^Password$/i), 'Password123!');
    await user.type(screen.getByLabelText(/Confirm Password/i), 'Mismatch123!');

    await user.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/Passwords must match/i)).toBeInTheDocument();
    });
  });

  it('calls Supabase signup, inserts custom user, and shows success modal', async () => {
    mockSignUp.mockResolvedValue({
      data: { user: { id: '1234-uuid', email: 'test@example.com' } },
      error: null,
    });

    dbCreateUser.mockResolvedValue({
      user_id: '1234-uuid',
      name: 'Test User',
      email: 'test@example.com',
    });

    setup();
    await fillForm();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123!',
        options: {
          data: { full_name: 'Test User' },
          emailRedirectTo: expect.stringMatching(/\/dashboard$/),
        },
      });

      expect(dbCreateUser).toHaveBeenCalledWith({
        user_id: '1234-uuid',
        name: 'Test User',
        email: 'test@example.com',
      });

      expect(mockShowSuccess).toHaveBeenCalled();
    });
  });

  it('shows error modal if Supabase signup fails', async () => {
    mockSignUp.mockResolvedValue({
      data: { user: null },
      error: { message: 'Signup failed' },
    });

    setup();
    await fillForm();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('Signup failed', 'Signup Error');
    });
  });

  it('shows error modal if user is created in auth but DB insert fails', async () => {
    mockSignUp.mockResolvedValue({
      data: { user: { id: '1234-uuid', email: 'test@example.com' } },
      error: null,
    });

    dbCreateUser.mockRejectedValue(new Error('DB failure'));

    setup();
    await fillForm();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith(
        'Signup succeeded but an internal error occurred when saving your profile. Please contact support.',
        'Signup Incomplete'
      );
    });
  });

  it('shows duplicate email modal if Supabase returns already registered', async () => {
    mockSignUp.mockResolvedValue({
      data: { user: null },
      error: { message: 'User already registered' },
    });

    setup();
    await fillForm();
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith(
        'This email is already registered. Please log in instead or reset your password if needed.',
        'Email Already Registered'
      );
    });
  });

  it('renders login button and navigates correctly', () => {
    setup();
    const loginBtn = screen.getByTestId('login-button');
    expect(loginBtn).toBeInTheDocument();
    expect(loginBtn).toHaveAttribute('href', '/login');
  });
});
