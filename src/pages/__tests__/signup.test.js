import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignupPage from '@/pages/signup';
import * as supabaseModule from '@/lib/supabaseClient';
import { useModal } from '@/contexts/ModalContext';
import { useRouter } from 'next/router';

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

// Silence test logs
jest.spyOn(console, 'error').mockImplementation(() => {});

describe('SignupPage', () => {
  const mockPush = jest.fn();
  const mockSignUp = supabaseModule.auth.signUp;
  const mockShowSuccess = jest.fn();
  const mockShowError = jest.fn();

  const setup = () => render(<SignupPage />);

  const fillForm = () => {
    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'Password123!' },
    });
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

  it('updates password strength meter on input', () => {
    setup();
    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: 'Pass' },
    });

    expect(screen.getByText(/Password Strength/i)).toBeInTheDocument();
  });

  it('shows validation errors on empty submit', async () => {
    setup();

    // Directly submit the form instead of clicking the disabled button
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('shows error when passwords do not match', async () => {
    setup();

    fireEvent.change(screen.getByLabelText(/^Password$/i), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'Mismatch123!' },
    });

    // Directly submit the form instead of clicking the disabled button
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(screen.getByText(/Passwords must match/i)).toBeInTheDocument();
    });
  });

  it('calls Supabase signup and shows success modal', async () => {
    mockSignUp.mockResolvedValue({
      data: { user: { email: 'test@example.com', identities: [{}] } },
      error: null,
    });

    setup();
    fillForm();

    // Directly submit the form instead of clicking the disabled button
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123!',
        options: {
          data: { full_name: 'Test User' },
          emailRedirectTo: expect.stringMatching(/\/dashboard$/),
        },
      });

      expect(mockShowSuccess).toHaveBeenCalled();
    });
  });

  it('shows error modal on Supabase failure', async () => {
    mockSignUp.mockResolvedValue({
      data: { user: null },
      error: { message: 'Signup failed' },
    });

    setup();
    fillForm();

    // Directly submit the form instead of clicking the disabled button
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith('Signup failed', 'Signup Error');
    });
  });

  it('renders login button and navigates correctly', () => {
    setup();
    const loginBtn = screen.getByTestId('login-button');
    expect(loginBtn).toBeInTheDocument();
    expect(loginBtn).toHaveAttribute('href', '/login');
  });
});
