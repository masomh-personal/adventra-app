import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignupPage from '@/pages/signup';

// Hoist mocks
const {
    mockShowErrorModal,
    mockShowSuccessModal,
    mockRouterPush,
    mockAccountCreate,
    mockCreateEmailSession,
    mockDbCreateUser,
} = vi.hoisted(() => ({
    mockShowErrorModal: vi.fn(),
    mockShowSuccessModal: vi.fn(),
    mockRouterPush: vi.fn(),
    mockAccountCreate: vi.fn(),
    mockCreateEmailSession: vi.fn(),
    mockDbCreateUser: vi.fn(),
}));

// Mock Appwrite client
vi.mock('@/lib/appwriteClient', () => ({
    account: {
        create: mockAccountCreate,
        createEmailSession: mockCreateEmailSession,
    },
    databases: {},
    storage: {},
    databaseId: 'test-db',
}));

// Mock Next.js router
vi.mock('next/router', () => ({
    useRouter: () => ({
        push: mockRouterPush,
        replace: vi.fn(),
        pathname: '/signup',
        query: {},
        asPath: '/signup',
        events: { on: vi.fn(), off: vi.fn() },
    }),
}));

// Mock ModalContext
vi.mock('@/contexts/ModalContext', () => ({
    useModal: () => ({
        showErrorModal: mockShowErrorModal,
        showSuccessModal: mockShowSuccessModal,
    }),
}));

// Mock dbCreateUser
vi.mock('@/hooks/dbCreateUser', () => ({
    dbCreateUser: mockDbCreateUser,
}));

// Mock Appwrite ID
vi.mock('appwrite', () => ({
    ID: {
        unique: vi.fn(() => 'generated-user-id'),
    },
}));

// Helpers
const renderPage = () => render(<SignupPage />);
const setupUser = () => userEvent.setup();

const fillSignupForm = async (
    user: ReturnType<typeof userEvent.setup>,
    data: {
        name: string;
        birthdate: string;
        email: string;
        password: string;
        confirmPassword: string;
    },
) => {
    await user.type(screen.getByLabelText(/full name/i), data.name);
    await user.type(screen.getByLabelText(/date of birth/i), data.birthdate);
    await user.type(screen.getByLabelText(/email address/i), data.email);
    await user.type(screen.getByLabelText(/^password$/i), data.password);
    await user.type(screen.getByLabelText(/confirm password/i), data.confirmPassword);
};

describe('SignupPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockRouterPush.mockResolvedValue(true);
    });

    describe('Initial Render', () => {
        it('renders signup form with all required fields', () => {
            renderPage();

            expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
        });

        it('shows login link for existing users', () => {
            renderPage();

            expect(screen.getByTestId('login-button')).toBeInTheDocument();
            expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
        });

        it('shows password strength meter when password is entered', async () => {
            renderPage();
            const user = setupUser();

            // Type a password to trigger the strength meter
            await user.type(screen.getByLabelText(/^password$/i), 'test');

            // Now password strength meter should be visible
            expect(screen.getByTestId('password-strength-meter')).toBeInTheDocument();
            expect(screen.getByText(/password strength/i)).toBeInTheDocument();
        });
    });

    describe('Successful Signup', () => {
        const validFormData = {
            name: 'John Doe',
            birthdate: '1990-01-01',
            email: 'john@example.com',
            password: 'StrongP@ss123',
            confirmPassword: 'StrongP@ss123',
        };

        it('creates account and shows success modal', async () => {
            const mockUser = { $id: 'user-123', name: 'John Doe', email: 'john@example.com' };
            mockAccountCreate.mockResolvedValue(mockUser);
            mockDbCreateUser.mockResolvedValue({ user_id: 'user-123' });
            mockCreateEmailSession.mockResolvedValue({ $id: 'session-123' });

            renderPage();
            const user = setupUser();

            await fillSignupForm(user, validFormData);
            await user.click(screen.getByTestId('button'));

            await waitFor(() => {
                expect(mockAccountCreate).toHaveBeenCalledWith(
                    'generated-user-id',
                    'john@example.com',
                    'StrongP@ss123',
                    'John Doe',
                );
            });

            await waitFor(() => {
                expect(mockDbCreateUser).toHaveBeenCalledWith({
                    user_id: 'user-123',
                    name: 'John Doe',
                    email: 'john@example.com',
                    birthdate: '1990-01-01',
                });
            });

            await waitFor(() => {
                expect(mockShowSuccessModal).toHaveBeenCalledWith(
                    expect.stringContaining('account is all set'),
                    'Signup Successful!',
                    expect.any(Function),
                    'Go to Homepage',
                );
            });
        });
    });

    describe('Error Handling', () => {
        const validFormData = {
            name: 'John Doe',
            birthdate: '1990-01-01',
            email: 'john@example.com',
            password: 'StrongP@ss123',
            confirmPassword: 'StrongP@ss123',
        };

        it('shows error when email already exists', async () => {
            mockAccountCreate.mockRejectedValue(new Error('User already exists'));

            renderPage();
            const user = setupUser();

            await fillSignupForm(user, validFormData);
            await waitFor(() => expect(screen.getByTestId('button')).toBeEnabled());
            await user.click(screen.getByTestId('button'));

            await waitFor(() => {
                expect(mockShowErrorModal).toHaveBeenCalledWith(
                    expect.stringContaining('already registered'),
                    'Email Already Registered',
                );
            });
        });

        it('shows error when auth succeeds but DB fails', async () => {
            const mockUser = { $id: 'user-123', name: 'John Doe', email: 'john@example.com' };
            mockAccountCreate.mockResolvedValue(mockUser);
            mockDbCreateUser.mockRejectedValue(new Error('Database error'));

            renderPage();
            const user = setupUser();

            await fillSignupForm(user, validFormData);
            await waitFor(() => expect(screen.getByTestId('button')).toBeEnabled());
            await user.click(screen.getByTestId('button'));

            await waitFor(() => {
                expect(mockShowErrorModal).toHaveBeenCalledWith(
                    expect.stringContaining('internal error'),
                    'Signup Incomplete',
                );
            });
        });

        it('shows generic error for unexpected failures', async () => {
            mockAccountCreate.mockRejectedValue(new Error('Network error'));

            renderPage();
            const user = setupUser();

            await fillSignupForm(user, validFormData);
            await waitFor(() => expect(screen.getByTestId('button')).toBeEnabled());
            await user.click(screen.getByTestId('button'));

            await waitFor(() => {
                expect(mockShowErrorModal).toHaveBeenCalledWith('Network error', 'Signup Error');
            });
        });
    });
});
