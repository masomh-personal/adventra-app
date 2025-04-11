import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignupPage from '@/pages/signup';
import supabase from '@/lib/supabaseClient';
import { dbCreateUser } from '@/hooks/dbCreateUser';
import { useModal } from '@/contexts/ModalContext';
import { useRouter } from 'next/router';

jest.mock('@/lib/supabaseClient', () => ({
  auth: {
    signUp: jest.fn(),
  },
}));

jest.mock('@/hooks/dbCreateUser', () => ({
  dbCreateUser: jest.fn(),
}));

jest.mock('@/contexts/ModalContext', () => ({
  useModal: jest.fn(),
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('SignupPage', () => {
  const mockSignUp = supabase.auth.signUp;
  const mockCreateUser = dbCreateUser;
  const mockShowErrorModal = jest.fn();
  const mockShowSuccessModal = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useModal.mockReturnValue({
      showErrorModal: mockShowErrorModal,
      showSuccessModal: mockShowSuccessModal,
    });
    useRouter.mockReturnValue({ push: mockPush });
  });

  const fillSignupForm = async (user) => {
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
    mockCreateUser.mockResolvedValue({});

    render(<SignupPage />);
    await fillSignupForm(user);

    const button = screen.getByRole('button', { name: /Sign Up/i });
    expect(button).toBeEnabled();
    await user.click(button);

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'alex@example.com',
        password: 'Password123!',
        options: {
          data: { full_name: 'Alex Example' },
          emailRedirectTo: expect.stringContaining('/dashboard'),
        },
      });

      // Pull out the birthdate for ISO string comparison
      const createdUserArgs = mockCreateUser.mock.calls[0][0];
      expect(createdUserArgs.name).toBe('Alex Example');
      expect(createdUserArgs.email).toBe('alex@example.com');
      expect(createdUserArgs.user_id).toBe('fake-user-id');
      expect(createdUserArgs.birthdate).toBeInstanceOf(Date);
      expect(createdUserArgs.birthdate.toISOString().slice(0, 10)).toBe('1990-01-01');

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

    mockCreateUser.mockRejectedValue(new Error('DB insert failed'));

    render(<SignupPage />);
    await fillSignupForm(user);
    await user.click(screen.getByRole('button', { name: /Sign Up/i }));

    await waitFor(() => {
      expect(mockShowErrorModal).toHaveBeenCalledWith(
        expect.stringContaining('internal error occurred'),
        'Signup Incomplete'
      );
    });
  });
});
