import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import SignupPage from '@/pages/signup';
import supabase from '@/lib/supabaseClient';
import { dbCreateUser } from '@/hooks/dbCreateUser';
import { useModal } from '@/contexts/ModalContext';
import { useRouter } from 'next/router';
import { vi } from 'vitest';

// Hoist mocks - these will be available in mock factories
const { mockSignUp, mockDbCreateUser, mockUseModal, mockUseRouter } = vi.hoisted(() => {
  const mockSignUp = vi.fn();
  const mockDbCreateUser = vi.fn();
  const mockUseModal = vi.fn();
  const mockUseRouter = vi.fn();
  return { mockSignUp, mockDbCreateUser, mockUseModal, mockUseRouter };
});

vi.mock('@/lib/supabaseClient', () => ({
  __esModule: true,
  default: {
    auth: {
      signUp: mockSignUp,
    },
  },
}));

vi.mock('@/hooks/dbCreateUser', () => ({
  dbCreateUser: mockDbCreateUser,
}));

vi.mock('@/contexts/ModalContext', () => ({
  useModal: mockUseModal,
}));

vi.mock('next/router', () => ({
  useRouter: mockUseRouter,
}));

const mockedUseModal = vi.mocked(useModal);
const mockedUseRouter = vi.mocked(useRouter);
const mockedSupabase = supabase as { auth: { signUp: typeof mockSignUp } };
const mockedDbCreateUser = vi.mocked(dbCreateUser);

describe('SignupPage', () => {
  const mockShowErrorModal = vi.fn();
  const mockShowSuccessModal = vi.fn();
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseModal.mockReturnValue({
      openModal: vi.fn(),
      closeModal: vi.fn(),
      showErrorModal: mockShowErrorModal,
      showSuccessModal: mockShowSuccessModal,
      showInfoModal: vi.fn(),
      showConfirmationModal: vi.fn().mockResolvedValue(false),
    } as ReturnType<typeof useModal>);
    mockedUseRouter.mockReturnValue({ push: mockPush } as unknown as ReturnType<typeof useRouter>);
  });

  const fillSignupForm = async (user: ReturnType<typeof userEvent.setup>): Promise<void> => {
    await user.type(screen.getByLabelText('Full Name'), 'Alex Example');
    await user.type(screen.getByLabelText('Date of Birth'), '1990-01-01');
    await user.type(screen.getByLabelText('Email Address'), 'alex@example.com');
    await user.type(screen.getByLabelText('Password'), 'Password123!');
    await user.type(screen.getByLabelText('Confirm Password'), 'Password123!');
  };

  it('renders all expected fields and buttons', () => {
    render(<SignupPage />);

    expect(screen.getByText(/Create Your Account/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Date of Birth')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign Up/i })).toBeDisabled(); // Initially disabled
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
  });

  it('validates required fields and shows errors', async () => {
    const user = userEvent.setup();
    render(<SignupPage />);

    // Tabbing through all fields to trigger validation
    await user.tab(); // name
    await user.tab(); // birthdate
    await user.tab(); // email
    await user.tab(); // password
    await user.tab(); // confirm
    await user.tab(); // submit

    expect(await screen.findByText(/Name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Date of birth is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Please confirm your password/i)).toBeInTheDocument();
  });

  it('shows password strength meter once password is typed', async () => {
    const user = userEvent.setup();
    render(<SignupPage />);

    const passwordInput = screen.getByLabelText('Password');
    expect(screen.queryByTestId('strength-value')).not.toBeInTheDocument();

    await user.type(passwordInput, 'HelloWorld123');
    expect(screen.getByTestId('strength-value')).toBeInTheDocument();
  });

  it('submits successfully with valid fields', async () => {
    const user = userEvent.setup();

    const fakeUser = { id: 'fake-user-id' };
    mockSignUp.mockResolvedValue({ data: { user: fakeUser }, error: null });
    mockedDbCreateUser.mockResolvedValue({} as never);

    render(<SignupPage />);
    await fillSignupForm(user);

    const button = screen.getByRole('button', { name: /Sign Up/i });
    expect(button).toBeEnabled();
    await user.click(button);

    await waitFor(() => {
      // Assert correct supabase call
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'alex@example.com',
        password: 'Password123!',
        options: {
          data: { full_name: 'Alex Example' },
          emailRedirectTo: expect.stringContaining('/dashboard'),
        },
      });

      // Extract args passed to dbCreateUser and assert key fields
      const createArgs = mockedDbCreateUser.mock.calls[0]?.[0];

      expect(createArgs).toEqual(
        expect.objectContaining({
          user_id: 'fake-user-id',
          name: 'Alex Example',
          email: 'alex@example.com',
        })
      );

      // Ensure the birthdate matches (it might be a Date or string depending on implementation)
      const birthdate = createArgs?.birthdate;
      if (birthdate instanceof Date) {
        expect(birthdate.toISOString().slice(0, 10)).toBe('1990-01-01');
      } else {
        // If it's a string, just check it contains the date
        expect(String(birthdate)).toContain('1990-01-01');
      }

      // Confirm success modal triggered
      expect(mockShowSuccessModal).toHaveBeenCalledWith(
        expect.stringContaining('Your account is all set'),
        'Signup Successful!',
        expect.any(Function),
        'Go to Homepage'
      );
    });
  });

  it('shows error modal when Supabase fails', async () => {
    const user = userEvent.setup();
    mockSignUp.mockResolvedValue({
      error: { message: 'User already registered' },
      data: {},
    });

    render(<SignupPage />);
    await fillSignupForm(user);
    await user.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(mockShowErrorModal).toHaveBeenCalledWith(
        expect.stringContaining('already registered'),
        'Email Already Registered'
      );
    });
  });

  it('shows error modal if dbCreateUser fails after signup', async () => {
    const user = userEvent.setup();

    mockSignUp.mockResolvedValue({
      data: { user: { id: 'abc123' } },
      error: null,
    });

    mockedDbCreateUser.mockRejectedValue(new Error('DB insert failed'));

    // Suppress expected error log in this test only
    const originalConsoleError = console.error;
    console.error = vi.fn();

    render(<SignupPage />);
    await fillSignupForm(user);
    await user.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(mockShowErrorModal).toHaveBeenCalledWith(
        expect.stringContaining('internal error occurred'),
        'Signup Incomplete'
      );
    });

    // Restore after test to avoid hiding unexpected errors elsewhere
    console.error = originalConsoleError;
  });
});
